import { Zip, ZipDeflate, ZipPassThrough } from "fflate";
import { useCallback, useRef, useState } from "react";
import { type DriveFileEntry, getDriveFileUrl } from "@/api/drive";
import type { DownloadState } from "./types";

const CONCURRENCY = 3;
const MAX_RETRIES = 3;

async function pooled(
  items: DriveFileEntry[],
  limit: number,
  fn: (item: DriveFileEntry) => Promise<void>,
  maxRetries = 0,
): Promise<void> {
  const queue = [...items];
  const retryCounts = new Map<DriveFileEntry, number>();
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item === undefined) continue;
        try {
          await fn(item);
        } catch (err) {
          const attempts = (retryCounts.get(item) ?? 0) + 1;
          retryCounts.set(item, attempts);
          if (attempts <= maxRetries) {
            queue.push(item);
          } else {
            throw err;
          }
        }
      }
    },
  );
  await Promise.all(workers);
}

export function useDownloadJob(
  selectedFiles: DriveFileEntry[],
  compressionLevel: number,
) {
  const [state, setState] = useState<DownloadState>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const startDownload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    // Try to stream directly to disk. Falls back to blob if unsupported.
    let writableStream: FileSystemWritableFileStream | null = null;
    if ("showSaveFilePicker" in window) {
      setState({ phase: "picking" });
      try {
        const handle = await showSaveFilePicker({
          suggestedName: "unofficial-neuro-karaoke-archive.zip",
          types: [
            {
              description: "ZIP archive",
              accept: { "application/zip": [".zip"] },
            },
          ],
        });
        writableStream = await handle.createWritable();
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setState({ phase: "idle" });
          return;
        }
        // Unexpected error: fall through to in-memory blob
      }
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const bytesTotal = selectedFiles.reduce((s, f) => s + f.sizeBytes, 0);
    let filesDone = 0;
    let bytesDownloaded = 0;
    const activeFiles = new Set<string>();

    const pushState = () =>
      setState({
        phase: "downloading",
        progress: {
          filesDone,
          filesTotal: selectedFiles.length,
          bytesDownloaded,
          bytesTotal,
          activeFiles: Array.from(activeFiles),
        },
      });

    pushState();

    // Sequential write queue for the file stream (writes must not overlap)
    let writeChain: Promise<void> = Promise.resolve();
    // Blob fallback: accumulate compressed output chunks
    const zipChunks: Uint8Array[] = [];

    const zip = new Zip((err, data) => {
      if (err) return;
      const chunk = data.slice();
      if (writableStream) {
        writeChain = writeChain.then(() => writableStream.write(chunk));
      } else {
        zipChunks.push(chunk);
      }
    });

    try {
      await pooled(
        selectedFiles,
        CONCURRENCY,
        async (file) => {
          if (controller.signal.aborted) return;

          activeFiles.add(file.relativePath);
          pushState();

          const response = await fetch(getDriveFileUrl(file.id), {
            signal: controller.signal,
          });
          if (!response.ok)
            throw new Error(`Download failed: ${response.status}`);

          const zipEntry =
            compressionLevel === 0
              ? new ZipPassThrough(file.relativePath)
              : new ZipDeflate(file.relativePath, {
                  level: compressionLevel as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
                });
          zip.add(zipEntry);

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("Failed to get reader from response body");
          }

          let readResult = await reader.read();
          while (!readResult.done) {
            zipEntry.push(readResult.value, false);
            bytesDownloaded += readResult.value.byteLength;
            pushState();
            readResult = await reader.read();
          }
          zipEntry.push(new Uint8Array(0), true);

          activeFiles.delete(file.relativePath);
          filesDone++;
          pushState();
        },
        MAX_RETRIES,
      );

      if (controller.signal.aborted) {
        if (writableStream) await writableStream.abort().catch(() => {});
        setState({ phase: "idle" });
        return;
      }

      zip.end();

      if (writableStream) {
        await writeChain;
        await writableStream.close();
      } else {
        // Blob download fallback
        const blob = new Blob(
          zipChunks.map((c) => c.buffer as ArrayBuffer),
          { type: "application/zip" },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "unofficial-neuro-karaoke-archive.zip";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      }

      setState({ phase: "idle" });
    } catch (err) {
      if (writableStream) await writableStream.abort().catch(() => {});
      if ((err as Error).name === "AbortError") {
        setState({ phase: "idle" });
      } else {
        setState({
          phase: "error",
          message: err instanceof Error ? err.message : "Download failed",
        });
      }
    }
  }, [selectedFiles, compressionLevel]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ phase: "idle" });
  }, []);

  return { state, startDownload, cancel };
}

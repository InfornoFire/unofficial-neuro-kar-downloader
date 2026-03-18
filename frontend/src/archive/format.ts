import type { DownloadProgress } from "./types";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(1)} ${units[i]}`;
}

export function downloadProgressValue(progress: DownloadProgress): number {
  if (progress.filesTotal === 0) return 0;
  return Math.round((progress.filesDone / progress.filesTotal) * 100);
}

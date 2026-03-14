import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DownloadState } from "./types";
import { downloadProgressValue, formatBytes } from "./utils";

interface Props {
  state: DownloadState;
}

export function JobStatusDisplay({ state }: Props) {
  if (state.phase === "error") {
    return <p className="text-sm text-destructive">{state.message}</p>;
  }

  if (state.phase !== "downloading") return null;

  const { progress } = state;
  const pct = downloadProgressValue(progress);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Progress value={pct} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {progress.filesDone} / {progress.filesTotal} files
          </span>
          <span>{formatBytes(progress.bytesDownloaded)}</span>
        </div>
      </div>

      {progress.activeFiles.length > 0 && (
        <ScrollArea className="h-24 rounded border">
          <div className="px-2 py-1">
            {progress.activeFiles.map((path) => (
              <p
                key={path}
                className="truncate py-0.5 text-xs text-muted-foreground"
              >
                {path}
              </p>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

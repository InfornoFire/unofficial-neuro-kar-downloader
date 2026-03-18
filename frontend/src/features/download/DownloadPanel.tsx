import { X } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDownloadJob } from "./hooks/useDownloadJob";
import { useFileSelection } from "./hooks/useFileSelection";
import { JobStatusDisplay } from "./JobStatusDisplay";
import { PanelActions } from "./PanelActions";

export function DownloadPanel() {
  const [compressionLevel, setCompressionLevel] = useState(0);

  const {
    isLoading,
    tree,
    selectedPaths,
    selectedCount,
    totalCount,
    toggleFile,
    toggleFolder,
    selectAll,
    deselectAll,
    selectedFiles,
    removedCount,
    dismissRemovedNotification,
  } = useFileSelection();

  const { state, startDownload, cancel } = useDownloadJob(
    selectedFiles,
    compressionLevel,
  );

  const isIdle = state.phase === "idle" || state.phase === "error";

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Download Archive</CardTitle>
        <CardDescription>
          {isIdle && selectedCount > 0
            ? `${selectedCount.toLocaleString()} of ${totalCount.toLocaleString()} files selected`
            : "Package and download the audio archive."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {removedCount > 0 && (
          <div className="flex items-start justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {removedCount} previously selected{" "}
              {removedCount === 1 ? "file" : "files"} no longer exist in the
              archive and {removedCount === 1 ? "was" : "were"} removed from
              your selection.
            </span>
            <button
              type="button"
              onClick={dismissRemovedNotification}
              className="mt-0.5 shrink-0 text-muted-foreground opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <JobStatusDisplay state={state} />
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <PanelActions
          state={state}
          selectedCount={selectedCount}
          totalCount={totalCount}
          tree={tree}
          selectedPaths={selectedPaths}
          isLoading={isLoading}
          compressionLevel={compressionLevel}
          onToggleFile={toggleFile}
          onToggleFolder={toggleFolder}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onDownload={startDownload}
          onCancel={cancel}
          onCompressionLevelChange={setCompressionLevel}
        />
      </CardFooter>
    </Card>
  );
}

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { JobStatusDisplay } from "./JobStatusDisplay";
import { PanelActions } from "./PanelActions";
import { useDownloadJob } from "./useDownloadJob";
import { useFileSelection } from "./useFileSelection";

export function DownloadPanel() {
  const [compressionLevel, setCompressionLevel] = useState(0);
  const { isSignedIn } = useAuth();

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
        <JobStatusDisplay state={state} />
      </CardContent>

      <CardFooter className="flex gap-2">
        <PanelActions
          state={state}
          selectedCount={selectedCount}
          totalCount={totalCount}
          tree={tree}
          selectedPaths={selectedPaths}
          isLoading={isLoading}
          isAuthenticated={isSignedIn}
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

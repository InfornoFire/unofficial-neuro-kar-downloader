import { Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArchiveOptionsPopover } from "./ArchiveOptionsPopover";
import { FileNavigatorModal } from "./FileNavigatorModal";
import type { FolderNode, TreeNode } from "./tree";
import type { DownloadState } from "./types";

export interface PanelActionsProps {
  state: DownloadState;
  selectedCount: number;
  totalCount: number;
  tree: TreeNode[];
  selectedPaths: ReadonlySet<string>;
  isLoading: boolean;
  isAuthenticated: boolean;
  compressionLevel: number;
  onToggleFile: (path: string) => void;
  onToggleFolder: (node: FolderNode) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDownload: () => void;
  onCancel: () => void;
  onCompressionLevelChange: (level: number) => void;
}

export function PanelActions({
  state,
  selectedCount,
  totalCount,
  tree,
  selectedPaths,
  isLoading,
  isAuthenticated,
  compressionLevel,
  onToggleFile,
  onToggleFolder,
  onSelectAll,
  onDeselectAll,
  onDownload,
  onCancel,
  onCompressionLevelChange,
}: PanelActionsProps) {
  const isIdle = state.phase === "idle" || state.phase === "error";

  const downloadLabel =
    selectedCount === 0
      ? "Download All"
      : `Download (${selectedCount.toLocaleString()})`;

  return (
    <>
      {isIdle && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  onClick={onDownload}
                  className="gap-2"
                  disabled={!isAuthenticated}
                >
                  <Download className="h-4 w-4" />
                  {downloadLabel}
                </Button>
              </span>
            </TooltipTrigger>
            {!isAuthenticated && (
              <TooltipContent className="max-w-64">
                <p>
                  Sign in with Google is required to make Google Drive API
                  calls. Your account is never read and no information is
                  stored.
                </p>
              </TooltipContent>
            )}
          </Tooltip>
          <FileNavigatorModal
            tree={tree}
            selectedCount={selectedCount}
            totalCount={totalCount}
            selectedPaths={selectedPaths}
            isLoading={isLoading}
            onToggleFile={onToggleFile}
            onToggleFolder={onToggleFolder}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
          />
          <ArchiveOptionsPopover
            compressionLevel={compressionLevel}
            onChange={onCompressionLevelChange}
          />
        </>
      )}

      {state.phase === "picking" && (
        <Button disabled className="gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving…
        </Button>
      )}

      {state.phase === "downloading" && (
        <Button variant="outline" onClick={onCancel} className="gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>
      )}
    </>
  );
}

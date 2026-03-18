import { Download, Loader2, X } from "lucide-react";
import { useState } from "react";
import type { FolderNode, TreeNode } from "@/archive/tree";
import type { DownloadState } from "@/archive/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArchiveOptionsPopover } from "./ArchiveOptionsPopover";
import { FileNavigatorModal } from "./FileNavigatorModal";

export interface PanelActionsProps {
  state: DownloadState;
  selectedCount: number;
  totalCount: number;
  tree: TreeNode[];
  selectedPaths: ReadonlySet<string>;
  isLoading: boolean;
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
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const downloadLabel =
    selectedCount === 0
      ? "Download All"
      : `Download (${selectedCount.toLocaleString()})`;

  return (
    <>
      {isIdle && (
        <>
          <Button onClick={onDownload} className="gap-2">
            <Download className="h-4 w-4" />
            {downloadLabel}
          </Button>
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
        <>
          <Button
            variant="outline"
            onClick={() => setCancelConfirmOpen(true)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Cancel Download?</DialogTitle>
                <DialogDescription>
                  The download in progress will be stopped and you will need to
                  start over.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCancelConfirmOpen(false)}
                >
                  Keep Downloading
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onCancel();
                    setCancelConfirmOpen(false);
                  }}
                >
                  Cancel Download
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

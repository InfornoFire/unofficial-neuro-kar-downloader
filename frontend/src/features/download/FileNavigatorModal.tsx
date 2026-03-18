import {
  ArrowLeft,
  ChevronRight,
  Files,
  Folder,
  Home,
  Loader2,
  Music,
  Search,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import {
  type FileNode,
  type FolderCheckState,
  type FolderNode,
  filterTree,
  getFolderCheckState,
  type TreeNode,
} from "@/archive/tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxDisplay } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function flattenFiles(nodes: TreeNode[]): FileNode[] {
  const result: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") result.push(node);
    else result.push(...flattenFiles(node.children));
  }
  return result;
}

function FileRow({
  node,
  selectedPaths,
  onToggleFile,
  showParent,
}: {
  node: FileNode;
  selectedPaths: ReadonlySet<string>;
  onToggleFile: (path: string) => void;
  showParent?: boolean;
}) {
  const path = node.entry.relativePath;
  const checked = selectedPaths.has(path);

  const segments = path.split("/");
  const parentDir =
    segments.length > 1 ? segments.slice(0, -1).join("/") : null;

  return (
    <label
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-accent"
      onMouseDown={(e) => e.preventDefault()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggleFile(path)}
        className="sr-only"
      />
      <CheckboxDisplay checked={checked} className="shrink-0" />
      <Music className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="truncate text-sm">{node.entry.name}</p>
        {showParent && parentDir && (
          <p className="truncate text-xs text-muted-foreground">{parentDir}</p>
        )}
      </div>
    </label>
  );
}

function FolderRow({
  node,
  selectedPaths,
  onToggleFolder,
  onNavigate,
}: {
  node: FolderNode;
  selectedPaths: ReadonlySet<string>;
  onToggleFolder: (node: FolderNode) => void;
  onNavigate: (node: FolderNode) => void;
}) {
  const checkState: FolderCheckState = getFolderCheckState(node, selectedPaths);

  return (
    <div className="flex select-none items-center gap-3 rounded-sm px-3 py-2 hover:bg-accent">
      <Checkbox
        checked={
          checkState === "indeterminate"
            ? "indeterminate"
            : checkState === "checked"
        }
        onCheckedChange={() => onToggleFolder(node)}
        className="shrink-0"
      />
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onNavigate(node)}
      >
        <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{node.name}</span>
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </div>
  );
}

interface FileNavigatorModalProps {
  tree: TreeNode[];
  selectedCount: number;
  totalCount: number;
  selectedPaths: ReadonlySet<string>;
  isLoading: boolean;
  onToggleFile: (path: string) => void;
  onToggleFolder: (node: FolderNode) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function FileNavigatorModal({
  tree,
  selectedCount,
  totalCount,
  selectedPaths,
  isLoading,
  onToggleFile,
  onToggleFolder,
  onSelectAll,
  onDeselectAll,
}: FileNavigatorModalProps) {
  const [open, setOpen] = useState(false);
  const [navStack, setNavStack] = useState<FolderNode[]>([]);
  const [inputValue, setInputValue] = useState("");

  const deferredQuery = useDeferredValue(inputValue);
  const isStale = inputValue !== deferredQuery;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setNavStack([]);
      setInputValue("");
    }
  };

  const navigateInto = (folder: FolderNode) => {
    setNavStack((prev) => [...prev, folder]);
  };

  const navigateBack = () => {
    setNavStack((prev) => prev.slice(0, -1));
  };

  const navigateToBreadcrumb = (index: number) => {
    setNavStack((prev) => prev.slice(0, index + 1));
  };

  const isSearching = inputValue.length > 0;

  const currentNodes: TreeNode[] =
    navStack.length === 0 ? tree : navStack[navStack.length - 1].children;

  const flatSearchResults = useMemo(
    () =>
      deferredQuery
        ? flattenFiles(filterTree(tree, deferredQuery.toLowerCase()))
        : [],
    [tree, deferredQuery],
  );

  const selectionLabel =
    selectedCount === 0
      ? `All ${totalCount.toLocaleString()} files`
      : `${selectedCount.toLocaleString()} / ${totalCount.toLocaleString()} selected`;

  return (
    <>
      <Button
        variant="outline"
        className="relative gap-2"
        aria-label="Select files"
        onClick={() => setOpen(true)}
      >
        <Files className="h-4 w-4" />
        <span>Select files</span>
        {selectedCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -right-2 -top-2 h-5 min-w-5 px-1 text-xs"
          >
            {selectedCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          aria-describedby={undefined}
          className="flex h-[min(85vh,700px)] max-w-2xl flex-col gap-0 p-0"
        >
          <DialogHeader className="shrink-0 border-b px-4 pb-4 pt-5">
            <div className="flex items-center gap-2">
              {navStack.length > 0 && !isSearching && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={navigateBack}
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="flex min-w-0 flex-wrap items-center gap-1 text-base font-semibold">
                {isSearching ? (
                  <span>Search results</span>
                ) : (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded text-muted-foreground hover:text-foreground"
                      onClick={() => setNavStack([])}
                    >
                      <Home className="h-4 w-4" />
                    </button>
                    {navStack.map((folder, i) => (
                      <span
                        key={folder.folderPath}
                        className="flex items-center gap-1"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <button
                          type="button"
                          className={`max-w-50 truncate rounded text-sm hover:underline ${
                            i === navStack.length - 1
                              ? "font-medium"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => navigateToBreadcrumb(i)}
                        >
                          {folder.name}
                        </button>
                      </span>
                    ))}
                  </>
                )}
              </DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectionLabel}
              {selectedCount === 0 && " — all will be included"}
            </p>
          </DialogHeader>

          <div className="shrink-0 border-b px-4 py-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {isStale && (
                <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
              <Input
                placeholder="Search by name…"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-8 pr-8"
              />
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="py-1">
              {isLoading && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Loading files…
                </p>
              )}

              {/* Search results (no entries) */}
              {!isLoading &&
                isSearching &&
                flatSearchResults.length === 0 &&
                !isStale && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No files match the search.
                  </p>
                )}

              {/* Search results (has entries) */}
              {!isLoading &&
                isSearching &&
                flatSearchResults.map((node) => (
                  <FileRow
                    key={node.entry.relativePath}
                    node={node}
                    selectedPaths={selectedPaths}
                    onToggleFile={onToggleFile}
                    showParent
                  />
                ))}

              {/* Navigation results (no entries) */}
              {!isLoading && !isSearching && currentNodes.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No files found.
                </p>
              )}

              {/* Navigation results (has entries) */}
              {!isLoading &&
                !isSearching &&
                currentNodes.map((node) =>
                  node.type === "folder" ? (
                    <FolderRow
                      key={node.folderPath}
                      node={node}
                      selectedPaths={selectedPaths}
                      onToggleFolder={onToggleFolder}
                      onNavigate={navigateInto}
                    />
                  ) : (
                    <FileRow
                      key={node.entry.relativePath}
                      node={node}
                      selectedPaths={selectedPaths}
                      onToggleFile={onToggleFile}
                    />
                  ),
                )}
            </div>
          </ScrollArea>

          <div className="shrink-0 flex gap-2 border-t px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={isLoading}
            >
              Select all
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              disabled={isLoading || selectedCount === 0}
            >
              Deselect all
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { fetchArchiveFiles } from "@/api/drive";
import { buildTree, type FolderNode, getAllDescendantPaths } from "./tree";

export function useFileSelection() {
  const { data, isLoading } = useQuery({
    queryKey: ["drive-files"],
    queryFn: () => fetchArchiveFiles(),
    staleTime: Infinity,
  });

  const [selectedPaths, setSelectedPaths] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const allFiles = data ?? [];
  const totalCount = allFiles.length;
  const tree = useMemo(() => buildTree(allFiles), [allFiles]);
  const selectedCount = selectedPaths.size;

  const toggleFile = useCallback((path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const toggleFolder = useCallback((node: FolderNode) => {
    const allPaths = getAllDescendantPaths(node);
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      const allSelected = allPaths.every((p) => prev.has(p));
      if (allSelected) {
        allPaths.forEach((p) => {
          next.delete(p);
        });
      } else {
        allPaths.forEach((p) => {
          next.add(p);
        });
      }
      return next;
    });
  }, []);

  // Empty selection means all files
  const selectedFiles = useMemo(
    () =>
      selectedPaths.size === 0
        ? allFiles
        : allFiles.filter((f) => selectedPaths.has(f.relativePath)),
    [allFiles, selectedPaths],
  );

  return {
    isLoading,
    tree,
    selectedPaths,
    selectedCount,
    totalCount,
    toggleFile,
    toggleFolder,
    selectedFiles,
  };
}

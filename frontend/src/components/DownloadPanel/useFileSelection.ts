import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchArchiveFiles } from "@/api/drive";
import { buildTree, type FolderNode, getAllDescendantPaths } from "./tree";

const SELECTION_LS_KEY = "selected-paths-v1";

function loadSavedPaths(): ReadonlySet<string> {
  try {
    const raw = localStorage.getItem(SELECTION_LS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed as string[]);
  } catch {
    return new Set();
  }
}

export function useFileSelection() {
  const { data, isLoading } = useQuery({
    queryKey: ["drive-files"],
    queryFn: () => fetchArchiveFiles(),
    staleTime: Infinity,
  });

  const savedPathsRef = useRef(loadSavedPaths());
  const [selectedPaths, setSelectedPaths] = useState<ReadonlySet<string>>(
    savedPathsRef.current,
  );
  const [removedCount, setRemovedCount] = useState(0);
  const hasValidated = useRef(false);

  const allFiles = data ?? [];
  const totalCount = allFiles.length;
  const tree = useMemo(() => buildTree(allFiles), [allFiles]);
  const selectedCount = selectedPaths.size;

  // Once the file list loads, remove any saved paths that no longer exist
  useEffect(() => {
    if (!data || hasValidated.current) return;
    hasValidated.current = true;

    const initial = savedPathsRef.current;
    if (initial.size === 0) return;

    const validPaths = new Set(data.map((f) => f.relativePath));
    const cleaned = new Set([...initial].filter((p) => validPaths.has(p)));
    const removed = initial.size - cleaned.size;
    if (removed > 0) {
      setSelectedPaths(cleaned);
      setRemovedCount(removed);
    }
  }, [data]);

  // Persist selection to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        SELECTION_LS_KEY,
        JSON.stringify([...selectedPaths]),
      );
    } catch {
      // Ignore storage errors
    }
  }, [selectedPaths]);

  const dismissRemovedNotification = useCallback(() => setRemovedCount(0), []);

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

  const selectAll = useCallback(() => {
    setSelectedPaths(new Set(allFiles.map((f) => f.relativePath)));
  }, [allFiles]);

  const deselectAll = useCallback(() => {
    setSelectedPaths(new Set());
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
    selectAll,
    deselectAll,
    selectedFiles,
    removedCount,
    dismissRemovedNotification,
  };
}

import type { DriveFileEntry } from "@/api/drive";

export interface FolderNode {
  type: "folder";
  name: string;
  folderPath: string;
  children: TreeNode[];
}

export interface FileNode {
  type: "file";
  entry: DriveFileEntry;
}

export type TreeNode = FolderNode | FileNode;

export type FolderCheckState = "checked" | "unchecked" | "indeterminate";

function matchesQuery(entry: DriveFileEntry, q: string): boolean {
  return entry.name.toLowerCase().includes(q);
}

export function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  const result: TreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      if (matchesQuery(node.entry, q)) result.push(node);
    } else {
      const filteredChildren = filterTree(node.children, q);
      if (filteredChildren.length > 0) {
        result.push({ ...node, children: filteredChildren });
      }
    }
  }
  return result;
}

export function buildTree(files: DriveFileEntry[]): TreeNode[] {
  const folderMap = new Map<string, FolderNode>();
  const result: TreeNode[] = [];

  for (const file of files) {
    const segments = file.relativePath.split("/");

    if (segments.length === 1) {
      result.push({ type: "file", entry: file });
      continue;
    }

    let currentList = result;
    let currentPath = "";

    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      currentPath = currentPath ? `${currentPath}/${seg}` : seg;

      if (!folderMap.has(currentPath)) {
        const folder: FolderNode = {
          type: "folder",
          name: seg,
          folderPath: currentPath,
          children: [],
        };
        folderMap.set(currentPath, folder);
        currentList.push(folder);
      }

      currentList = folderMap.get(currentPath)?.children ?? [];
    }

    currentList.push({ type: "file", entry: file });
  }

  return result;
}

export function getAllDescendantPaths(node: FolderNode): string[] {
  const paths: string[] = [];
  for (const child of node.children) {
    if (child.type === "file") {
      paths.push(child.entry.relativePath);
    } else {
      paths.push(...getAllDescendantPaths(child));
    }
  }
  return paths;
}

export function getFolderCheckState(
  node: FolderNode,
  selectedPaths: ReadonlySet<string>,
): FolderCheckState {
  const descendants = getAllDescendantPaths(node);
  if (descendants.length === 0) return "unchecked";
  const selectedCount = descendants.filter((p) => selectedPaths.has(p)).length;
  if (selectedCount === 0) return "unchecked";
  if (selectedCount === descendants.length) return "checked";
  return "indeterminate";
}

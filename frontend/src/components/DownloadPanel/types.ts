export interface DownloadProgress {
  filesDone: number;
  filesTotal: number;
  bytesDownloaded: number;
  bytesTotal: number;
  activeFiles: string[];
}

export type DownloadState =
  | { phase: "idle" }
  | { phase: "picking" }
  | { phase: "downloading"; progress: DownloadProgress }
  | { phase: "error"; message: string };

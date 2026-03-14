export const ARCHIVE_FOLDER_ID = "1B1VaWp-mCKk15_7XpFnImsTdBJPOGx7a";
export const GDRIVE_API_KEY = "AIzaSyCT3kLVgIZisiBFw_kdS236098Iiz9imV8";

const CACHE_KEY = "drive-files-v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface DriveFileEntry {
  id: string;
  name: string;
  relativePath: string;
  sizeBytes: number;
}

interface DriveApiFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

interface DriveFilesResponse {
  nextPageToken?: string;
  files: DriveApiFile[];
}

const FOLDER_MIME = "application/vnd.google-apps.folder";

async function driveGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  console.log("GDrive API GET", url, res.status);
  if (!res.ok) {
    throw new Error(`Google Drive API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function walkFolder(
  folderId: string,
  currentPath: string,
  out: DriveFileEntry[],
): Promise<void> {
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({
      key: GDRIVE_API_KEY,
      q: `'${folderId}' in parents and trashed=false`,
      fields: "nextPageToken,files(id,name,mimeType,size)",
      pageSize: "1000",
      orderBy: "name",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const data = await driveGet<DriveFilesResponse>(
      `https://www.googleapis.com/drive/v3/files?${params}`,
    );

    for (const file of data.files) {
      const relPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      if (file.mimeType === FOLDER_MIME) {
        await walkFolder(file.id, relPath, out);
      } else {
        out.push({
          id: file.id,
          name: file.name,
          relativePath: relPath,
          sizeBytes: file.size ? Number(file.size) : 0,
        });
      }
    }

    pageToken = data.nextPageToken;
  } while (pageToken);
}

interface CacheEntry {
  files: DriveFileEntry[];
  timestamp: number;
}

export async function fetchArchiveFiles(): Promise<DriveFileEntry[]> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        return entry.files;
      }
    }
  } catch {
    // Corrupted or unavailable cache, fall through
  }

  const files: DriveFileEntry[] = [];
  await walkFolder(ARCHIVE_FOLDER_ID, "", files);

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ files, timestamp: Date.now() } satisfies CacheEntry),
    );
  } catch {
    // Storage quota exceeded, ignore
  }

  return files;
}

export function getDriveFileUrl(fileId: string): string {
  const params = new URLSearchParams({ key: GDRIVE_API_KEY, alt: "media" });
  return `https://www.googleapis.com/drive/v3/files/${fileId}?${params}`;
}

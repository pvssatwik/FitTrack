/**
 * Safe archive unpacking (TODO, needed for the Fitbit route). Requirements:
 *  - cap uncompressed size and file count (zip bombs)
 *  - reject entries whose path escapes the target dir ("../", absolute paths)
 *  - never trust file extensions; whitelist needed files by path
 *  - handle multi-part archives
 */
export const ARCHIVE_LIMITS = {
  maxCompressedBytes: 500 * 1024 * 1024,
  maxUncompressedBytes: 2 * 1024 * 1024 * 1024,
  maxFiles: 20_000,
};

export function isSafeEntryPath(p: string): boolean {
  if (p.startsWith('/') || /^[a-zA-Z]:/.test(p)) return false;
  return !p.split(/[\\/]/).includes('..');
}

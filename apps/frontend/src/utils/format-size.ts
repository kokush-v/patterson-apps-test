/**
 * Formats a given number of bytes into a human-readable string representation.
 *
 * @param bytes - The number of bytes to format.
 * @returns A string representing the formatted size in appropriate units (Bytes, KB, MB, GB).
 *
 * @example
 * ```typescript
 * formatBytes(1024); // "1.00 KB"
 * formatBytes(1048576); // "1.00 MB"
 * formatBytes(500); // "500 Bytes"
 * ```
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const sizes = ['KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i - 1] || 'Bytes'}`;
}

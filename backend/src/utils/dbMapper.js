/**
 * Normalizes SQL Server PascalCase column rows to include standard camelCase properties.
 * Preserves original keys so existing code expecting either casing continues to work seamlessly.
 */
export function mapRow(row) {
  if (!row || typeof row !== 'object') return row;
  const mapped = { ...row };
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    if (!(camelKey in mapped)) {
      mapped[camelKey] = value;
    }
  }
  return mapped;
}

export function mapRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(mapRow);
}

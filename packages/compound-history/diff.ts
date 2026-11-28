import { isDeepStrictEqual } from "node:util";

export type Row = { slug: string; name: string } & Record<string, unknown>;
export type Change =
  | { kind: "added" | "removed"; slug: string; name: string }
  | { kind: "changed"; slug: string; name: string; field: string; before: unknown; after: unknown };

export function indexRows(rows: readonly Row[]) {
  const index = new Map<string, Row>();
  for (const row of rows) {
    if (typeof row.slug !== "string" || !row.slug.trim() || index.has(row.slug)) {
      throw new Error(`Invalid or duplicate compound slug: ${row.slug}`);
    }
    index.set(row.slug, row);
  }
  return index;
}

export function compareCompounds(previous: readonly Row[], current: readonly Row[]): Change[] {
  const before = indexRows(previous);
  const after = indexRows(current);
  const changes: Change[] = [];
  for (const slug of [...new Set([...before.keys(), ...after.keys()])].sort()) {
    const left = before.get(slug);
    const right = after.get(slug);
    if (!left && right) changes.push({ kind: "added", slug, name: right.name });
    if (!right && left) changes.push({ kind: "removed", slug, name: left.name });
    if (!left || !right) continue;
    for (const field of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
      const oldValue = Object.hasOwn(left, field) ? left[field] : undefined;
      const newValue = Object.hasOwn(right, field) ? right[field] : undefined;
      if (!isDeepStrictEqual(oldValue, newValue)) {
        changes.push({ kind: "changed", slug, name: right.name, field, before: oldValue, after: newValue });
      }
    }
  }
  return changes;
}

export function changeId(change: Change) {
  const slug = encodeURIComponent(change.slug);
  return change.kind === "changed"
    ? `changed:${slug}:${encodeURIComponent(change.field)}`
    : `${change.kind}:${slug}`;
}

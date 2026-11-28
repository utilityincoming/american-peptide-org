import assert from "node:assert/strict";
import { test } from "node:test";
import { changeId, compareCompounds } from "./diff.ts";

test("compares records by slug and distinguishes missing fields from nulls", () => {
  const changes = compareCompounds(
    [{ slug: "old", name: "Old" }, { slug: "entry", name: "Entry", registry: null }],
    [{ slug: "new", name: "New" }, { slug: "entry", name: "Entry", aliases: ["A"] }],
  );

  assert.deepEqual(changes, [
    { kind: "changed", slug: "entry", name: "Entry", field: "aliases", before: undefined, after: ["A"] },
    { kind: "changed", slug: "entry", name: "Entry", field: "registry", before: null, after: undefined },
    { kind: "added", slug: "new", name: "New" },
    { kind: "removed", slug: "old", name: "Old" },
  ]);
});

test("ignores record and object key order but reports changes to list order", () => {
  const entry = { slug: "entry", name: "Entry", data: { a: 1, b: 2 }, aliases: ["A", "B"] };
  const other = { slug: "other", name: "Other" };
  assert.deepEqual(compareCompounds([entry, other], [other, { ...entry, data: { b: 2, a: 1 } }]), []);
  assert.equal(compareCompounds([entry], [{ ...entry, aliases: ["B", "A"] }]).length, 1);
});

test("rejects duplicate identities and gives fields unambiguous permalinks", () => {
  const row = { slug: "entry", name: "Entry" };
  assert.throws(() => compareCompounds([], [row, row]), /duplicate compound slug/);
  assert.notEqual(
    changeId({ kind: "changed", slug: "a:b", name: "Entry", field: "c", before: 1, after: 2 }),
    changeId({ kind: "changed", slug: "a", name: "Entry", field: "b:c", before: 1, after: 2 }),
  );
});

import styles from "@/components/PublicationVisuals.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compoundHistoryPath, compoundReleases, readCompoundSnapshot } from "@/lib/compound-history";
import { changeId, compareCompounds } from "@/packages/compound-history/diff";

type Props = { params: Promise<{ snapshot: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return compoundReleases.map(({ date }) => ({ snapshot: date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { snapshot } = await params;
  return {
    title: `Compound identity release · ${snapshot}`,
    description: `The compound identity snapshot for ${snapshot} and its release history.`,
    alternates: { canonical: `${compoundHistoryPath}/${snapshot}` },
  };
}

const display = (value: unknown) => value === undefined ? "Field absent" : JSON.stringify(value);

export default async function CompoundRelease({ params }: Props) {
  const { snapshot } = await params;
  const release = compoundReleases.find(({ date }) => date === snapshot);
  if (!release) notFound();
  const current = readCompoundSnapshot(snapshot);
  const previous = release.previous ? readCompoundSnapshot(release.previous) : null;
  const changes = previous ? compareCompounds(previous.rows, current.rows) : [];
  const counts = { added: 0, removed: 0, changed: 0 };
  for (const change of changes) counts[change.kind]++;

  return (
    <article className="prose">
      <p className="kicker"><Link href={compoundHistoryPath}>Compound identity release history</Link></p>
      <h1>Compound identity release · {snapshot}</h1>
      <section className={styles.panel} aria-labelledby="snapshot-summary">
        <h2 id="snapshot-summary">{previous ? "Snapshot details" : "Baseline snapshot"}</h2>
        {!previous && <p>This is the first dated compound identity snapshot. A comparison requires a second published snapshot.</p>}
        <dl className={styles.snapshotFacts}>
          <div><dt>Release date</dt><dd><time dateTime={current.date}>{current.date}</time></dd></div>
          <div><dt>Records</dt><dd>{current.rows.length}</dd></div>
          <div className={styles.checksum}>
            <dt>Snapshot JSON checksum · SHA-256</dt>
            <dd><code>{current.sha256}</code></dd>
          </div>
        </dl>
        <p>To verify the download, compare its SHA-256 hash to the checksum above.</p>
        <ul className={styles.releaseLinks}>
          <li><a href={current.url} download>Download snapshot JSON</a></li>
          <li><a href={current.manifest}>View snapshot manifest</a></li>
        </ul>
      </section>
      {previous && (
        <>
          <h2>Changes since {previous.date}</h2>
          <p><a href={previous.url}>Previous snapshot JSON</a> · <a href={previous.manifest}>Previous manifest</a></p>
          <p>{counts.added} records added · {counts.removed} records removed · {counts.changed} field changes</p>
          {changes.length === 0 && <p>The two snapshots contain the same records and field values.</p>}
          {changes.map((change) => {
            const id = changeId(change);
            const note = release.notes?.[id];
            return (
              <section key={id} id={id} className="cite">
                <h3>{change.name} · {change.kind === "changed" ? change.field : change.kind}</h3>
                {change.kind === "changed" && (
                  <dl className={styles.changeValues}>
                    <div className={styles.node}>
                      <dt>Before · <time dateTime={previous.date}>{previous.date}</time></dt>
                      <dd><code>{display(change.before)}</code></dd>
                    </div>
                    <div className={styles.node}>
                      <dt>After · <time dateTime={current.date}>{current.date}</time></dt>
                      <dd><code>{display(change.after)}</code></dd>
                    </div>
                  </dl>
                )}
                {note ? <p>{note.reason} · <a href={note.source}>Supporting source</a></p> : <p>No reason documented.</p>}
                <a href={`#${encodeURIComponent(id)}`} aria-label={`Permalink for ${change.name}, ${change.kind === "changed" ? change.field : change.kind}`}>Permalink</a>
              </section>
            );
          })}
        </>
      )}
      <p>American Peptide Project · Compound identity release · <time dateTime={snapshot}>{snapshot}</time></p>
    </article>
  );
}

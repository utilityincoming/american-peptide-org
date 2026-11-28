import type { Metadata } from "next";
import Link from "next/link";
import { compoundHistoryPath, compoundReleases } from "@/lib/compound-history";

export const metadata: Metadata = {
  title: "Compound identity release history",
  description: "Dated compound identity snapshots and citable changes between releases.",
  alternates: { canonical: compoundHistoryPath },
};

export default function CompoundHistory() {
  return (
    <article className="prose">
      <p className="kicker">Dataset history</p>
      <h1>Compound identity release history</h1>
      <p>Browse dated releases and cite individual changes when a comparison is available.</p>
      <ul>
        {[...compoundReleases].reverse().map(({ date, previous }) => (
          <li key={date}>
            <Link href={`${compoundHistoryPath}/${date}`}><time dateTime={date}>{date}</time></Link>
            {previous ? ` · Changes since ${previous}` : " · Baseline snapshot"}
          </li>
        ))}
      </ul>
      <p><Link href="/data#compounds">Compound identity table and downloads</Link></p>
    </article>
  );
}

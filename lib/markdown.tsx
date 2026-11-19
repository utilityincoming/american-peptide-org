import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const [, label, href] = m;
        if (href.startsWith("/")) {
          nodes.push(
            <Link key={key} href={href}>
              {label}
            </Link>,
          );
        } else {
          nodes.push(
            <a key={key} href={href}>
              {label}
            </a>,
          );
        }
      }
    }
    last = start + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function isTableSep(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      blocks.push(<h3 key={k++}>{inline(text, `h3-${k}`)}</h3>);
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      blocks.push(<h2 key={k++}>{inline(text, `h2-${k}`)}</h2>);
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h1 key={k++}>{inline(line.slice(2), `h1-${k}`)}</h1>);
      i += 1;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (!isTableSep(lines[i])) {
          rows.push(
            lines[i]
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((cell) => cell.trim()),
          );
        }
        i += 1;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={k++} className="table-wrap">
          <table>
            {head && (
              <thead>
                <tr>
                  {head.map((cell, idx) => (
                    <th key={idx}>{inline(cell, `th-${k}-${idx}`)}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {body.map((row, ridx) => (
                <tr key={ridx}>
                  {row.map((cell, cidx) => (
                    <td key={cidx}>{inline(cell, `td-${k}-${ridx}-${cidx}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <ul key={k++}>
          {items.map((item, idx) => (
            <li key={idx}>{inline(item, `li-${k}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("- ") &&
      !lines[i].trim().startsWith("|")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(<p key={k++}>{inline(para.join(" "), `p-${k}`)}</p>);
  }

  return <div className="prose">{blocks}</div>;
}

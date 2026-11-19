export function SectionNav({ items }: { items: readonly { id: string; label: string }[] }) {
  return (
    <nav className="toc" aria-label="Sections">
      <p className="kicker">Sections</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

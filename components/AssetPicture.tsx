type AssetPictureProps = {
  name: string;
  width: number;
  height: number;
  alt: string;
  eager?: boolean;
};

export function AssetPicture({ name, width, height, alt, eager }: AssetPictureProps) {
  const asset = `/assets/${name}`;
  return <picture>
    <source type="image/webp" srcSet={`${asset}.webp 1x, ${asset}@2x.webp 2x`} />
    <img src={`${asset}.png`} srcSet={`${asset}.png 1x, ${asset}@2x.png 2x`}
      width={width} height={height} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
  </picture>;
}

export function SectionHero({ name }: { name: "evidence" | "methods" | "data" }) {
  return <div className="section-art">
    <AssetPicture name={`hero-${name}`} width={1200} height={630} alt="" eager />
  </div>;
}

export function SchemaFlow() {
  return <picture className="schema-flow">
    <source media="(max-width: 40rem)" type="image/svg+xml" srcSet="/assets/schema-flow-stacked.svg" width={320} height={570} />
    <source media="(max-width: 40rem)" type="image/png" srcSet="/assets/schema-flow-stacked@2x.png 2x" width={320} height={570} />
    <source type="image/svg+xml" srcSet="/assets/schema-flow.svg" />
    <img src="/assets/schema-flow@2x.png" width={960} height={210}
      alt="Four connected stages show the evidence pipeline in order: claim, source, tier, and citation." />
  </picture>;
}

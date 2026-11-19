import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "American Peptide — public methods and citable standards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101e36",
          color: "#f4efe4",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#8e2f34",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#f4efe4",
            }}
          >
            A
          </div>
          <div style={{ fontSize: 30, letterSpacing: 1, color: "#c9d3e0" }}>americanpeptide.org</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>American Peptide</div>
          <div style={{ fontSize: 40, color: "#c9d3e0", lineHeight: 1.2 }}>
            Public methods and citable standards
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#9fb0c4" }}>
          Evidence Tier Schema · calculator methodology · open datasets (CC BY 4.0)
        </div>
      </div>
    ),
    { ...size },
  );
}

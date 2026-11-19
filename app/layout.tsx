import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NAV, SITE } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "American Peptide · public methods", template: "%s · American Peptide" },
  description:
    "Public methods and citable standards for American Peptide. The evidence-tier schema, calculator methodology, and open dataset exports.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "American Peptide · public methods",
    url: SITE,
    title: "American Peptide · public methods",
    description:
      "Public methods and citable standards for American Peptide. The evidence-tier schema, calculator methodology, and open dataset exports.",
  },
  twitter: {
    card: "summary_large_image",
    title: "American Peptide · public methods",
    description:
      "Public methods and citable standards for American Peptide. The evidence-tier schema, calculator methodology, and open dataset exports.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <div className="shell">
          <div className="ribbon" aria-hidden="true" />
          <header className="top">
            <Link href="/" className="brand">
              <strong>American Peptide</strong>
              <span>public methods</span>
            </Link>
            <nav className="nav" aria-label="Primary">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main>
            <div className="wrap">{children}</div>
          </main>
          <footer className="footer">
            <div className="wrap">
              <p>
                Research reference. Not medical advice, not a dosing protocol, and not an offer for sale. The tools
                run on <a href="https://americanpeptide.com">americanpeptide.com</a>.
              </p>
              <p>
                    Specifications and datasets: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
                    Calculator modules: <a href="/open-source">MIT</a>. <a href="/cite">How to cite</a>.
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

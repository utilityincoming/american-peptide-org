import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NAV, SITE } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "American Peptide · methods and standards", template: "%s · American Peptide" },
  description:
    "The methods and standards home for American Peptide. Versioned evidence-tier schema, calculator methodology, and open dataset exports.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <div className="shell">
          <header className="top">
            <Link href="/" className="brand">
              <strong>American Peptide</strong>
              <span>methods & standards</span>
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
                Calculator modules: <a href="/open-source">MIT</a>.
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

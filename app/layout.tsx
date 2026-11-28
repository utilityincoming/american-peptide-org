import PageCitation from "@/components/PageCitation";
import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { HOME_DESCRIPTION, HOME_TITLE, NAV, SITE, SITE_NAME } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: HOME_TITLE, template: "%s · American Peptide" },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/assets/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/assets/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
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
              <span>standards &amp; methods</span>
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
              <div className="footer-groups">
                <div className="footer-identity">
                  <Link href="/" className="footer-wordmark">{SITE_NAME}</Link>
                  <p>Open standards, methods, and research data.</p>
                </div>
                <nav aria-label="Publications">
                  <h2>Publications</h2>
                  <ul>
                    {NAV.filter(({ href }) => href !== "/about").map(({ href, label }) => (
                      <li key={href}><Link href={href}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
                <nav aria-label="Project">
                  <h2>Project</h2>
                  <ul>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/changelog">Changelog</Link></li>
                    <li><Link href="/errata">Errata</Link></li>
                  </ul>
                </nav>
              </div>
              <div className="footer-meta">
                <p>© 2027 AmericanPeptide.org</p>
                <PageCitation />
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

export const SITE = "https://americanpeptide.org";
export const COM = "https://americanpeptide.com";
export const REPO = "https://github.com/utilityincoming/american-peptide-org";

export const PROJECT_NAME = "American Peptide Project";
export const SITE_NAME = "American Peptide";
export const HOME_TITLE = "American Peptide | Open Standards, Methods & Research Data";
export const HOME_DESCRIPTION =
  "Explore the American Peptide Project’s public evidence standards, scientific methodology, reference implementations, and versioned open research datasets.";

export const publisher = { "@type": "Organization", "@id": `${SITE}/#project`, name: PROJECT_NAME };
export const website = { "@type": "WebSite", "@id": `${SITE}/#website`, name: SITE_NAME, url: `${SITE}/` };

export const NAV = [
  { href: "/standards/evidence-tier", label: "Standards" },
  { href: "/methods", label: "Methods" },
  { href: "/data", label: "Data" },
  { href: "/open-source", label: "Open source" },
  { href: "/about", label: "About" },
] as const;

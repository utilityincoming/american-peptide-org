/**
 * Post-reconstitution blend screen.
 *
 * Reference for the beta screen on
 * https://americanpeptide.com/tools/blend-calculator
 * which vendors this logic from american-peptide `src/lib/blend-screen.ts`
 * at commit d35605d6649865bbfb3189c0cc31001b9f50029f (pull request 203).
 *
 * The .com tool resolves a catalog slug to a sequence and a copper flag, then
 * applies these rules. This module does not ship the catalog. Pass the
 * sequence and `copper` yourself. Charge and pI ignore fatty-acid chains and
 * disulfides. A flag is a hypothesis, not a mixing procedure.
 *
 * MIT License. Copyright American Peptide.
 */

/**
 * Henderson–Hasselbalch pKa set and Kyte–Doolittle hydropathy, matching the
 * Design Lab on americanpeptide.com. Fatty-acid chains and disulfides are
 * invisible to a single-letter string.
 */
export const PKA = {
  nTerm: 9.69,
  cTerm: 2.34,
  C: 8.33,
  D: 3.65,
  E: 4.25,
  H: 6.0,
  K: 10.53,
  R: 12.48,
  Y: 10.07,
} as const;

const HYDROPATHY: Record<string, number> = {
  A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, E: -3.5, Q: -3.5, G: -0.4, H: -3.2,
  I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8, T: -0.7, W: -0.9,
  Y: -1.3, V: 4.2,
};

const STANDARD_AA = "ACDEFGHIKLMNPQRSTVWY";

export function sanitizeSequence(raw: string): string {
  return raw.toUpperCase().split("").filter((c) => STANDARD_AA.includes(c)).join("");
}

function countOf(codes: string[], code: string): number {
  let n = 0;
  for (const c of codes) if (c === code) n++;
  return n;
}

export function chargeAtPH(codes: string[], pH: number): number {
  if (codes.length === 0) return 0;
  const pos = (pka: number) => 1 / (1 + 10 ** (pH - pka));
  const neg = (pka: number) => -1 / (1 + 10 ** (pka - pH));
  let charge = pos(PKA.nTerm) + neg(PKA.cTerm);
  charge += countOf(codes, "K") * pos(PKA.K);
  charge += countOf(codes, "R") * pos(PKA.R);
  charge += countOf(codes, "H") * pos(PKA.H);
  charge += countOf(codes, "D") * neg(PKA.D);
  charge += countOf(codes, "E") * neg(PKA.E);
  charge += countOf(codes, "C") * neg(PKA.C);
  charge += countOf(codes, "Y") * neg(PKA.Y);
  return charge;
}

export function isoelectricPoint(codes: string[]): number {
  if (codes.length === 0) return 0;
  let lo = 0;
  let hi = 14;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (chargeAtPH(codes, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function gravy(codes: string[]): number {
  if (codes.length === 0) return 0;
  return codes.reduce((acc, c) => acc + (HYDROPATHY[c] ?? 0), 0) / codes.length;
}

/** Typical bacteriostatic-water pH. The screen uses whatever pH the caller passes, after clamping. */
export const DEFAULT_BUFFER_PH = 5.7;

/** |pI − buffer pH| at or below this is flagged. Solubility is lowest near the pI. */
export const PI_WINDOW = 1;

/** Both peptides must be at least this far from zero, and opposite in sign. */
export const OPPOSITE_CHARGE_MIN = 0.5;

/** Kyte–Doolittle GRAVY at or above this is treated as strongly hydrophobic. */
export const GRAVY_HYDROPHOBIC = 0.5;

/**
 * american-peptide commit this screen was checked against.
 * Catalog lookup and the page chrome stay in that repository.
 */
export const BLEND_SCREEN_COM_COMMIT = "d35605d6649865bbfb3189c0cc31001b9f50029f";

/** Slugs documented to gel or fibrillate in aqueous solution. */
const FIBRIL_SLUGS = new Set(["glucagon", "amylin", "insulin"]);

const LABELED_PAIRS: { a: string; b: string; detail: string }[] = [
  {
    a: "pramlintide",
    b: "insulin",
    detail:
      "The pramlintide (Symlin) prescribing information says not to mix it with insulin in the same syringe. The solutions sit at different pH and the mixture precipitates.",
  },
];

export type ScreenLevel = "info" | "caution" | "warn";

export interface ScreenFlag {
  level: ScreenLevel;
  code: string;
  title: string;
  detail: string;
}

export interface ScreenMember {
  /** Catalog slug when known. Labeled pairs and fibril slugs match this, not the display name. */
  slug?: string;
  name?: string;
  /** Single-letter sequence. Chain labels and disulfide notes are stripped. */
  sequence?: string;
  /** True for copper complexes such as GHK-Cu. The sequence alone does not show the metal. */
  copper?: boolean;
}

export interface ScreenedPeptide {
  slug: string | null;
  name: string;
  hasSequence: boolean;
  charge: number | null;
  pi: number | null;
  gravy: number | null;
  cysteines: number;
}

export interface BlendScreen {
  pH: number;
  peptides: ScreenedPeptide[];
  flags: ScreenFlag[];
  /** Rows with a typed name and no sequence, so charge, pI, and GRAVY were skipped. */
  unresolved: string[];
  notes: ScreenFlag[];
}

const NOTES: ScreenFlag[] = [
  {
    level: "info",
    code: "no-costore",
    title: "Do not co-store a blend",
    detail:
      "A shared vial is only as stable as its least-stable peptide, and the mixture can no longer be checked against each certificate of analysis.",
  },
  {
    level: "info",
    code: "no-shake",
    title: "Gentle inversion, not shaking",
    detail: "Agitation and an air–water interface drive aggregation. Swirl to dissolve. Do not shake.",
  },
  {
    level: "info",
    code: "separate-syringes",
    title: "Separate syringes when a warning fires",
    detail:
      "A warning is a known or predicted physical incompatibility. Keep those peptides in their own syringes. This screen is not a mixing procedure.",
  },
];

function clampPh(pH: number): number {
  if (!Number.isFinite(pH)) return DEFAULT_BUFFER_PH;
  return Math.min(14, Math.max(0, pH));
}

interface Resolved {
  slug: string | null;
  label: string;
  codes: string[];
  copper: boolean;
  charge: number | null;
  pi: number | null;
  gravy: number | null;
  cysteines: number;
}

function resolve(member: ScreenMember, pH: number): Resolved {
  const slug = member.slug?.trim() || null;
  const label = member.name?.trim() || slug || "Unnamed peptide";
  const codes = sanitizeSequence(member.sequence ?? "").split("");
  const cysteines = codes.filter((c) => c === "C").length;
  if (codes.length === 0) {
    return { slug, label, codes, copper: Boolean(member.copper), charge: null, pi: null, gravy: null, cysteines: 0 };
  }
  return {
    slug,
    label,
    codes,
    copper: Boolean(member.copper),
    charge: chargeAtPH(codes, pH),
    pi: isoelectricPoint(codes),
    gravy: gravy(codes),
    cysteines,
  };
}

export function screenBlend(members: ScreenMember[], pH: number): BlendScreen {
  const buffer = clampPh(pH);
  const rows = members.map((m) => resolve(m, buffer));
  const flags: ScreenFlag[] = [];
  const unresolved: string[] = [];

  rows.forEach((row, i) => {
    const typed = members[i]?.name?.trim();
    if (row.codes.length === 0) {
      if (typed && !row.slug) unresolved.push(typed);
      else if (row.slug || typed) {
        flags.push({
          level: "info",
          code: "no-sequence",
          title: `${row.label}: no sequence on file`,
          detail:
            "Charge, isoelectric point, and GRAVY were skipped. Labeled incompatibilities still apply when the slug matches.",
        });
      }
      return;
    }
    if (row.slug && FIBRIL_SLUGS.has(row.slug)) {
      flags.push({
        level: "warn",
        code: "fibril",
        title: `${row.label} gels or fibrillates in water`,
        detail:
          "Published physical instability: this peptide aggregates in aqueous solution. It is a poor candidate for a shared, stored blend.",
      });
    }
    if (row.pi !== null && Math.abs(row.pi - buffer) <= PI_WINDOW) {
      flags.push({
        level: "caution",
        code: "near-pi",
        title: `${row.label} is near its isoelectric point`,
        detail: `Estimated pI ${row.pi.toFixed(1)} is within ${PI_WINDOW} pH unit of the buffer (pH ${buffer.toFixed(1)}). Solubility is lowest there, so haze or a gel is more likely.`,
      });
    }
    if (row.gravy !== null && row.gravy >= GRAVY_HYDROPHOBIC) {
      flags.push({
        level: "caution",
        code: "hydrophobic",
        title: `${row.label} is strongly hydrophobic`,
        detail: `GRAVY ${row.gravy.toFixed(2)} (Kyte–Doolittle). Hydrophobic sequences self-associate as concentration rises.`,
      });
    }
    if (row.cysteines > 0) {
      flags.push({
        level: "caution",
        code: "cysteine",
        title: `${row.label} has ${row.cysteines} cysteine${row.cysteines === 1 ? "" : "s"}`,
        detail:
          "Thiols oxidize and, when more than one cysteine peptide shares a solution, disulfide bridges can re-pair.",
      });
    }
  });

  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i];
      const b = rows[j];
      if (
        a.charge !== null &&
        b.charge !== null &&
        Math.abs(a.charge) >= OPPOSITE_CHARGE_MIN &&
        Math.abs(b.charge) >= OPPOSITE_CHARGE_MIN &&
        Math.sign(a.charge) !== Math.sign(b.charge)
      ) {
        flags.push({
          level: "warn",
          code: "opposite-charge",
          title: `${a.label} and ${b.label} carry opposite charge`,
          detail: `At pH ${buffer.toFixed(1)} the estimated net charges are ${a.charge.toFixed(1)} and ${b.charge.toFixed(1)}. Opposite charge can coacervate into a visible gel even when each solution was clear alone.`,
        });
      }
      if (a.slug && b.slug) {
        const slugs = new Set([a.slug, b.slug]);
        for (const pair of LABELED_PAIRS) {
          if (slugs.has(pair.a) && slugs.has(pair.b)) {
            flags.push({
              level: "warn",
              code: "labeled-incompatibility",
              title: `${a.label} + ${b.label}: labeled syringe incompatibility`,
              detail: pair.detail,
            });
          }
        }
      }
      const copper = a.copper ? a : b.copper ? b : null;
      const other = copper === a ? b : copper === b ? a : null;
      if (copper && other && other.cysteines > 0) {
        flags.push({
          level: "caution",
          code: "copper-thiol",
          title: `${copper.label} can oxidize thiols on ${other.label}`,
          detail: "Copper complexes catalyze oxidation of cysteine. That is a chemical interaction, not a labeled incompatibility.",
        });
      }
    }
  }

  const rank: Record<ScreenLevel, number> = { warn: 0, caution: 1, info: 2 };
  flags.sort((x, y) => rank[x.level] - rank[y.level]);

  return {
    pH: buffer,
    peptides: rows.map((row) => ({
      slug: row.slug,
      name: row.label,
      hasSequence: row.codes.length > 0,
      charge: row.charge,
      pi: row.pi,
      gravy: row.gravy,
      cysteines: row.cysteines,
    })),
    flags,
    unresolved,
    notes: NOTES,
  };
}

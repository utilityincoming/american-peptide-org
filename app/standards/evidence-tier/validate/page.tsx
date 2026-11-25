import SchemaValidator from "@/components/SchemaValidator";

export const metadata = { title: "Validate an Evidence Tier claim", description: "Check an example or your own claim against a published Evidence Tier JSON Schema.", alternates: { canonical: "/standards/evidence-tier/validate" } };

export default function ValidatePage() {
  return <article className="prose">
    <p className="kicker">Evidence Tier Schema</p>
    <h1>Validate a claim</h1>
    <p>Check a record locally against the published JSON Schema. For rules beyond record shape, see the <a href="/standards/evidence-tier/v0.1">written spec</a>. Try an <a href="/standards/evidence-tier/examples">example claim</a>.</p>
    <SchemaValidator />
  </article>;
}

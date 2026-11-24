"""Generate typed, dated copies of the existing JSON exports with PyArrow."""
import csv
import hashlib
import json
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

ROOT = Path(__file__).resolve().parents[1] / "public" / "data"
STRING = pa.string()
NUMBER = pa.float64()
INTEGER = pa.int64()
BOOLEAN = pa.bool_()
LIST = pa.list_(STRING)

DATASETS = [
    ("compounds", "Compound identity table", "compounds", [
        ("slug", STRING, "Stable catalog identifier"),
        ("name", STRING, "Catalog display name"),
        ("aliases", LIST, "Alternate names"),
        ("categories", LIST, "Catalog category identifiers"),
        ("molecular_weight_da", NUMBER, "Molecular weight in daltons"),
        ("molecular_formula", STRING, "Published molecular formula"),
        ("sequence", STRING, "Published sequence"),
        ("cas", STRING, "CAS registry identifier"),
        ("pubchem_cid", INTEGER, "PubChem compound identifier"),
        ("uniprot_id", STRING, "UniProt accession"),
        ("fda_approved", BOOLEAN, "Catalog FDA approval flag"),
        ("synthetic_features", LIST, "Catalog synthesis feature labels"),
        ("synthesis_difficulty", STRING, "Catalog synthesis difficulty label"),
        ("unlisted", BOOLEAN, "Catalog visibility flag"),
    ]),
    ("pk-half-lives", "Half-life inputs", "records", [
        ("slug", STRING, "Stable catalog identifier"),
        ("label", STRING, "Display label"),
        ("half_life_hours_low", NUMBER, "Lower half-life estimate in hours"),
        ("half_life_hours_high", NUMBER, "Upper half-life estimate in hours"),
        ("source_note", STRING, "Source and context note"),
        ("classes", LIST, "Calculator class identifiers"),
    ]),
    ("trials-index", "ClinicalTrials.gov snapshot", "studies", [
        ("query", STRING, "Search term used to retrieve the study"),
        ("nct_id", STRING, "ClinicalTrials.gov study identifier"),
        ("title", STRING, "Title in the upstream record"),
        ("status", STRING, "Status at snapshot retrieval"),
        ("phases", LIST, "Study phase codes"),
        ("sponsor", STRING, "Sponsor name"),
        ("enrollment", INTEGER, "Enrollment count"),
    ]),
]


def schema_snippet(kind, nullable, description):
    types = {STRING: "string", NUMBER: "number", INTEGER: "integer",
             BOOLEAN: "boolean", LIST: "array"}
    snippet = {"type": [types[kind], "null"] if nullable else types[kind],
               "description": description}
    if kind == LIST:
        snippet["items"] = {"type": "string"}
    return snippet


def csv_value(value):
    if value is None:
        return ""
    if isinstance(value, list):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return value


manifest = []
for name, title, key, fields in DATASETS:
    source = ROOT / f"{name}.json"
    document = json.loads(source.read_bytes())
    date = document["version"]
    rows = document[key]
    directory = ROOT / date
    directory.mkdir(exist_ok=True)
    assert all(set(row) == {field[0] for field in fields} for row in rows)
    nullable = {field for field, _, _ in fields if any(row[field] is None for row in rows)}
    schema = pa.schema([pa.field(field, kind, nullable=field in nullable) for field, kind, _ in fields],
                       metadata={"snapshot": date, "license": document["license"], "title": title})
    table = pa.Table.from_pylist(rows, schema=schema)
    assert table.to_pylist() == rows

    (directory / f"{name}.json").write_bytes(source.read_bytes())
    with (directory / f"{name}.csv").open("w", encoding="utf8", newline="") as stream:
        writer = csv.writer(stream, lineterminator="\n")
        writer.writerow(schema.names)
        writer.writerows([csv_value(row[field]) for field in schema.names] for row in rows)
    pq.write_table(table, directory / f"{name}.parquet", compression="snappy")
    assert pq.read_table(directory / f"{name}.parquet").to_pylist() == rows

    manifest.append({
        "id": name,
        "title": title,
        "snapshot": date,
        "license": document["license"],
        "rowCount": len(rows),
        "rowKey": key,
        "files": {ext: {"url": f"/data/{date}/{name}.{ext}",
                        "sha256": hashlib.sha256((directory / f"{name}.{ext}").read_bytes()).hexdigest()}
                  for ext in ("json", "csv", "parquet")},
        "rowSchema": {"$schema": "https://json-schema.org/draft/2020-12/schema", "type": "object",
                      "required": schema.names, "additionalProperties": False,
                      "properties": {field: schema_snippet(kind, field in nullable, description)
                                     for field, kind, description in fields}},
    })

(directory / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf8")

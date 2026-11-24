import { AssetPicture } from "./AssetPicture";
import { methods } from "@/lib/calculator-methods";

export default function MethodIllustration({ id }: { id: (typeof methods)[number]["id"] }) {
  const method = methods.find((entry) => entry.id === id)!;
  return <figure className="method-art">
    <AssetPicture name={`method-${id}`} width={480} height={220} alt={method.imageAlt} />
    <figcaption><a href="/assets/LICENSE.md">CC BY 4.0</a> · <a href={id === "blend-screen" ? "#rules" : "#formulas"}>{id === "blend-screen" ? "Rules" : "Formulas"}</a></figcaption>
  </figure>;
}

// Repository revision containing these method texts and corresponding modules.
export const METHODS_REVISION = "d54b01e301654dc4e9d0493255031f944daa8512";
export const methods = [
  { id: "reconstitution", title: "Reconstitution", imageAlt: "A graduated vessel connects to a separate measurement chamber, illustrating concentration and volume." },
  { id: "blend", title: "Blend draws", imageAlt: "Two sample paths converge and feed a single graduated chamber, illustrating a shared draw." },
  { id: "blend-screen", title: "Beta blend screen", imageAlt: "Two schematic profiles overlap a shaded screening window, illustrating a comparison of blend properties." },
  { id: "pharmacokinetics", title: "Single-compartment PK", imageAlt: "A single compartment points to an unnumbered plot with a falling curve that flattens over time." },
] as const;
export const calculatorSource = (id: string) => `/calculators/${METHODS_REVISION}/${id}.ts`;

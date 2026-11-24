// Repository revision containing these method texts and corresponding modules.
export const METHODS_REVISION = "d54b01e301654dc4e9d0493255031f944daa8512";
export const methods = [
  { id: "reconstitution", title: "Reconstitution", imageAlt: "Two laboratory volumes combining in one vessel" },
  { id: "blend", title: "Blend draws", imageAlt: "Two sample streams entering a shared vessel" },
  { id: "blend-screen", title: "Beta blend screen", imageAlt: "A balance comparing two laboratory samples" },
  { id: "pharmacokinetics", title: "Single-compartment PK", imageAlt: "An exponential decay curve on unmarked axes" },
] as const;
export const calculatorSource = (id: string) => `/calculators/${METHODS_REVISION}/${id}.ts`;

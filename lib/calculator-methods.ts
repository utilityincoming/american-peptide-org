// Repository revision containing these method texts and corresponding modules.
export const METHODS_REVISION = "d54b01e301654dc4e9d0493255031f944daa8512";
export const methods = [
  { id: "reconstitution", title: "Reconstitution", imageAlt: "A graduated vessel connects to a separate measurement chamber, illustrating concentration and volume.",
    inputs: "Labeled mass, diluent volume, and target mass in the same units.",
    output: "Concentration, draw volume, and whole portions.",
    assumptions: "Complete dissolution, uniform solution, and no transfer loss.",
  },
  { id: "blend", title: "Blend draws", imageAlt: "Two sample paths converge and feed a single graduated chamber, illustrating a shared draw.",
    inputs: "Component masses, target amounts, and final volume.",
    output: "Shared draw volume and overage for each component.",
    assumptions: "Complete transfer and one shared volume. Compatibility is evaluated separately.",
  },
  { id: "blend-screen", title: "Beta blend screen", imageAlt: "Two schematic profiles overlap a shaded screening window, illustrating a comparison of blend properties.",
    inputs: "Sequences, catalog identifiers, and any caller-supplied copper flag.",
    output: "Rule-based screening flags for pairs in solution.",
    assumptions: "Inputs are already dissolved. Charge estimates use unmodified sequences.",
  },
  { id: "pharmacokinetics", title: "Single-compartment PK", imageAlt: "A single compartment points to an unnumbered plot with a falling curve that flattens over time.",
    inputs: "Elimination half-life, elapsed time, and an interval for repeated inputs.",
    output: "Remaining fraction, accumulation, and time to steady state.",
    assumptions: "One compartment with first-order elimination, instantaneous input, and constant half-life.",
  },
] as const;
export const calculatorSource = (id: string) => `/calculators/${METHODS_REVISION}/${id}.ts`;

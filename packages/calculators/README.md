# @americanpeptide/calculators

Reference implementations of the bench math that [americanpeptide.com](https://americanpeptide.com) runs in the browser.

| Module | Tool it explains |
| --- | --- |
| `reconstitution.ts` | [Reconstitution calculator](https://americanpeptide.com/tools/reconstitution-calculator) |
| `blend.ts` | [Blend calculator](https://americanpeptide.com/tools/blend-calculator) |
| `pharmacokinetics.ts` | Steady-state, accumulation, and clearance helpers |

Methodology, assumptions, and edge cases: [americanpeptide.org/methods](https://americanpeptide.org/methods).

These files are TypeScript with no dependencies. Node 22+ can run the tests with `node --experimental-strip-types --test packages/calculators/calculators.test.ts`.

MIT License.

# @americanpeptide/calculators

Reference implementations of the bench math that [americanpeptide.com](https://americanpeptide.com) runs in the browser.

| Module | Tool it explains |
| --- | --- |
| `reconstitution.ts` | [Reconstitution calculator](https://americanpeptide.com/tools/reconstitution-calculator) |
| `blend.ts` | [Blend calculator](https://americanpeptide.com/tools/blend-calculator) draws |
| `blend-screen.ts` | Same tool, beta association screen. Catalog lookup stays on .com. `BLEND_SCREEN_COM_COMMIT` names the revision this copy was checked against. |
| `pharmacokinetics.ts` | Steady-state, accumulation, and clearance helpers |

Methodology, assumptions, and edge cases: [americanpeptide.org/methods](https://americanpeptide.org/methods).

These files are TypeScript with no dependencies. Node 22.18+ can run the tests with `node --test packages/calculators/calculators.test.ts`.

MIT License.

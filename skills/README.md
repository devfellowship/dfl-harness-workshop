# skills/

In the real [`dfl-harness`](https://github.com/devfellowship/dfl-harness),
a **skill** is a folder with a `SKILL.md` plus scripts — a reusable capability
an agent loads on demand.

For the kata, a "skill" is just a function `(input) => output` that the
harness runs against a task and then grades. See `tasks/buggy-math.js` for
the one you'll be fixing.

## Kata 2 (stretch): add your own skill

1. Create `tasks/your-skill.js` exporting a function.
2. Add `tasks/your-skill.test.js` driving it through `runHarness`.
3. `npm test` — make it green.

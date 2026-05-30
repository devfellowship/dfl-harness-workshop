# Skill: fix-failing-test

A reusable procedure for fixing a failing test with minimal change. In the real
[`dfl-harness`](https://github.com/devfellowship/dfl-harness) a skill is a folder
with a `SKILL.md` plus optional scripts/tools; an agent loads it on demand. Here
the skill is this instruction block, injected into the system prompt at step 05.

## Procedure

1. Read the failing test to learn the EXPECTED behavior (inputs → outputs).
2. Read the implementation. Trace one failing case by hand.
3. Form a one-line hypothesis about the single root cause.
4. Apply the smallest change that makes ALL cases pass. Do not change the signature.
5. Write the full corrected file to `agent/solution/buggy-math.ts`.
6. Prefer correctness over cleverness; leave comments only where they aid the reader.

## Definition of done

`npm test` is green (all cases pass) and the public API is unchanged.

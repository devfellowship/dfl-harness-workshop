// grader.js — the simplest possible grader.
// In the real dfl-harness, graders score an agent's output (pass/fail or 0..1).
// Here a grader just checks a value against an expectation.

export function grade(actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  return {
    pass,
    score: pass ? 1 : 0,
    detail: pass ? "ok" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
  };
}

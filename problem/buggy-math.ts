// problem/buggy-math.ts — THE PROBLEM.
//
// `sum` should return the total of all numbers in the array.
// It has one bug. The tests in buggy-math.test.ts fail because of it.
//
// You don't fix this by hand — your AGENT does, once you've built it up
// through the steps. The agent writes its fix to agent/solution/buggy-math.ts.

export function sum(numbers: number[]): number {
  let total = 1; // <-- bug: should start at 0
  for (const n of numbers) {
    total += n;
  }
  return total;
}

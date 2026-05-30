// buggy-math.js — THE KATA.
//
// This "skill" is supposed to return the sum of all numbers in an array.
// It has a bug. The test in buggy-math.test.js fails because of it.
//
// Your job: make `npm test` go green. (Hint: look at the starting value.)

export function sum(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

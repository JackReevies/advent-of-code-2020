const { timeFunction, getInput } = require('../common')

/**
 * Iterate through expenses report and find two numbers that sum to "sum"
 * @param {string[]} numbers The array of numbers as strings
 * @param {number} sum Target number to make (ie 2020)
 * @param {number[]} notIndexes Skip indexes (useful for recursion)
 */
function partOne (numbers, sum = 2020, notIndexes = []) {
  for (let i = 0; i < numbers.length; i++) {
    if (notIndexes.indexOf(i) > -1) continue
    const first = Number(numbers[i])
    const target = sum - first
    // Given the "first" number, what number would we need to be present to sum to the "sum" number (ie, 2020)
    if (numbers.indexOf(target.toString()) > -1) {
      // The number is present in expenses, we have our answer
      return { numbers: [first, target], total: first * target }
    }
  }
}

async function start () {
  const numbers = getInput(`${__dirname}/input.txt`)

  const task1 = await timeFunction(() => partOne(numbers))
  const task2 = await timeFunction(() => partTwo(numbers))
  return [{ ans: task1.result.total, ms: task1.ms }, { ans: task2.result.total, ms: task2.ms }]
}

/**
 * For when we need 3 numbers from the list to total 2020.
 * For each number in the expenses array (X), call partOne's solution to find the two numbers (Y + Z)
 * that sum together to make (2020 - X = Y + Z)
 */
function partTwo (numbers, sum = 2020) {
  for (let i = 0; i < numbers.length; i++) {
    const first = Number(numbers[i])
    const target = sum - first
    const result = partOne(numbers, target, [i])
    if (result) {
      // We've found two numbers that make the remainder from 2020 (2nd and 3rd)
      // Add the 1st number to the numbers array and multiply the sum of 2nd and 3rd by 1st
      result.total *= first
      result.numbers.push(first)
      return result
    }
  }
}

module.exports = start

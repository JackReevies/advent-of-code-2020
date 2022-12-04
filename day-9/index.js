const { timeFunction, getInput } = require('../common')

function part1 (input, preambleLength) {
  let lowerIndex = 0
  let upperIndex = preambleLength
  for (let i = preambleLength; i < input.length; i++) {
    const target = input[i]
    const res = findTwoNumbersForSum(input.slice(lowerIndex, upperIndex), target)
    if (!res) {
      return target
    }
    lowerIndex++
    upperIndex++
  }
}

function findTwoNumbersForSum (numbers, sum) {
  for (let i = 0; i < numbers.length; i++) {
    const first = numbers[i]
    if (numbers.indexOf(sum - first) > -1) {
      return [first, sum - first]
    }
  }
}

function part2 (input, xmasWeakness) {
  let acc = 0
  let startIndex = 0
  let startNum = 0
  startNum = input[startIndex]
  for (let i = startIndex; i < input.length; i += 0) {
    const number = input[i]
    if (acc < xmasWeakness) {
      acc += number
      i++
    }
    // If we've met the goal and we've progressed beyond our startIndex
    // (else we've found the target number in the list and not summed it)
    if (acc === xmasWeakness && startIndex !== i) {
      // Yay
      const range = input.slice(startIndex, i + 1)
      return Math.min(...range) + Math.max(...range)
    } else if (acc > xmasWeakness) {
      // We overshot
      // Remove the tail of the "array" and pretend we always started one ahead ;)
      startIndex++
      acc -= startNum
      startNum = input[startIndex]
    } // else still on track... keep on adding
  }
}

async function start () {
  const input = getInput(`${__dirname}/input.txt`).map(o => Number(o))
  const task1 = await timeFunction(() => part1(input, 25))
  const task2 = await timeFunction(() => part2(input, task1.result))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

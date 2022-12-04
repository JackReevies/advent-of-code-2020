const { timeFunction, getInput } = require('../common')

function rideSlope (input, right = 3, down = 1, showWorkings = false) {
  let trees = 0
  let x = 0
  const xMax = input[0].length - 1
  for (let y = down; y < input.length; y += down) {
    x += right
    if (x > xMax) {
      x = x - xMax - 1
    }
    if (input[y][x] === '#') {
      if (showWorkings) {
        console.log(`[right ${right}, down ${down}] tree on line ${y + 1} at position ${x + 1}`)
      }
      trees++
    }
  }
  if (showWorkings) {
    console.log(`[right ${right}, down ${down}] total of ${trees} trees`)
  }
  return trees
}

async function start (showWorkings = false) {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => rideSlope(input, 3, 1))
  const task2 = await timeFunction(() => [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].reduce((acc, paramArr) => {
    const result = rideSlope(input, ...paramArr)
    acc *= result
    return acc
  }, 1))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

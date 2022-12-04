const { timeFunction, getInput } = require('../common')

function part1(input, target) {
  const obj = input.reduce((acc, obj, i) => { acc[obj] = [i + 1]; return acc }, {})
  const arr = [...input]

  let i = input.length - 1
  while (i < target) {
    const number = arr[i]
    if (obj[number].length === 1) {
      arr.push(0)
      if (obj[0]) {
        obj[0].push(i + 2)
        if (obj[0].length > 2) {
          obj[0].splice(0, 1)
        }
      } else {
        obj[0] = [i + 2]
      }
    } else {
      const spoken = obj[number][obj[number].length - 1] - obj[number][obj[number].length - 2]
      arr.push(spoken)
      if (obj[spoken]) {
        obj[spoken].push(i + 2)
        if (obj[spoken].length > 2) {
          obj[spoken].splice(0, 1)
        }
      } else {
        obj[spoken] = [i + 2]
      }
    }
    i++
  }
  return arr[target - 1]
}

async function start(verbose) {
  const input = [1, 20, 11, 6, 12, 0]
  const task1 = await timeFunction(() => part1(input, 2020))
  const task2 = await timeFunction(() => part1(input, 30000000))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

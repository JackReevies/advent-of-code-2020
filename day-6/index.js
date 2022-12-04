const { timeFunction, getInput } = require('../common')

function partOne (input) {
  const groups = []
  let group = { people: 0, chars: {}, unique: 0 }
  let sum = 0

  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (!line.length) {
      groups.push(group)
      group = { chars: {}, unique: 0, people: 0 }
      continue
    }
    group.people++
    for (let x = 0; x < line.length; x++) {
      const char = line[x]
      if (!group.chars[char]) {
        group.unique++
        sum++
        group.chars[char] = 1
        continue
      }
      group.chars[char]++
    }
  }
  groups.push(group)
  return { groups, ans: sum }
}

function partTwo (groups) {
  let ans = 0
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    Object.keys(group.chars).forEach(char => {
      const num = group.chars[char]
      if (num === group.people) {
        ans++
      }
    })
  }
  return ans
}

async function start () {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => partOne(input))
  const task2 = await timeFunction(() => partTwo(task1.result.groups))
  return [{ ans: task1.result.ans, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

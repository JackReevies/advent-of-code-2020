const { timeFunction, getInput } = require('../common')

function parseList (array) {
  return array.reduce((acc, line) => {
    const regex = /(\d+)-(\d+) (.): (.+)/g.exec(line)
    if (!regex) {
      console.log(`Failed reading line ${line}`)
      return null
    }
    if (isPasswordValid(regex[3], regex[1], regex[2], regex[4])) {
      acc.first++
    }
    if (isPasswordValidBoogaloo(regex[3], regex[1], regex[2], regex[4])) {
      acc.second++
    }
    return acc
  }, { first: 0, second: 0 })
}

function isPasswordValid (char, min, max, password) {
  // 1-14 b: bbbbbbbbbbbbbbbbbbb
  let instances = 0
  for (let i = 0; i < password.length; i++) {
    const x = password[i]
    if (x === char) {
      instances++
    }
  }
  return instances >= min && instances <= max
}

function isPasswordValidBoogaloo (char, first, second, password) {
  return (char === password[Number(first) - 1] ? 1 : 0) ^ (char === password[Number(second) - 1] ? 1 : 0)
}

async function start () {
  const lines = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => parseList(lines))
  return [{ ans: task1.result.first, ms: task1.ms }, { ans: task1.result.second, ms: task1.ms }]
}

module.exports = start

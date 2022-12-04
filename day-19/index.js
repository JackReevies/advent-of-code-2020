const { timeFunction, getInput } = require('../common')

function part1(input, verbose) {

}

function part2(input, verbose) {

}

async function start(verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => part1(input, verbose))
  const task2 = await timeFunction(() => part2(input, verbose))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

start()
module.exports = start

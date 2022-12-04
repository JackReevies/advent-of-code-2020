const { timeFunction, getInput } = require('../common')

function execute (input) {
  let acc = 0
  const linesRun = {}
  const history = []
  for (let x = 0; x < input.length; x++) {
    const line = input[x]
    const cmd = line.substring(0, 3)
    const value = Number(line.substring(4))
    if (isNaN(value)) {
      throw new Error(`Expected a number on line ${x} (${line})`)
    }
    if (linesRun[x]) {
      // We've already run this
      return { acc, infinite: true, history }
    }
    linesRun[x] = 1
    history.push(x)
    if (cmd === 'nop') continue
    if (cmd === 'acc') {
      acc += value
    } else if (cmd === 'jmp') {
      x += value - 1
    }
  }

  return { acc, x: input.length - 1 }
}

function partTwo (input) {
  const output = Object.assign([], input)
  const debugChangesMade = {}
  let results = execute(output)
  while (true) {
    // Find last jmp/nop that got executed
    let index = 0
    for (let i = results.history.length - 1; i > 0; i--) {
      const lineIndex = results.history[i]
      if (debugChangesMade[lineIndex]) continue
      const line = output[lineIndex]
      if (line.startsWith('jmp') || line.startsWith('nop')) {
        index = lineIndex
        break
      }
    }
    const bak = output[index]
    output[index] = output[index].startsWith('jmp') ? output[index].replace('jmp', 'nop') : output[index].replace('nop', 'jmp')
    debugChangesMade[index] = { index, original: bak, modified: output[index] }
    results = execute(output)
    if (results.infinite) {
      // Oh shit oh fuck revert change
      output[index] = bak
      continue
    }
    return { fixed: output, debugChangesMade, acc: results.acc }
  }
}

async function start () {
  const input = getInput(`${__dirname}/input.txt`)
  const part1 = await timeFunction(() => execute(input))
  const part2 = await timeFunction(() => partTwo(input))
  return [{ ans: part1.result.acc, ms: part1.ms }, { ans: part2.result.acc, ms: part2.ms }]
}

module.exports = start

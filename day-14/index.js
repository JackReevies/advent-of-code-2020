const { timeFunction, getInput } = require('../common')

function part1 (sections) {
  const ans = []
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const mask = section.mask
    for (let x = 0; x < section.ops.length; x++) {
      const { index, value } = section.ops[x]
      const result = applyMask(mask, value)
      ans[index] = result
    }
  }
  const sum = ans.reduce((acc, obj) => obj ? acc + obj : acc, 0)
  return sum
}

function part2 (sections, verbose) {
  const ans = {}
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const mask = section.mask
    for (let x = 0; x < section.ops.length; x++) {
      const { index, value } = section.ops[x]
      const result = applyMask(mask, index, true)
      result.forEach(index => {
        ans[index] = value
      })
      if (!verbose) continue
      console.log(`[${mask}] Set ${result.length} indexes to ${value} (${x + 1} / ${section.ops.length}) (${i + 1} / ${sections.length})`)
    }
  }
  const sum = Object.values(ans).reduce((acc, obj) => obj ? acc + obj : acc, 0)
  return sum
}

function applyMask (mask, val, part2 = false) {
  const bin = padBin(val, mask.length).split('')
  for (let i = mask.length - 1; i >= 0; i--) {
    const bit = mask[i]
    if (!part2 && bit === 'X') continue
    if (part2 && bit === '0') continue
    const cur = bin[i]
    bin[i] = bit
  }
  if (part2) {
    const decimals = {}
    getAllPossibleFromBin(bin, decimals)
    return Object.keys(decimals)
  }
  const res = parseInt(bin.join(''), 2)
  return res
}

function getAllPossibleFromBin (binArr, decimals, combos = []) {
  for (let x = 0; x <= 1; x++) {
    for (let i = 0; i < binArr.length; i++) {
      const char = binArr[i]
      if (char !== 'X') continue
      const dupe = binArr.slice()
      dupe[i] = x.toString()
      const key = dupe.join('')
      if (dupe.indexOf('X') === -1) {
        // We have a number
        const dec = parseInt(key, 2)
        decimals[dec] = true
      } else if (!combos[key]) {
        combos[key] = dupe
        getAllPossibleFromBin(dupe, decimals, combos)
      }
    }
  }
  return decimals
}

function padBin (num, length) {
  let str = num.toString(2)
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

function interpretInput (input) {
  const sections = []
  let currentSection = null
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (line.startsWith('mask')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      const mask = line.substring(7)
      currentSection = { mask, ops: [] }
      continue
    }
    const regex = /mem\[(\d+)\] = (\d+)/g.exec(line)
    if (!regex) {
      throw new Error(`Failed interpretting line (${line})`)
    }
    currentSection.ops.push({
      index: Number(regex[1]), value: Number(regex[2])
    })
  }
  sections.push(currentSection)
  return sections
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  const interprettedInput = interpretInput(input)
  const task1 = await timeFunction(() => part1(interprettedInput, verbose))
  const task2 = await timeFunction(() => part2(interprettedInput, verbose))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

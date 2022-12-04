const { accessSync } = require('fs')
const { timeFunction, getInput } = require('../common')

function interpretInput (input) {
  const rules = []
  let mine = []
  const others = []

  let mode = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (!line.length) {
      continue
    } else if (line.startsWith('your ticket')) {
      mode = 1
      continue
    } else if (line.startsWith('nearby tickets')) {
      mode = 2
      continue
    }
    if (!mode) {
      const regex = /(.+?): (\d+)-(\d+) or (\d+)-(\d+)/g.exec(line)
      if (!regex) throw new Error(`Failed reading rule (line ${i + 1})`)
      rules.push({ field: regex[1], range1: [Number(regex[2]), Number(regex[3])], range2: [Number(regex[4]), Number(regex[5])] })
    } else if (mode === 1) {
      mine = line.split(',').map(o => Number(o))
    } else if (mode === 2) {
      others.push(line.split(',').map(o => Number(o)))
    }
  }
  return { rules, mine, others }
}

function part1 (interpretted) {
  const { rules, others } = interpretted
  let invalidValuesSum = 0
  const invalidIndexes = {}
  for (let i = 0; i < others.length; i++) {
    const ticket = others[i]
    for (let x = 0; x < ticket.length; x++) {
      const number = ticket[x]
      if (!isNumberValidForAnyRules(number, rules)) {
        invalidValuesSum += number
        invalidIndexes[i] = true
      }
    }
  }
  const indexes = Object.keys(invalidIndexes)
  let removed = 0
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i]
    others.splice(index - removed, 1)
    removed++
  }
  return invalidValuesSum
}

function isNumberValidForAnyRules (number, rules) {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (isNumberValidForRule(number, rule)) {
      return true
    }
  }
  return false
}

function isNumberValidForRule (number, rule) {
  const start1 = rule.range1[0]
  const end1 = rule.range1[1]
  const start2 = rule.range2[0]
  const end2 = rule.range2[1]
  if ((number >= start1 && number <= end1) || (number >= start2 && number <= end2)) {
    return true
  }
  return false
}

function part2 (interpretted) {
  const { rules, mine, others } = interpretted
  const validFor = rules.reduce((acc, obj, i) => { acc.push(obj.field); return acc }, [])
  const positions = mine.reduce((acc, obj, i) => { acc[i] = [...validFor]; return acc }, {})
  for (let i = 0; i < others.length; i++) {
    const ticket = others[i]
    for (let x = 0; x < ticket.length; x++) {
      const number = ticket[x]
      for (let a = 0; a < rules.length; a++) {
        const rule = rules[a]
        if (!isNumberValidForRule(number, rule)) {
          const rulesValidForNumber = positions[x]
          const brokenRuleIndex = rulesValidForNumber.findIndex(o => o === rule.field)
          if (brokenRuleIndex > -1) {
            rulesValidForNumber.splice(brokenRuleIndex, 1)
          }
        }
      }
    }
  }
  let changesMade = 0
  do {
    changesMade = 0
    const posKeys = Object.keys(positions)
    for (let i = 0; i < posKeys.length; i++) {
      const position = posKeys[i]
      const validRules = positions[position]
      if (validRules.length === 1) {
        // We know that position X has to be Z
        // so we can remove Z as a possibility from all other positions
        positions[i] = validRules[0]
        Object.keys(positions).forEach((o, z) => {
          const x = positions[o]
          if (i === z) return
          if (!Array.isArray(x)) return
          const index = x.findIndex(o => o === validRules[0])
          if (index === -1) return
          x.splice(index, 1)
          changesMade++
        })
      }
    }
  } while (changesMade)

  let tor = 1
  Object.keys(mine).forEach(index => {
    const field = positions[index]
    mine[field] = mine[index]
    if (field.startsWith('departure')) {
      tor *= mine[index]
    }
  })

  return tor
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  const interpretted = interpretInput(input)
  const task1 = await timeFunction(() => part1(interpretted))
  const task2 = await timeFunction(() => part2(interpretted, verbose))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

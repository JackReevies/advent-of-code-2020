const { timeFunction, getInput } = require('../common')

function getBagColoursThatCanHoldColours(input, ans, colour) {
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (line.indexOf(colour) > -1 && !line.startsWith(colour)) {
      const c = line.substring(0, line.indexOf(' bag'))
      if (ans[c]) continue
      getBagColoursThatCanHoldColours(input, ans, c)
      ans[c] = true
    }
  }
  return ans
}

function getBagsThatMustBeContainedIn(input, ans, colour) {
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (line.startsWith(colour)) {
      // ie, shiny gold
      const rules = parseRuleForBagColour(line)
      const bags = rules.reduce((acc, obj) => acc + obj.num, 0)
      ans[colour] = { accBags: 1, numBags: bags, rawRules: rules, bagsInside: {} }
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        const addsBags = getBagsThatMustBeContainedIn(input, ans[colour].bagsInside, rule.colour)
        ans[colour].accBags += addsBags * rule.num
      }
      return ans[colour].accBags
    }
  }
}

function parseRuleForBagColour(line) {
  const regex = /^.+? bags contain (.+)/gm.exec(line)
  if (!regex) {
    throw new Error('Regex failed')
  }
  const rule = regex[1]
  if (rule.startsWith('no other bags')) return []
  const res = []
  const parts = rule.split(', ')
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const numBag = /(\d+) ([a-z ]+) bags?/g.exec(part)
    if (!numBag) {
      throw new Error('numBag regex failed')
    }
    res.push({ colour: numBag[2], num: Number(numBag[1]) })
  }
  return res
}

async function start() {
  const input = getInput(`${__dirname}/input.txt`)
  const colours = {}
  const p2Colours = {}
  const task1 = await timeFunction(() => getBagColoursThatCanHoldColours(input, colours, 'shiny gold'))
  const task2 = await timeFunction(() => getBagsThatMustBeContainedIn(input, p2Colours, 'shiny gold'))
  return [{ ans: Object.keys(task1.result).length, ms: task1.ms }, { ans: task2.result - 1, ms: task2.ms }]
}

module.exports = start

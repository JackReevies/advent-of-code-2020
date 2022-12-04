const { timeFunction, getInput } = require('../common')

function part1 (input, verbose) {
  let sum = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    const result = resolveParentheses(line)
    if (verbose) {
      console.log(`${line} is ${result}`)
    }
    sum += Number(result)
  }
  return sum
}

function part2 (input, verbose) {
  let sum = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    const wrappedLine = wrapThoseAdditions(line)
    const result = resolveParentheses(wrappedLine, true, verbose)
    if (verbose) {
      console.log(`${line} IS ${result}`)
    }
    sum += Number(result)
  }
  return sum
}

function wrapThoseAdditions (statement, startIndex = 0) {
  const multis = /(\d+) \+ (\d+)/gm.exec(statement.substring(startIndex))
  if (!multis) return statement
  statement = `${statement.substring(0, multis.index + startIndex)}(${multis[0]})${statement.substring(multis.index + startIndex + multis[0].length)}`
  return wrapThoseAdditions(statement, multis.index + startIndex + multis[0].length)
}

function solveStatement (statement) {
  if (/^\(*?(\d+)\)*?$/.exec(statement)) {
    return eval(statement)
  }
  const regex = /\(*?(\d+)\)*? (\+|\-|\*|\/) \(*?(\d+)\)*?/g.exec(statement)
  if (!regex) throw new Error(`statement ${statement} or incomplete or contains brackets`)
  statement = eval(regex[0]).toString() + statement.substring(regex[0].length)
  if (/(\d+) (\+|-|\*|\/)/g.exec(statement)) {
    return solveStatement(statement)
  }
  return statement
}

function resolveParentheses (statement, isPartTwo, verbose) {
  let layer = 0
  let currentStartIndex = 0
  let current = ''
  for (let i = 0; i < statement.length; i++) {
    const char = statement[i]
    if (char === '(') {
      layer++
      if (layer === 1) {
        currentStartIndex = i
        continue
      }
    }
    if (char === ')') {
      layer--
      if (layer === 0) {
        let newStr = ''
        if (current.indexOf('(') > -1) {
          const deepa = resolveParentheses(current, isPartTwo, verbose)
          newStr = statement.substring(0, currentStartIndex) + deepa + statement.substring(i + 1)
        } else {
          newStr = statement.substring(0, currentStartIndex) + solveStatement(current) + statement.substring(i + 1)
        }
        if (verbose) { console.log(`${statement} ----> ${newStr} (simplify)`) }

        statement = newStr
        if (isPartTwo) {
          newStr = wrapThoseAdditions(statement)
          if (statement !== newStr) {
            if (verbose) { console.log(`${statement} ----> ${newStr} (wrap)`) }
            statement = newStr
          }
        }
        i = -1
        current = ''
      }
    }
    if (layer === 0) continue
    current += char
  }

  return solveStatement(statement)
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => part1(input, verbose))
  const task2 = await timeFunction(() => part2(input, verbose))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

start()
module.exports = start

const { timeFunction, getInput } = require('../common')

function getPassports (input) {
  const passports = [] // {byr, iyr, eyr, hgt, hcl, ecl, pid, cid}
  let curPassport = {}
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    if (!line.length) {
      passports.push(curPassport)
      curPassport = {}
      continue
    }
    const keyvals = line.split(' ')
    keyvals.forEach(keyval => {
      const sep = keyval.indexOf(':')
      if (sep === -1) { throw new Error('Malformed key value pair') }
      curPassport[keyval.substring(0, sep)] = keyval.substring(sep + 1)
    })
  }
  passports.push(curPassport)
  return passports
}

function validatePassports (passports, validateProps = false, showWorkings = false) {
  const validKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
  passports.forEach(o => {
    const foundKeys = validKeys.reduce((acc, key) => { acc[key] = 0; return acc }, {})
    Object.keys(o).forEach(key => {
      if (validKeys.indexOf(key) > -1) {
        const fn = validations[key]
        const keyValid = validateProps && fn ? fn(o[key]) : true
        foundKeys[key] = keyValid ? 1 : validateProps ? -1 : 0
      }
    })
    const missingKeys = Object.keys(foundKeys).filter(key => !foundKeys[key])
    const invalidKeys = Object.keys(foundKeys).filter(key => foundKeys[key] === -1)
    o.valid = !missingKeys.length && !invalidKeys.length
    if (!o.valid) {
      if (showWorkings) {
        o.reason = `Missing key(s) ${missingKeys.join(', ')} ${invalidKeys.length ? `|| Invalid key(s): ${invalidKeys.map(key => `${key}:${o[key]}`)}` : ''}`
        console.log(o.reason)
      }
    }
  })
  return passports.filter(o => o.valid).length
}

const validations = {}

function validateRange (min, max, value) {
  const number = Number(value)
  if (isNaN(number)) return false
  return number >= min && number <= max
}

validations.byr = value => validateRange(1920, 2002, value)

validations.iyr = value => validateRange(2010, 2020, value)

validations.eyr = value => validateRange(2020, 2030, value)

validations.hgt = value => {
  const unit = value.substring(value.length - 2)
  const number = value.substring(0, value.length - 2)
  return unit === 'in' ? validateRange(59, 76, number) : unit === 'cm' ? validateRange(150, 193, number) : false
}

validations.hcl = value => !!(/^#[0-9a-fA-F]{6}$/g.exec(value))

validations.ecl = value => {
  const valid = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  return valid.some(o => o === value.toLowerCase())
}

validations.pid = value => !!(/^\d{9}$/g.exec(value))

async function start () {
  const input = getInput(`${__dirname}/input.txt`)
  let passports = null
  const task1 = await timeFunction(() => {
    passports = getPassports(input)
    return validatePassports(passports)
  })
  const task2 = await timeFunction(() => validatePassports(passports, true))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

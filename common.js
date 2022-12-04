const fs = require('fs')

/**
 * Times how long a function takes to execute.
 * Supports promises
 * @param {*} fn A function (a/sync) to time
 * @returns {{result: object, ms: number}} An object representing the return/resolve value from the function and execution time in ms
 */
module.exports.timeFunction = function timeFunction (fn) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const result = fn()
    if (result instanceof Promise) {
      result.then(result => {
        resolve({ result, ms: Date.now() - start })
      }).catch(e => {
        reject(e)
      })
    } else {
      resolve({ result, ms: Date.now() - start })
    }
  })
}

/**
 * Read in file and return an array representing content split by new line
 */
module.exports.getInput = function getInput (location) {
  const expenses = fs.readFileSync(location).toString()
  const split = expenses.split('\r\n')
  if (split.length === 1) {
    // We must be on a Unix OS
    return expenses.split('\n')
  }
  return split
}

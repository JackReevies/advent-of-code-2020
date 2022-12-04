const { timeFunction, getInput } = require('../common')

function part1 (interpretted, verbose = false) {
  const activeArr = [[]]
  for (let y = 0; y < interpretted.length; y++) {
    const line = interpretted[y]
    activeArr[0].push([])
    for (let x = 0; x < line.length; x++) {
      const point = line[x]
      activeArr[0][y][x] = point
    }
  }

  prettyPrint(activeArr, 'Before any cycles')
  let totalTurnedOn = 0
  for (let i = 0; i < 6; i++) {
    const range = getRange(activeArr)
    const toTurnOff = [[]]

    for (let zN = range[0]; zN <= range[1]; zN++) {
      for (let yN = range[0]; yN <= range[1]; yN++) {
        for (let xN = range[0]; xN <= range[1]; xN++) {
          const neighborsTurnedOn = howManyNeighborsActive(activeArr, zN, yN, xN)
          // console.log(`Cell (${zN}, ${yN}, ${xN}) has ${neighborsTurnedOn} turned on neighbors`)
          const isTurnedOn = getVal(activeArr, zN, yN, xN) === 1
          if (neighborsTurnedOn === 3) {
            setVal(toTurnOff, 1, zN, yN, xN)
          } else if (neighborsTurnedOn === 2 && isTurnedOn) {
            setVal(toTurnOff, 1, zN, yN, xN)
          } else {
            setVal(toTurnOff, -1, zN, yN, xN)
          }
        }
      }
    }

    totalTurnedOn = applyChanges(toTurnOff, activeArr)
    if (verbose) {
      prettyPrint(activeArr, `After ${i + 1} cycles (${totalTurnedOn} on)`)
    }
  }
  return totalTurnedOn
}

function part2 (interpretted, verbose = false) {
  const activeArr = [[[]]]
  for (let y = 0; y < interpretted.length; y++) {
    const line = interpretted[y]
    activeArr[0][0].push([])
    for (let x = 0; x < line.length; x++) {
      const point = line[x]
      activeArr[0][0][y][x] = point
    }
  }

  let totalTurnedOn = 0
  for (let i = 0; i < 6; i++) {
    const range = getRange4th(activeArr)
    const toTurnOff = [[]]

    for (let wN = range[0]; wN <= range[1]; wN++) {
      for (let zN = range[0]; zN <= range[1]; zN++) {
        for (let yN = range[0]; yN <= range[1]; yN++) {
          for (let xN = range[0]; xN <= range[1]; xN++) {
            const neighborsTurnedOn = howManyNeighborsActive4th(activeArr, wN, zN, yN, xN)
            // console.log(`Cell (${wN}, ${zN}, ${yN}, ${xN}) has ${neighborsTurnedOn} turned on neighbors`)
            const isTurnedOn = getVal4th(activeArr, wN, zN, yN, xN) === 1
            if (neighborsTurnedOn === 3) {
              setVal4th(toTurnOff, 1, wN, zN, yN, xN)
            } else if (neighborsTurnedOn === 2 && isTurnedOn) {
              setVal4th(toTurnOff, 1, wN, zN, yN, xN)
            } else {
              setVal4th(toTurnOff, -1, wN, zN, yN, xN)
            }
          }
        }
      }
    }

    totalTurnedOn = applyChanges4th(toTurnOff, activeArr)
    if (verbose) {
      prettyPrint(activeArr, `After ${i + 1} cycles (${totalTurnedOn} on)`)
    }
  }
  return totalTurnedOn
}

function applyChanges (toTurnOff, destArr) {
  const range = getRange(destArr)
  let turnedOn = 0
  for (let zN = range[0]; zN <= range[1]; zN++) {
    for (let yN = range[0]; yN <= range[1]; yN++) {
      for (let xN = range[0]; xN <= range[1]; xN++) {
        const val = getVal(toTurnOff, zN, yN, xN)
        if (val === -1) {
          setVal(destArr, 0, zN, yN, xN)
        } else if (val === 1) {
          setVal(destArr, 1, zN, yN, xN)
          turnedOn++
        }
      }
    }
  }
  return turnedOn
}

function applyChanges4th (toTurnOff, destArr) {
  const range = getRange4th(destArr)
  let turnedOn = 0
  for (let wN = range[0]; wN <= range[1]; wN++) {
    for (let zN = range[0]; zN <= range[1]; zN++) {
      for (let yN = range[0]; yN <= range[1]; yN++) {
        for (let xN = range[0]; xN <= range[1]; xN++) {
          const val = getVal4th(toTurnOff, wN, zN, yN, xN)
          if (val === -1) {
            setVal4th(destArr, 0, wN, zN, yN, xN)
          } else if (val === 1) {
            setVal4th(destArr, 1, wN, zN, yN, xN)
            turnedOn++
          }
        }
      }
    }
  }
  return turnedOn
}

function prettyPrint (arr, title) {
  console.log('==================================')
  console.log(title || 'No Title')
  console.log('==================================')
  const range = getRange(arr)
  for (let zN = range[0]; zN <= range[1]; zN++) {
    console.log(`z=${zN}`)
    for (let yN = range[0]; yN <= range[1]; yN++) {
      let layer = ''
      for (let xN = range[0]; xN <= range[1]; xN++) {
        layer += getVal(arr, zN, yN, xN) === 0 ? '.' : '#'
      }
      console.log(layer)
    }
    console.log()
  }
}

function getRange (obj) {
  let lowest = Number.MAX_SAFE_INTEGER
  let highest = 0
  Object.keys(obj).forEach(z => {
    Object.keys(obj[z]).forEach(y => {
      Object.keys(obj[z][y]).forEach(x => {
        if (Number(x) < lowest) {
          lowest = Number(x)
        }
        if (Number(x) > highest) {
          highest = Number(x)
        }
      })
    })
  })
  return [lowest - 1, highest + 1]
}

function getRange4th (obj) {
  let lowest = Number.MAX_SAFE_INTEGER
  let highest = 0
  Object.keys(obj).forEach(w => {
    Object.keys(obj[w]).forEach(z => {
      Object.keys(obj[w][z]).forEach(y => {
        Object.keys(obj[w][z][y]).forEach(x => {
          if (Number(x) < lowest) {
            lowest = Number(x)
          }
          if (Number(x) > highest) {
            highest = Number(x)
          }
        })
      })
    })
  })
  return [lowest - 1, highest + 1]
}

function howManyNeighborsActive (activeArr, z, y, x) {
  let neighborsTurnedOn = 0
  for (let zN = z - 1; zN <= z + 1; zN++) {
    for (let yN = y - 1; yN <= y + 1; yN++) {
      for (let xN = x - 1; xN <= x + 1; xN++) {
        // console.log(`cell (${zN}, ${yN}, ${xN}) is neighbor ${getVal(activeArr, zN, yN, xN) ? 'ON' : 'OFF'}`)
        if (z === zN && x === xN && y === yN) continue
        if (getVal(activeArr, zN, yN, xN)) {
          neighborsTurnedOn++
        }
      }
    }
  }
  return neighborsTurnedOn
}

function howManyNeighborsActive4th (activeArr, w, z, y, x) {
  let neighborsTurnedOn = 0
  for (let wN = w - 1; wN <= w + 1; wN++) {
    for (let zN = z - 1; zN <= z + 1; zN++) {
      for (let yN = y - 1; yN <= y + 1; yN++) {
        for (let xN = x - 1; xN <= x + 1; xN++) {
          // console.log(`cell (${zN}, ${yN}, ${xN}) is neighbor ${getVal(activeArr, zN, yN, xN) ? 'ON' : 'OFF'}`)
          if (w === wN && z === zN && x === xN && y === yN) continue
          if (getVal4th(activeArr, wN, zN, yN, xN)) {
            neighborsTurnedOn++
          }
        }
      }
    }
  }
  return neighborsTurnedOn
}

function getVal (activeArr, z, y, x) {
  if (!activeArr[z]) {
    activeArr[z] = [[]] // Set this up for next time
  }
  if (!activeArr[z][y]) {
    activeArr[z][y] = [] // Set this up for next time
  }
  if (!activeArr[z][y][x]) {
    activeArr[z][y][x] = 0 // Set this up for next time
  }
  return activeArr[z][y][x]
}

function getVal4th (activeArr, w, z, y, x) {
  if (!activeArr[w]) {
    activeArr[w] = [[]] // Set this up for next time
  }
  if (!activeArr[w][z]) {
    activeArr[w][z] = [[]] // Set this up for next time
  }
  if (!activeArr[w][z][y]) {
    activeArr[w][z][y] = [] // Set this up for next time
  }
  if (!activeArr[w][z][y][x]) {
    activeArr[w][z][y][x] = 0 // Set this up for next time
  }
  return activeArr[w][z][y][x]
}

function setVal (activeArr, newVal, z, y, x) {
  if (!activeArr[z]) {
    activeArr[z] = [[]] // Set this up for next time
  }
  if (!activeArr[z][y]) {
    activeArr[z][y] = [] // Set this up for next time
  }
  if (!activeArr[z][y][x]) {
    activeArr[z][y][x] = 0 // Set this up for next time
  }
  activeArr[z][y][x] = newVal
}

function setVal4th (activeArr, newVal, w, z, y, x) {
  if (!activeArr[w]) {
    activeArr[w] = [[]] // Set this up for next time
  }
  if (!activeArr[w][z]) {
    activeArr[w][z] = [[]] // Set this up for next time
  }
  if (!activeArr[w][z][y]) {
    activeArr[w][z][y] = [] // Set this up for next time
  }
  if (!activeArr[w][z][y][x]) {
    activeArr[w][z][y][x] = 0 // Set this up for next time
  }
  activeArr[w][z][y][x] = newVal
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`).map(line => line.split('').map(o => o === '.' ? 0 : 1))
  const task1 = await timeFunction(() => part1(input))
  const task2 = await timeFunction(() => part2(input))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

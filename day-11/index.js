const { timeFunction, getInput } = require('../common')

function task (input, part2) {
  let layout = input
  while (true) {
    const res = applyRules(layout, part2, part2 ? 5 : 4)
    layout = res.newLayout
    if (!res.changesMade) {
      return res.occupiedSeats
    }
  }
}

function applyRules (input, seeThroughEmpties, crowd = 4) {
  const newLayout = []
  let changesMade = 0
  for (let y = 0; y < input.length; y++) {
    newLayout.push([])
    for (let x = 0; x < input[0].length; x++) {
      const seat = input[y][x]
      newLayout[y][x] = seat
      if (seat === -1) { continue }

      const adjSeats = getSeats(input, y, x, seeThroughEmpties)
      if (seat === 0 & urinalRule(adjSeats, y, x)) {
        // Change Seat to occupied
        newLayout[y][x] = 1
        changesMade++
      }

      if (seat === 1 && crowdRule(adjSeats, crowd)) {
        // Change seat to empty
        newLayout[y][x] = 0
        changesMade++
      }
    }
  }
  const occupiedSeats = newLayout.reduce((acc, line) => acc + line.filter(o => o === 1).length, 0)
  return { newLayout, changesMade, occupiedSeats }
}

function urinalRule (seats) {
  return !seats.some(o => o.val > 0)
}

function crowdRule (seats, crowd = 4) {
  return seats.filter(o => o.val === 1).length > crowd
}

function getSeats (input, y, x, empty) {
  const values = []
  const yStart = Math.max(y - 1, 0)
  const yEnd = Math.min(y + 1, input.length - 1)
  const xStart = Math.max(x - 1, 0)
  const xEnd = Math.min(x + 1, input[0].length - 1) // We're assuming that each row has the same amount of seats...

  for (let i = yStart; i <= yEnd; i++) {
    const yDiff = i - y //
    for (let a = xStart; a <= xEnd; a++) {
      const xDiff = a - x
      let xNew = x + xDiff
      let yNew = y + yDiff
      let seat = input[y + yDiff][x + xDiff]
      if (empty && seat === -1) {
        // Theres no seat here, we need to find the next seartt in the same direction
        let emptyCount = 1
        while (true) {
          yNew = y + (yDiff * emptyCount)
          xNew = x + (xDiff * emptyCount)
          if (yNew < 0 || xNew < 0) break // too small OOB
          if (yNew >= input.length || xNew >= input[0].length) break // too big OOB
          seat = input[yNew][xNew]
          if (seat > -1) { break }
          emptyCount++
        }
      }
      values.push({ val: seat, y: yNew, x: xNew })
    }
  }
  return values
}

async function start () {
  const input = getInput(`${__dirname}/input.txt`).map(line => line.split('').map(o => o === 'L' ? 0 : o === '#' ? 1 : -1))
  const task1 = await timeFunction(() => task(input))
  const task2 = await timeFunction(() => task(input, true))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

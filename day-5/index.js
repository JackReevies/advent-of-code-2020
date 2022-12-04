const { timeFunction, getInput } = require('../common')

function decodeRowColumn(code) {
  const r = code.substring(0, 7).replace(/F/g, '0').replace(/B/g, '1')
  const c = code.substring(7).replace(/R/g, '1').replace(/L/g, '0')
  const rn = parseInt(r, 2)
  const cn = parseInt(c, 2)
  return { id: rn * 8 + cn }
}

function findMySeat(seats) {
  // Given an ordered seat id list
  // My seat will be a missing from this list but the seats with id + 1 and -1 will be present
  for (let i = 0; i < seats.length; i++) {
    const seat = seats[i]
    const nextSeat = seats[i + 1]
    if (nextSeat.id === seat.id + 2) {
      // Indicates a missing seat
      return seat.id + 1
    }
  }
}

function part1(input) {
  let highest = { id: 0 }
  return {
    seats: input.map(o => {
      const res = decodeRowColumn(o)
      if (res.id > highest.id) {
        highest = res
      }
      return res
    }),
    ans: highest.id
  }
}

async function start() {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => part1(input))
  const seats = task1.result.seats
  const task2 = await timeFunction(() => {
    seats.sort((a, b) => a.id < b.id ? -1 : a.id === b.id ? 0 : 1)
    return findMySeat(seats)
  })
  return [{ ans: task1.result.ans, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

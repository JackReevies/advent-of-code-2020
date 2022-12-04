const { timeFunction, getInput } = require('../common')

function part1 (input) {
  const earliestTime = Number(input[0])
  if (isNaN(earliestTime)) {
    throw new Error('Failed reading first line of input')
  }

  const buses = input[1].split(',').filter(o => o !== 'x').map(o => Number(o))

  let bestBus = { id: buses[0], earliest: Infinity }

  for (let i = 0; i < buses.length; i++) {
    const bus = buses[i]
    const firstBusTime = Math.ceil(earliestTime / bus) * bus
    if (bestBus.earliest > firstBusTime) {
      bestBus = { id: bus, earliest: firstBusTime }
    }
  }

  return { ...bestBus, ans: (bestBus.earliest - earliestTime) * bestBus.id }
}

function part2 (input, startTime) {
  const buses = input[1].split(',').map(o => o === 'x' ? -1 : Number(o))

  return findEarliestStartBoogalooSix(buses, 1)

  // let attempts = 0
  // let timestamp = Math.max(...buses)
  // while (true) {
  //   for (let i = 0; i < buses.length; i++) {
  //     const bus = buses[i]
  //     if (bus === -1) {
  //       // Bus is flexible
  //       timestamp++
  //       continue
  //     }

  //     const firstTime = Math.ceil(timestamp / bus) * bus
  //     if (timestamp === firstTime) {
  //       // Yay - the bus lines up
  //       // Increment timestamp and continue with list
  //       timestamp++
  //     } else {
  //       // Doesn't line up, we need to start again
  //       attempts++
  //       timestamp = bus[0] * attempts
  //       break
  //     }
  //   }
  // }
}

function findEarliestStart (buses) {
  const slowestBus = getBiggestBusId(buses)
  let attempts = 1
  while (true) {
    const neededTimeForFirstBus = (slowestBus.id * attempts) - slowestBus.index
    if (buses[0] / neededTimeForFirstBus % 0) {
      return neededTimeForFirstBus
    }
    attempts++
  }
}

function findEarliestStartBoogaloo (buses) {
  const slowestBus = getBiggestBusId(buses)
  let startTime = 0
  let attempts = 1
  let i = 0
  while (true) {
    startTime = (slowestBus.id * attempts) - slowestBus.index
    for (i = 0; i < buses.length; i++) {
      const bus = buses[i]
      if (i === slowestBus.index) continue
      if (bus === -1) continue

      const timestampNeeded = (slowestBus.id * attempts) - (slowestBus.index - i)
      const res = timestampNeeded % bus
      if (!res) {
        // We might be onto something
        continue
      }
      attempts++
      break
    }
    if (i === buses.length) {
      return startTime
    }
  }
}

function findEarliestStartBoogalooFive (buses, attempts = 1) {
  const slowestOrder = sortBussesBySlowest(buses)
  const sum = slowestOrder.reduce((acc, obj) => obj.id > 0 ? acc + obj.id : acc, 0)
  const slowestBus = slowestOrder[0]
  let i = 0
  let startTime = 0
  while (true) {
    startTime = (sum * attempts) - slowestBus.index
    if (startTime > Number.MAX_SAFE_INTEGER) {
      return -1
    }
    for (i = 1; i < slowestOrder.length; i++) {
      const bus = slowestOrder[i]
      if (bus.id === -1) continue

      const timestampNeeded = startTime + bus.index
      const res = timestampNeeded % bus.id
      if (!res) {
        // We might be onto something
        continue
      }
      attempts++
      break
    }
    if (i === buses.length) {
      return startTime
    }
    if (Date.now() % 60000 === 0) {
      console.log(`startTime is at least ${startTime}`)
    }
  }
}

function findEarliestStartBoogalooTwo (buses, attempts = 1) {
  const slowestOrder = sortBussesBySlowest(buses)
  const slowestBus = slowestOrder[0]
  let i = 0
  let startTime = 0
  while (true) {
    startTime = (slowestBus.id * attempts) - slowestBus.index
    if (startTime > Number.MAX_SAFE_INTEGER) {
      return -1
    }
    for (i = 1; i < slowestOrder.length; i++) {
      const bus = slowestOrder[i]
      if (bus.id === -1) continue

      const timestampNeeded = startTime + bus.index
      const res = timestampNeeded % bus.id
      if (!res) {
        // We might be onto something
        continue
      }
      attempts++
      break
    }
    if (i === buses.length) {
      return startTime
    }
    if (Date.now() % 60000 === 0) {
      console.log(`startTime is at least ${startTime}`)
    }
  }
}

function findEarliestStartBoogalooSix (buses, attempts = 1) {
  const startFrom = findFirstTwoBusAlign(buses)
  const noBlanks = buses.map((o, i) => { return { id: o, index: i } }).filter(o => o.id > 0)
  let acc = startFrom
  for (let i = 2; i < noBlanks.length; i++) {
    const bus = noBlanks[i]
    const range = buses.slice(0, bus.index + 1)
    const lcm = buses.slice(0, bus.index).reduce((acc, obj) => obj === -1 ? acc : acc * obj, 1)
    let nextTime = acc + lcm
    while (!doesStartTimeWork(nextTime, range)) {
      nextTime += lcm
    }
    acc = nextTime
  }
  return acc
}

function findFirstTwoBusAlign (buses) {
  let i = 0
  let startTime = 0
  let attempts = 1
  while (true) {
    startTime = (buses[0] * attempts)
    for (i = 1; i < buses.length; i++) {
      const bus = buses[i]
      if (bus === -1) continue

      const timestampNeeded = startTime + i
      const res = timestampNeeded % bus
      if (!res) {
        // We might be onto something
        return startTime
      }
      attempts++
      break
    }
  }
}

function findEarliestStartBoogalooThree (buses) {
  const slowestOrder = sortBussesBySlowest(buses)
  const slowestBus = slowestOrder[0]
  let startTime = 0
  let attempts = 1
  let i = 0
  while (true) {
    startTime = (slowestBus.id * attempts) - slowestBus.index
    if (startTime > Number.MAX_SAFE_INTEGER) {
      console.log('above max safe interger')
      return -1
    }
    for (i = slowestOrder.length - 1; i > 0; i--) {
      const bus = slowestOrder[i]
      if (bus.id === -1) continue

      const timestampNeeded = startTime + bus.index
      const res = timestampNeeded % bus.id
      if (!res) {
        // We might be onto something
        continue
      }
      attempts++
      break
    }
    if (i === 0) {
      return startTime
    }
  }
}

function findEarliestStartBoogalooFour (buses) {
  const slowestOrder = sortBussesBySlowest(buses)
  const slowestBus = slowestOrder[0]
  const firstIndexBus = slowestOrder.find(o => o.index === 0)
  const lastIndexBus = slowestOrder.find(o => o.index === buses.length - 1)
  const chosenOrder = [firstIndexBus, lastIndexBus]

  for (let i = 0; i < slowestOrder.length; i++) {
    const bus = slowestOrder[i]
    if (bus.index === firstIndexBus.index || bus.index === lastIndexBus.index || bus.index === slowestBus.index) continue
    chosenOrder.push(bus)
  }

  let startTime = 0
  let attempts = 1
  let i = 0
  while (true) {
    startTime = (slowestBus.id * attempts) - slowestBus.index
    if (startTime > Number.MAX_SAFE_INTEGER) {
      return -1
    }
    for (i = 0; i < chosenOrder.length; i++) {
      const bus = chosenOrder[i]
      if (bus.id === -1) continue
      if (bus.index === slowestBus.index) continue

      const timestampNeeded = startTime + bus.index
      const res = timestampNeeded % bus.id
      if (!res) {
        // We might be onto something
        continue
      }
      attempts++
      break
    }
    if (i === chosenOrder.length) {
      return startTime
    }
    if (Date.now() % 60000 === 0) {
      console.log(`startTime is at least ${startTime}`)
    }
  }
}

function sortBussesBySlowest (buses) {
  const slowest = buses.map((o, i) => { return { index: i, id: o } })
  slowest.sort((a, b) => a.id > b.id ? -1 : 1)
  return slowest
}

function doesStartTimeWork (startTime, buses) {
  // Do we have our answer?
  for (let i = 0; i < buses.length; i++) {
    const bus = buses[i]
    const res = (startTime + i) % bus
    if (res > 0) {
      return false
    }
  }
  return true
}

function getBiggestBusId (buses) {
  let biggest = { index: 0, id: buses[0] }
  buses.forEach((bus, i) => {
    if (biggest.id < bus) {
      biggest = { index: i, id: bus }
    }
  })
  return biggest
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  // const task1 = await timeFunction(() => part1(input, verbose))
  const x = -1
  const tests = [
    [17, x, 13, 19],
    [67, 7, 59, 61],
    [67, x, 7, 59, 61],
    [67, 7, x, 59, 61],
    [1789, 37, 47, 1889],
    [7, 13, x, x, 59, x, 31, 19],
    [13, x, x, 41, x, x, x, 37],
    [x, x, x, x, x, 659, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, 19, x, x, x, 23],
    [x, x, x, x, x, 29, x, 409, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, 17],
    [67, 7, x, 59, 61],
    [67, 7, x, 59],
    [67, 7, x],
    [67, 7]
  ]
  // [13, x, x, 41, x, x, x, 37, x, x, x, x, x, 659, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, 19, x, x, x, 23, x, x, x, x, x, 29, x, 409, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, 17]
  const fns = [findEarliestStartBoogaloo, findEarliestStartBoogalooTwo, findEarliestStartBoogalooThree]

  // for (let i = 0; i < tests.length; i++) {
  //   const arr = tests[i]
  //   const fastest = { ns: Number.MAX_SAFE_INTEGER, name: '', ans: 0 }
  //   const results = []
  //   for (let x = 0; x < fns.length; x++) {
  //     const fn = fns[x]
  //     const res = await timeFunction(() => fn(arr))
  //     if (fastest.ns > res.ms) {
  //       fastest.ns = res.ms
  //       fastest.name = fn.name
  //       fastest.ans = res.result
  //     }
  //     results.push({ name: fn.name, ...res })
  //   }
  //   for (let x = 0; x < results.length; x++) {
  //     const result = results[x]
  //     result.diff = result.ms - fastest.ns
  //     console.log(`${arr.join(', ')}: ${result.name} => ${JSON.stringify(result)}`)
  //   }
  //   console.log(`Fastest was ${fastest.name} at ${fastest.ns}`)
  //   console.log('')
  // }
  const task1 = await timeFunction(() => part1(input))
  const task2 = await timeFunction(() => part2(input, 1414161243994 * 10))
  return [{ ans: task1.result.ans, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

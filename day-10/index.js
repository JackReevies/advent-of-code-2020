const { timeFunction, getInput, convertToTimestamp } = require('../common')

function part1(input) {
  let curJolt = 0
  let diff1s = 0
  let diff3s = 0
  let number = 0
  for (let i = 0; i < input.length; i++) {
    const obj = findBestAdapter(curJolt, input)
    let number = input.find(o => o - curJolt === 1)
    if (number) {
      diff1s++
    } else {
      number = input.find(o => o - curJolt === 3)
      diff3s++
    }

    if (!number) {
      throw new Error(`Chain broken`)
    }
    curJolt = number
  }

  return diff1s * (diff3s + 1)
}

function part2Brute(input) {
  input.sort((a, b) => a < b ? -1 : 1)
  const ourDeviceJoltage = input[input.length - 1] + 3
  let acc = 0
  let startIndex = 0
  let startNum = 0
  startNum = input[startIndex]
  let curJolt = 0
  let routes = {}
  let currentRoute = []
  for (let i = 0; i < input.length; i += 1) {
    const number = input[i];
    const diff = number - curJolt

    if (diff > 0 && diff <= 3) {
      curJolt = number
      currentRoute.push(number)
    } else {
      console.log()
    }

    // If we've met the goal and we've progressed beyond our startIndex
    // (else we've found the target number in the list and not summed it)
    if (curJolt + 3 === ourDeviceJoltage) {
      // Yay - we found a route
      const key = currentRoute.join('')
      routes[currentRoute.length] = { [key]: currentRoute }

    } else if (i === input.length - 1) {
      // Last in list (which will always be used) but our total is NOT 3 off of ourDeviceJoltage

    } // else still on track... keep on adding
  }

  // Now we have our biggest route
  let obj = { count: 1 }
  searchForMutations(currentRoute, routes, obj)
  let shortestPossibleLength = (ourDeviceJoltage - 3) / 3
  const startTime = Date.now()
  for (let x = currentRoute.length - 1; x > shortestPossibleLength - 1; x--) {
    if (!routes[x]) {
      console.warn(`There are no routes of length: ${x}`)
      continue
    }
    Object.values(routes[x]).forEach(route => {
      searchForMutations(route, routes, obj)
    })
    console.log(`${Object.values(routes[x]).length} valid routes for length ${x}. [${obj.count} total valid routes] [${convertToTimestamp(Date.now() - startTime)} elapsed]`)
  }
  console.log(`we have ${obj.count} valid routes`)
  return routes
}

function part2(input) {
  input.sort((a, b) => a < b ? -1 : 1)
  const subRoutes = []
  let tmp = 0
  let results = []
  for (let i = 0; i < input.length; i++) {
    const number = input[i];
    const prevNumber = input[i - 1];
    if (number - prevNumber >= 3) {
      const sub = input.slice(tmp, i)
      subRoutes.push(sub)
      tmp = i
      results.push(searchAndIterateMutations(sub))
    }
  }

  const sub = input.slice(tmp)
  subRoutes.push(sub)
  results.push(searchAndIterateMutations(sub))

  return results.reduce((acc, obj) => acc * obj, 1)
}

function searchAndIterateMutations(route) {
  let obj = { count: 1 }
  let routes = {}
  searchForMutations(route, routes, obj)
  const startTime = Date.now()
  for (let x = route.length - 1; x > 0; x--) {
    if (!routes[x]) {
      continue
    }
    Object.values(routes[x]).forEach(route => {
      searchForMutations(route, routes, obj)
    })
  }
  return obj.count
}

function searchForMutations(route, validRoutes, total) {
  // We can iterate backwards and find mutations
  // A mutation being...  /// ... 144, 145, 146, 147 END
  // 145 is optional here because 144 can jump straight to 146
  // so we can duplicate the route and take out 145
  // Repeat this for every number

  // We start at -2 because we KNOW we cant remove 147
  for (let i = route.length - 2; i >= 0; i--) {
    const b = route[i] // 146
    const a = route[i - 1] || 0 // 145
    const c = route[i + 1] // 147

    if (c - a <= 3) {
      // we can remove b without breaking the chain
      const dupeRoute = Object.assign([], route)
      dupeRoute.splice(i, 1)
      const key = dupeRoute.join('')
      if (!validRoutes[dupeRoute.length]) {
        validRoutes[dupeRoute.length] = {}
      }
      if (validRoutes[dupeRoute.length][key]) {
        continue
      }
      validRoutes[dupeRoute.length][key] = dupeRoute
      total.count++
    }
  }
}

function findBestAdapter(curJolt, input) {
  const diff1 = input.find(o => o - curJolt === 1)
  if (diff1) {
    return
  }
  const diff3 = input.find(o => o - curJolt === 3)
  return diff3
}

async function start() {
  const input = getInput(`${__dirname}/input.txt`).map(o => Number(o))
  const task1 = await timeFunction(() => part1(Object.assign([], input)))
  const task2 = await timeFunction(() => part2(input, task1.result))
  return [{ ans: task1.result, ms: task1.ms }, { ans: task2.result, ms: task2.ms }]
}

module.exports = start

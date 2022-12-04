const { timeFunction, getInput } = require('../common')

function followRoute (input, verbose = false) {
  let facing = 90
  let x = 0
  let y = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    const val = Number(line.substring(1))
    if (line[0] === 'F') {
      if (facing === 90) {
        x += val
      } else if (facing === 270) {
        x -= val
      } else if (facing === 180) {
        y += val
      } else if (facing === 0) {
        y -= val
      } else {
        throw new Error(`Unknown orientation ${facing} (line ${i})`)
      }
    } else if (line[0] === 'N') {
      y -= val
    } else if (line[0] === 'S') {
      y += val
    } else if (line[0] === 'E') {
      x += val
    } else if (line[0] === 'W') {
      x -= val
    } else if (line[0] === 'L') {
      facing -= val
    } else if (line[0] === 'R') {
      facing += val
    } else {
      throw new Error(`Unknown instruction ${line} (line ${i})`)
    }

    if (facing >= 360) {
      facing = facing - 360
    } else if (facing < 0) {
      facing = 360 + facing
    }
    if (verbose) {
      console.log(`[${i}] Ship is now at (${x}, ${y}) facing ${facing}`)
    }
  }

  return { ans: Math.abs(x) + Math.abs(y), x, y }
}

function followRoutePart2 (input, verbose = false) {
  const waypoint = { x: 10, y: -1 }
  let x = 0
  let y = 0
  for (let i = 0; i < input.length; i++) {
    const line = input[i]
    const val = Number(line.substring(1))
    if (line[0] === 'F') {
      x += waypoint.x * val
      y += waypoint.y * val
    } else if (line[0] === 'N') {
      waypoint.y -= val
    } else if (line[0] === 'S') {
      waypoint.y += val
    } else if (line[0] === 'E') {
      waypoint.x += val
    } else if (line[0] === 'W') {
      waypoint.x -= val
    } else if (line[0] === 'L') {
      const rotated = rotate(waypoint.x, waypoint.y, 360 - val)
      waypoint.x = rotated.x
      waypoint.y = rotated.y
    } else if (line[0] === 'R') {
      const rotated = rotate(waypoint.x, waypoint.y, val)
      waypoint.x = rotated.x
      waypoint.y = rotated.y
    } else {
      throw new Error(`Unknown instruction ${line} (line ${i})`)
    }

    if (verbose) {
      console.log(`[${i}] Ship is now at (${x}, ${y}) and waypoint at (${waypoint.x}, ${waypoint.y})`)
    }
  }

  return { ans: Math.abs(x) + Math.abs(y), x, y }
}

function rotate (x, y, degrees) {
  if (degrees < 0) {
    degrees = degrees + 360
  } else if (degrees > 360) {
    degrees = degrees - 360
  }
  if (degrees === 0) {
    return { x, y }
  } else if (degrees === 90) {
    return { x: y * -1, y: x }
  } else if (degrees === 180) {
    return { x: -x, y: -y }
  } else if (degrees === 270) {
    return { x: y, y: x * -1 }
  } else {
    throw new Error(`Unexpected angle ${degrees}`)
  }
}

async function start (verbose) {
  const input = getInput(`${__dirname}/input.txt`)
  const task1 = await timeFunction(() => followRoute(input, verbose))
  const task2 = await timeFunction(() => followRoutePart2(input, verbose))
  return [{ ans: task1.result.ans, ms: task1.ms }, { ans: task2.result.ans, ms: task2.ms }]
}

module.exports = start

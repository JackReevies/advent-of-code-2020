const fs = require('fs')

const fns = []
const answers = [[1019904, 176647680], [548, 502], [162, 3064612320], [219, 127], [885, 623], [6662, 3382],
  [372, 8015], [1782, 797], [105950735, 13826915], [1848, 8099130339328], [2470, 2259], [2270, 138669],
  [246, 939490236001473], [10035335144067, 3817372618036], [1085, 10652], [25984, 1265347500049], [230, 1600], [1451467526514, 224973686321527]]

function discoverDays () {
  for (let i = 1; i < 26; i++) {
    if (fs.existsSync(`./day-${i}/index.js`)) {
      fns.push(require(`./day-${i}/index.js`))
    }
  }
}

async function start () {
  discoverDays()

  for (let i = 0; i < fns.length; i++) {
    console.log(`Day ${i + 1}`)
    console.log('------')
    const fn = fns[i]
    const expected = answers[i]
    const actual = await fn()

    expected.forEach((val, i) => {
      const actualResult = actual[i]
      if (val === actualResult.ans) {
        console.log(`Task ${i + 1} is Correct (${val}) (took ${actualResult.ms}ms)`)
      } else {
        console.error(`Task ${i + 1} is Wrong (expected ${val} but got ${actualResult.ans}) (took ${actualResult.ms}ms)`)
      }
    })
    console.log('============')
  }
}

start()

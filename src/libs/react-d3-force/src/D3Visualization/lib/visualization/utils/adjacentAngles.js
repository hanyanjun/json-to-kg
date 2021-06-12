export default class AdjacentAngles {
  findRuns (AngleList, minSeparation) {
    let p = 0
    let start = 0
    let end = 0
    const runs = []
    const minStart = function () {
      if (runs.length === 0) {
        return 0
      } else {
        return runs[0].start
      }
    }

    var scanForDensePair = function () {
      start = p
      end = AngleList.wrapIndex(p + 1)
      if (end === minStart()) {
        return 'done'
      } else {
        p = end
        if (tooDense(start, end)) {
          return extendEnd
        } else {
          return scanForDensePair
        }
      }
    }

    var extendEnd = function () {
      if (p === minStart()) {
        return 'done'
      } else if (tooDense(start, AngleList.wrapIndex(p + 1))) {
        end = AngleList.wrapIndex(p + 1)
        p = end
        return extendEnd
      } else {
        p = start
        return extendStart
      }
    }

    var extendStart = function () {
      const candidateStart = AngleList.wrapIndex(p - 1)
      if (tooDense(candidateStart, end) && candidateStart !== end) {
        start = candidateStart
        p = start
        return extendStart
      } else {
        runs.push({
          start,
          end
        })
        p = end
        return scanForDensePair
      }
    }

    var tooDense = function (start, end) {
      const run = {
        start,
        end
      }
      return AngleList.angle(run) < AngleList.length(run) * minSeparation
    }

    let stepCount = 0
    let step = scanForDensePair
    while (step !== 'done') {
      if (stepCount++ > AngleList.totalLength() * 10) {
        console.log(
          'Warning: failed to layout arrows',
          (() => {
            const result = []
            for (let key of Object.keys(AngleList.list || {})) {
              const value = AngleList.list[key]
              result.push(`${key}: ${value.angle}`)
            }
            return result
          })().join('\n'),
          minSeparation
        )
        break
      }
      step = step()
    }

    return runs
  }
}

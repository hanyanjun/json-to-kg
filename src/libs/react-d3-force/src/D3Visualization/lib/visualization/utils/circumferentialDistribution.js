
import AngleListClass from './angleList'
import AdjacentAngles from './adjacentAngles'

export default function distributeCircular (arrowAngles, minSeparation) {
  let angle
  const list = []
  for (var key in arrowAngles.floating) {
    angle = arrowAngles.floating[key]
    list.push({
      key,
      angle,
      fixed: false
    })
  }
  for (key in arrowAngles.fixed) {
    angle = arrowAngles.fixed[key]
    list.push({
      key,
      angle,
      fixed: true
    })
  }

  list.sort((a, b) => a.angle - b.angle)

  const AngleList = new AngleListClass(list)
  const runsOfTooDenseArrows = new AdjacentAngles().findRuns(
    AngleList,
    minSeparation
  )

  const wrapAngle = function (angle) {
    if (angle >= 360) {
      return angle - 360
    } else if (angle < 0) {
      return angle + 360
    } else {
      return angle
    }
  }

  const result = {}

  const splitByFixedArrows = function (run) {
    let asc, i
    let end
    const runs = []
    let currentStart = run.start
    for (
      i = 1, end = AngleList.length(run), asc = end >= 1;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      const wrapped = AngleList.wrapIndex(run.start + i)
      if (AngleList.fixed(wrapped)) {
        runs.push({
          start: currentStart,
          end: wrapped
        })
        currentStart = wrapped
      }
    }
    if (!AngleList.fixed(run.end)) {
      runs.push({
        start: currentStart,
        end: run.end
      })
    }
    return runs
  }

  for (let tooDenseRun of Array.from(runsOfTooDenseArrows)) {
    const moveableRuns = splitByFixedArrows(tooDenseRun)
    for (let run of Array.from(moveableRuns)) {
      var end, i, rawAngle
      const runLength = AngleList.length(run)
      if (AngleList.fixed(run.start) && AngleList.fixed(run.end)) {
        var asc
        const separation = AngleList.angle(run) / runLength
        for (
          i = 0, end = runLength, asc = end >= 0;
          asc ? i <= end : i >= end;
          asc ? i++ : i--
        ) {
          rawAngle = list[run.start].angle + i * separation
          result[list[AngleList.wrapIndex(run.start + i)].key] = wrapAngle(
            rawAngle
          )
        }
      } else if (AngleList.fixed(run.start) && !AngleList.fixed(run.end)) {
        var asc1, end1
        for (
          i = 0, end1 = runLength, asc1 = end1 >= 0;
          asc1 ? i <= end1 : i >= end1;
          asc1 ? i++ : i--
        ) {
          rawAngle = list[run.start].angle + i * minSeparation
          result[list[AngleList.wrapIndex(run.start + i)].key] = wrapAngle(
            rawAngle
          )
        }
      } else if (!AngleList.fixed(run.start) && AngleList.fixed(run.end)) {
        var asc2, end2
        for (
          i = 0, end2 = runLength, asc2 = end2 >= 0;
          asc2 ? i <= end2 : i >= end2;
          asc2 ? i++ : i--
        ) {
          rawAngle = list[run.end].angle - (runLength - i) * minSeparation
          result[list[AngleList.wrapIndex(run.start + i)].key] = wrapAngle(
            rawAngle
          )
        }
      } else {
        var asc3, end3
        const center = list[run.start].angle + AngleList.angle(run) / 2
        for (
          i = 0, end3 = runLength, asc3 = end3 >= 0;
          asc3 ? i <= end3 : i >= end3;
          asc3 ? i++ : i--
        ) {
          rawAngle = center + (i - runLength / 2) * minSeparation
          result[list[AngleList.wrapIndex(run.start + i)].key] = wrapAngle(
            rawAngle
          )
        }
      }
    }
  }

  for (key in arrowAngles.floating) {
    if (!result.hasOwnProperty(key)) {
      result[key] = arrowAngles.floating[key]
    }
  }

  for (key in arrowAngles.fixed) {
    if (!result.hasOwnProperty(key)) {
      result[key] = arrowAngles.fixed[key]
    }
  }

  return result
}

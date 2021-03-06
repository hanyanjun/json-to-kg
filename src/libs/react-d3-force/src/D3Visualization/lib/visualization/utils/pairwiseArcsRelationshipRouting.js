
import measureText from './textMeasurement'
import LoopArrow from './loopArrow'
import StraightArrow from './straightArrow'
import ArcArrow from './arcArrow'

export default class PairwiseArcsRelationshipRouting {
  constructor (style) {
    this.style = style
  }

  measureRelationshipCaption (relationship, caption) {
    const fontFamily = 'sans-serif'
    const padding = parseFloat(
      this.style.forRelationship(relationship).get('padding')
    )
    return (
      measureText(caption, fontFamily, relationship.captionHeight) + padding * 2
    )
  }

  captionFitsInsideArrowShaftWidth (relationship) {
    return (
      parseFloat(this.style.forRelationship(relationship).get('shaft-width')) >
      relationship.captionHeight
    )
  }

  measureRelationshipCaptions (relationships) {
    return (() => {
      const result = []
      for (let relationship of Array.from(relationships)) {
        relationship.captionHeight = parseFloat(
          this.style.forRelationship(relationship).get('font-size')
        )
        relationship.captionLength = this.measureRelationshipCaption(
          relationship,
          relationship.caption
        )
        result.push(
          (relationship.captionLayout =
            this.captionFitsInsideArrowShaftWidth(relationship) &&
            !relationship.isLoop()
              ? 'internal'
              : 'external')
        )
      }
      return result
    })()
  }

  shortenCaption (relationship, caption, targetWidth) {
    let shortCaption = caption || 'caption'
    while (true) {
      if (shortCaption.length <= 2) {
        return ['', 0]
      }
      shortCaption = shortCaption.substr(0, shortCaption.length - 2) + '\u2026'
      const width = this.measureRelationshipCaption(relationship, shortCaption)
      if (width < targetWidth) {
        return [shortCaption, width]
      }
    }
  }

  computeGeometryForNonLoopArrows (nodePairs) {
    const square = distance => distance * distance
    return (() => {
      const result = []
      for (var nodePair of Array.from(nodePairs)) {
        if (!nodePair.isLoop()) {
          const dx = nodePair.nodeA.x - nodePair.nodeB.x
          const dy = nodePair.nodeA.y - nodePair.nodeB.y
          var angle = ((Math.atan2(dy, dx) / Math.PI) * 180 + 360) % 360
          var centreDistance = Math.sqrt(square(dx) + square(dy))
          result.push(
            (() => {
              const result1 = []
              for (let relationship of Array.from(nodePair.relationships)) {
                relationship.naturalAngle =
                  relationship.target === nodePair.nodeA
                    ? (angle + 180) % 360
                    : angle
                result1.push((relationship.centreDistance = centreDistance))
              }
              return result1
            })()
          )
        } else {
          result.push(undefined)
        }
      }
      return result
    })()
  }

  distributeAnglesForLoopArrows (nodePairs, relationships) {
    return (() => {
      const result = []
      for (var nodePair of Array.from(nodePairs)) {
        if (nodePair.isLoop()) {
          var i, separation
          let angles = []
          const node = nodePair.nodeA
          for (var relationship of Array.from(relationships)) {
            if (!relationship.isLoop()) {
              if (relationship.source === node) {
                angles.push(relationship.naturalAngle)
              }
              if (relationship.target === node) {
                angles.push(relationship.naturalAngle + 180)
              }
            }
          }
          angles = angles.map(a => (a + 360) % 360).sort((a, b) => a - b)
          if (angles.length > 0) {
            var end, start
            var biggestGap = {
              start: 0,
              end: 0
            }
            for (i = 0; i < angles.length; i++) {
              const angle = angles[i]
              start = angle
              end = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1]
              if (end - start > biggestGap.end - biggestGap.start) {
                biggestGap.start = start
                biggestGap.end = end
              }
            }
            separation =
              (biggestGap.end - biggestGap.start) /
              (nodePair.relationships.length + 1)
            result.push(
              (() => {
                const result1 = []
                for (i = 0; i < nodePair.relationships.length; i++) {
                  relationship = nodePair.relationships[i]
                  result1.push(
                    (relationship.naturalAngle =
                      (biggestGap.start + (i + 1) * separation - 90) % 360)
                  )
                }
                return result1
              })()
            )
          } else {
            separation = 360 / nodePair.relationships.length
            result.push(
              (() => {
                const result2 = []
                for (i = 0; i < nodePair.relationships.length; i++) {
                  relationship = nodePair.relationships[i]
                  result2.push((relationship.naturalAngle = i * separation))
                }
                return result2
              })()
            )
          }
        } else {
          result.push(undefined)
        }
      }
      return result
    })()
  }

  layoutRelationships (graph) {
    const nodePairs = graph.groupedRelationships()
    this.computeGeometryForNonLoopArrows(nodePairs)
    this.distributeAnglesForLoopArrows(nodePairs, graph.relationships())

    return (() => {
      const result = []
      for (var nodePair of Array.from(nodePairs)) {
        for (var relationship of Array.from(nodePair.relationships)) {
          delete relationship.arrow
        }

        var middleRelationshipIndex = (nodePair.relationships.length - 1) / 2
        var defaultDeflectionStep = 30
        const maximumTotalDeflection = 150
        const numberOfSteps = nodePair.relationships.length - 1
        const totalDeflection = defaultDeflectionStep * numberOfSteps

        var deflectionStep =
          totalDeflection > maximumTotalDeflection
            ? maximumTotalDeflection / numberOfSteps
            : defaultDeflectionStep

        result.push(
          (() => {
            const result1 = []
            for (let i = 0; i < nodePair.relationships.length; i++) {
              var ref
              relationship = nodePair.relationships[i]
              const shaftWidth =
                parseFloat(
                  this.style.forRelationship(relationship).get('shaft-width')
                ) || 2
              const headWidth = shaftWidth + 6
              const headHeight = headWidth

              if (nodePair.isLoop()) {
                relationship.arrow = new LoopArrow(
                  relationship.source.radius,
                  40,
                  defaultDeflectionStep,
                  shaftWidth,
                  headWidth,
                  headHeight,
                  relationship.captionHeight
                )
              } else {
                if (i === middleRelationshipIndex) {
                  relationship.arrow = new StraightArrow(
                    relationship.source.radius,
                    relationship.target.radius,
                    relationship.centreDistance,
                    shaftWidth,
                    headWidth,
                    headHeight,
                    relationship.captionLayout
                  )
                } else {
                  let deflection =
                    deflectionStep * (i - middleRelationshipIndex)

                  if (nodePair.nodeA !== relationship.source) {
                    deflection *= -1
                  }

                  relationship.arrow = new ArcArrow(
                    relationship.source.radius,
                    relationship.target.radius,
                    relationship.centreDistance,
                    deflection,
                    shaftWidth,
                    headWidth,
                    headHeight,
                    relationship.captionLayout
                  )
                }
              }

              result1.push(
                ([
                  relationship.shortCaption,
                  relationship.shortCaptionLength
                ] = Array.from(
                  (ref =
                    relationship.arrow.shaftLength > relationship.captionLength
                      ? [relationship.caption, relationship.captionLength]
                      : this.shortenCaption(
                        relationship,
                        relationship.caption,
                        relationship.arrow.shaftLength
                      ))
                )),
                ref
              )
            }
            return result1
          })()
        )
      }
      return result
    })()
  }
}

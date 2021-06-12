import d3 from 'd3'
import collision from './collision'
import circularLayout from '../utils/circularLayout'
import cloneArray from '../utils/arrays'

const layout = {
  force: () => {
    return {
      init: render => {
        const forceLayout = {}

        const linkDistance = 45

        const d3force = d3.layout
          .force()
          .linkDistance(
            relationship =>
              relationship.source.radius +
              relationship.target.radius +
              linkDistance
          )
          .charge(-1000)
        const newStatsBucket = function () {
          const bucket = {
            layoutTime: 0,
            layoutSteps: 0
          }
          return bucket
        }
        let currentStats = newStatsBucket()

        forceLayout.collectStats = function () {
          const latestStats = currentStats
          currentStats = newStatsBucket()
          return latestStats
        }

        const accelerateLayout = function () {
          let maxStepsPerTick = 100
          const maxAnimationFramesPerSecond = 60
          const maxComputeTime = 1000 / maxAnimationFramesPerSecond
          const now =
            window.performance && window.performance.now
              ? () => window.performance.now()
              : () => Date.now()

          const d3Tick = d3force.tick
          return (d3force.tick = function () {
            const startTick = now()
            let step = maxStepsPerTick
            while (step-- && now() - startTick < maxComputeTime) {
              const startCalcs = now()
              currentStats.layoutSteps++

              collision.avoidOverlap(d3force.nodes())

              if (d3Tick()) {
                maxStepsPerTick = 2
                return true
              }
              currentStats.layoutTime += now() - startCalcs
            }
            render()
            return false
          })
        }

        accelerateLayout()

        const oneRelationshipPerPairOfNodes = graph =>
          Array.from(graph.groupedRelationships()).map(
            pair => pair.relationships[0]
          )

        forceLayout.update = function (graph, size) {
          let nodes = cloneArray(graph.nodes())
          const relationships = oneRelationshipPerPairOfNodes(graph)
          const radius = (nodes.length * linkDistance) / (Math.PI * 2)
          const center = {
            x: size[0] / 2,
            y: size[1] / 2
          }
          circularLayout(nodes, center, radius)
          return d3force
            .nodes(nodes)
            .links(relationships)
            .size(size)
            .start()
        }

        forceLayout.drag = d3force.drag
        forceLayout.on = d3force.on
        return forceLayout
      }
    }
  }
}

export default layout

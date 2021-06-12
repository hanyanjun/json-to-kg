import d3 from 'd3'
export const prepareForExport = (svgElement, graphElement, type) => {
  const dimensions = getSvgDimensions(graphElement)
  let svg = d3.select(
    document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  )

  svg.append('title').text('Neo4j Graph Visualization')
  svg.append('desc').text('Created using Neo4j (http://www.neo4j.com/)')

  switch (type) {
    case 'plan': {
      svg = appendPlanLayers(svgElement, svg)
      break
    }
    case 'graph':
    default:
      svg = appendGraphLayers(svgElement, svg)
  }

  svg.selectAll('.overlay, .ring').remove()
  svg.selectAll('.context-menu-item').remove()
  svg.selectAll('text').attr('font-family', 'sans-serif')

  svg.attr('width', dimensions.width)
  svg.attr('height', dimensions.height)
  svg.attr('viewBox', dimensions.viewBox)

  return svg
}

const getSvgDimensions = view => {
  let boundingBox, dimensions
  boundingBox = view.boundingBox()
  dimensions = {
    width: boundingBox.width,
    height: boundingBox.height,
    viewBox: [
      boundingBox.x,
      boundingBox.y,
      boundingBox.width,
      boundingBox.height
    ].join(' ')
  }
  return dimensions
}

const appendGraphLayers = (svgElement, svg) => {
  window.d3
    .select(svgElement)
    .selectAll('g.layer')
    .each(function (node) {
      svg.node().appendChild(
        window.d3
          .select(this)
          .node()
          .cloneNode(true)
      )
    })
  return svg
}
const appendPlanLayers = (svgElement, svg) => {
  window.d3
    .select(svgElement)
    .selectAll('g.layer')
    .each(function (node) {
      svg.node().appendChild(
        window.d3
          .select(this)
          .node()
          .cloneNode(true)
      )
    })
  return svg
}

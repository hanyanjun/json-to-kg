
import d3 from 'd3'

const collision = {
  avoidOverlap: nodes => {
    const q = d3.geom.quadtree(nodes)
    return Array.from(nodes).map(n => q.visit(collide(n)))
  }
}
const collide = node => {
  let r = node.radius + 10
  const nx1 = node.x - r
  const nx2 = node.x + r
  const ny1 = node.y - r
  const ny2 = node.y + r
  return (quad, x1, y1, x2, y2) => {
    let l, x, y
    if (quad.point && quad.point !== node) {
      x = node.x - quad.point.x
      y = node.y - quad.point.y
      l = Math.sqrt(x * x + y * y)
      r = node.radius + 10 + quad.point.radius
    }
    if (l < r) {
      l = ((l - r) / l) * 0.5
      node.x -= x *= l
      node.y -= y *= l
      quad.point.x += x
      quad.point.y += y
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
  }
}

export default collision

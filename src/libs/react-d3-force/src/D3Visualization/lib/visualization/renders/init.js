import Renderer from '../components/renderer'
const noop = function () {}

const nodeRingStrokeSize = 8

// 图片
const nodeDefs = new Renderer({
  onGraphChange (selection, viz) {
    const defs = selection.selectAll('defs.img').data(node => [node])
    
    defs.enter().append('defs').append('pattern').classed('pattern', true).attr({
      patternContentUnits: 'objectBoundingBox',
      id: 'avatar',
      width: '100%',
      height: '100%'
    }).append('image').attr({
      'height': 1,
      'width': 1,
      // 'xlink:href':'http://'
      // 加了此处图片导出出错 后续跟进  TODO
      'xlink:href': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAEjklEQVR4nO3c2UrrUBTG8b9SpWLF4nHAEfXeN1BUFOcBRUUfwu74JDYd0Lb4SqWt4oBeOqB3ouKVei48nGOPTZudbjtlr8uma6/w40sCSUhdLBb74Acqk8kQi8WUrTc9Pc3a2ppUz9HREclkUsl8r9eLYRj09/dn/V6vZPX/yi148AOAbsIDxYBuwwPwKJlE7eE1NTUhhMiLB4oS6FY8UJDAdDpNPB4vdpm/NTMzw+rqqlRPufCgyAS6HQ+KSGAl4CUSCVKplJL5TU1NGIZBX1+f7Z6rqytnCdR4n3jhcFg+gRrvEy8UCvH29iaXQI2XjQcSFxGN9x0PbF5Eag2vubmZQCBQNB7YAEylUiQSCfm9tKjZ2VlWVlakesqNd3l5STgc/oYHBQ5hjZcfD/IksBLw4vE46XRayfzm5maEEPT29truKYQHFgnUePbwIEcCNd4nXigU4v39veB/sxKo8eTw4AugxpPHgz+HcK3h+Xw+AoHAj+MBeJLJJEdHR7L7aFluwgOo83g8yh5rzs3Nsby8LNVTbryLiwsikYgjPFD4UMmNeKDooZITvFgsRiaTUTEen8+HEIKenh7bPSrwQEEC3YwHRSawWvHC4TAfH2pO/Y4TqPFgdHTUGaDG+8Tb2dmRB9R4//BA8hw4Pz/P0tKS1LBy452fnxOJRH4EDyQANR6MjY2xvb2d9ZstQCd4h4eHHB8fS/VYlc/nwzAMuru7bfeUAg9sXIU1njUeFEhgufFaWloQQkjjhcNhJfMhPx7kSaDGK4z3+vqaO4HViHd2dkYkElEyH2B8fJytrS3L7a+vr5im+R1Q49nDCwaDXF9fZx/CGk8OD75cRBYWFlhcXJQa5nY8+APoBO/g4ICTkxOHu5pd1YoH4KkEvL29Pbq6umz3lBrv5eWFUCj0DQ+gXuM5xwPJmwkq8VpbWxFCVDUeSACWG+/09JRoNKpkPqjBA5uAtYY3MTHB5uam5faXlxdM0+Tm5qbgWgUBo9Eop6encntoUa2trRiGQWdnp+2eSsaDAndjNF7hsgTUePYqJ6DGs1/fzoFuw3t+fiYUCjnCg/8AVeL5/X6EEDWNB18OYY3nrDxQfryTkxMODg6UzAeYnJxkY2PDcrsqPIC6kZGRj7Ozs6IXgurBM02T29tbJfOUvWDp9/sxDIOOjg7bPdWONzAwoOYFS7fiCSGKB3QzntfrLQ7Q7XhQxAuWbsQbHBxkd3f3Lx44fMFS4/0r6QQ6wTs+Pubw8FB2lGVNTU2xvr5uub1UeCAJWC14wWCQu7s7JfMGBwcRQtDY2Jhzu21Av9/P3t4e7e3ttofXOh7YBKwGvKenJ0zTVIY3NDREIBDIiwc2LiIaL3/lBdR4hcsSUOPZq5znwLa2NoQQFY+3v7/P/f29knlO8CBHAjWeXGUl0Aleqb9eWUl48AXQrXhCCBoaGhyv4YFPPMMw+PXrl+3GUuM9Pj5immZF4QF43Ig3PDxMIBAoGg+gXuMVVx4ZPNWfwat2PJC4mVAOvGAwyMPDg5J5P4EHNm+oajzrKpjAUn+9sprwAH4DZmdcmtPQSQAAAAAASUVORK5CYII='
    });

    return defs.exit().remove()
  },
  onTick: noop
})

const nodeOutline = new Renderer({
  onGraphChange (selection, viz) {
    const circles = selection.selectAll('circle.outline').data(node => [node])
    circles
      .enter()
      .append('circle')
      .classed('outline', true)
      .attr({
        cx: 0,
        cy: 0
      })
    circles.attr({
      r (node) {
        return node.radius
      },
      fill (node) {
        if(node.isFilter){
          return 'url(#avatar)';
        }
        // if(/[frame|rootNode1|rootNode2]/.test(node.className)){
          // return `url(#avatar)`
        // }
        return viz.style.forNode(node).get('color')
      },
      stroke (node) {
        return viz.style.forNode(node).get('border-color')
      },
      'stroke-width' (node) {
        return viz.style.forNode(node).get('border-width')
      }
    })

    return circles.exit().remove()
  },
  onTick: noop
})

const nodeCaption = new Renderer({
  onGraphChange (selection, viz) {
    const text = selection.selectAll('text.caption').data(node => node.caption)

    text
      .enter()
      .append('text')
      .classed('caption', true)
      .attr({ 'text-anchor': 'middle' })
      .attr({ 'pointer-events': 'none' })
    
    text
      .text(line => {
        // console.log(line);
        // /[frame|rootNode1|rootNode2]/.test(line.node.className) ? '' : line.text
        return line.text
      })
      .attr('y', line => line.baseline)
      .attr('font-size', line => viz.style.forNode(line.node).get('font-size'))
      .attr({
        fill (line) {
          return viz.style.forNode(line.node).get('text-color-internal')
        }
      })
      // console.log(text);
    return text.exit().remove()
  },

  onTick: noop
})

const nodeIcon = new Renderer({
  onGraphChange (selection, viz) {
    const text = selection.selectAll('g').data(node => node.caption)
    text
      .enter()
      .append('text')
      .attr({ 'text-anchor': 'middle' })
      .attr({ 'pointer-events': 'none' })
      .attr({ 'font-family': 'streamline' })

    text
      .text(line => viz.style.forNode(line.node).get('icon-code'))
      .attr('dy', line => line.node.radius / 16)
      .attr('font-size', line => line.node.radius)
      .attr({
        fill (line) {
          return viz.style.forNode(line.node).get('text-color-internal')
        }
      })

    return text.exit().remove()
  },

  onTick: noop
})

const nodeRing = new Renderer({
  onGraphChange (selection) {
    const circles = selection.selectAll('circle.ring').data(node => [node])
    circles
      .enter()
      .insert('circle', '.outline')
      .classed('ring', true)
      .attr({
        cx: 0,
        cy: 0,
        'stroke-width': nodeRingStrokeSize + 'px'
      })

    circles.attr({
      r (node) {
        return node.radius + 4
      }
    })

    return circles.exit().remove()
  },

  onTick: noop
})

const arrowPath = new Renderer({
  name: 'arrowPath',
  onGraphChange (selection, viz) {
    const paths = selection.selectAll('path.outline').data(rel => [rel])

    paths
      .enter()
      .append('path')
      .classed('outline', true)

    paths
      .attr('fill', rel => viz.style.forRelationship(rel).get('color'))
      .attr('stroke', 'none')

    return paths.exit().remove()
  },

  onTick (selection) {
    return selection
      .selectAll('path')
      .attr('d', d => d.arrow.outline(d.shortCaptionLength))
  }
})





const relationshipBg = new Renderer({
  name: 'relationshipBg',
  onGraphChange (selection, viz) {
    const texts = selection.selectAll('rect').data(rel => [rel])

    texts
      .enter()
      .append('rect')
    return texts.exit().remove()
  },

  onTick (selection, viz) {
    return selection
      .selectAll('rect')
      .attr('x', rel => rel.arrow.midShaftPoint.x - rel.captionLength/2)
      .attr('width', rel => rel.captionLength)
      .attr('height', rel => rel.captionHeight+5)
      .attr('fill' ,   rel => {
        if(rel.isFilter){
          return 'url(#avatar)'
        }
        return 'none'
      } )
      .attr(
        'y',
        rel =>
          rel.arrow.midShaftPoint.y +
          parseFloat(viz.style.forRelationship(rel).get('font-size')) / 2 -
          1 - (rel.captionHeight+10)/2
      )
      .attr('transform', function (rel) {
        if (rel.naturalAngle < 90 || rel.naturalAngle > 270) {
          return `rotate(180 ${rel.arrow.midShaftPoint.x} ${
            rel.arrow.midShaftPoint.y
          })`
        } else {
          return null
        }
      })
  }
})



// 增加文字的text
const relationshipType = new Renderer({
  name: 'relationshipType',
  onGraphChange (selection, viz) {
    const texts = selection.selectAll('text').data(rel => [rel])

    texts
      .enter()
      .append('text')
      .attr({ 'text-anchor': 'middle' })
      .attr({ 'pointer-events': 'none'  })

    texts
      .attr('font-size', rel => viz.style.forRelationship(rel).get('font-size'))
      .attr('fill', rel =>{
        if(rel.isFilter){
          return 'white'
        }
          return viz.style.forRelationship(rel).get(`text-color-${rel.captionLayout}`)
        }
      )

    return texts.exit().remove()
  },

  onTick (selection, viz) {
    return selection
      .selectAll('text')
      .attr('x', rel => rel.arrow.midShaftPoint.x)
      .attr(
        'y',
        rel =>
          rel.arrow.midShaftPoint.y +
          parseFloat(viz.style.forRelationship(rel).get('font-size')) / 2 -
          1
      )
      .attr('transform', function (rel) {
        if (rel.naturalAngle < 90 || rel.naturalAngle > 270) {
          return `rotate(180 ${rel.arrow.midShaftPoint.x} ${
            rel.arrow.midShaftPoint.y
          })`
        } else {
          return null
        }
      })
      .text(rel => rel.shortCaption)
  }
})

const relationshipOverlay = new Renderer({
  name: 'relationshipOverlay',
  onGraphChange (selection) {
    const rects = selection.selectAll('path.overlay').data(rel => [rel])

    rects
      .enter()
      .append('path')
      .classed('overlay', true)

    return rects.exit().remove()
  },

  onTick (selection) {
    const band = 16

    return selection
      .selectAll('path.overlay')
      .attr('d', d => d.arrow.overlay(band))
  }
})

const node = []
node.push(nodeOutline)
node.push(nodeIcon)
node.push(nodeCaption)
node.push(nodeRing)
node.push(nodeDefs)
const nodeSelf = [];
nodeSelf.push(nodeOutline)
nodeSelf.push(nodeIcon)
nodeSelf.push(nodeCaption)
nodeSelf.push(nodeRing)

const relationship = []
relationship.push(arrowPath)
relationship.push(relationshipBg)
relationship.push(relationshipType)
relationship.push(nodeDefs)
relationship.push(relationshipOverlay)
// relationship.push(relOutline)

const relationshipSelf = [];
relationshipSelf.push(arrowPath)
relationshipSelf.push(relationshipBg)
relationshipSelf.push(relationshipType)
relationshipSelf.push(relationshipOverlay)
// relationshipSelf.push(relOutline)



export { node, relationship , nodeSelf , relationshipSelf }

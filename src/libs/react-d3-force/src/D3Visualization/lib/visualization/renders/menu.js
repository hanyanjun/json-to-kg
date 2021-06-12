import d3 from 'd3'
import Renderer from '../components/renderer'
import icons from '../renders/icons'

const noop = function () {}

// TODO:
const numberOfItemsInContextMenu = 6

const arc = function (radius, itemNumber, width) {
  if (width == null) {
    width = 30
  }
  itemNumber = itemNumber - 1
  const startAngle = ((2 * Math.PI) / numberOfItemsInContextMenu) * itemNumber
  const endAngle = startAngle + (2 * Math.PI) / numberOfItemsInContextMenu
  const innerRadius = Math.max(radius + 8, 20)
  return d3.svg
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + width)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .padAngle(0.03)
}
// 获取选中的node
const getSelectedNode = function (node) {
  if (node.selected) {
    return [node]
  } else {
    return []
  }
}

const attachContextEvent = (event, elems, viz, content, label) =>
  (() => {
    const result = []
    for (let elem of Array.from(elems)) {
      elem.on('mousedown.drag', function () {
        d3.event.stopPropagation()
        return null
      })
      elem.on('mouseup', node => viz.trigger(event, node))
      elem.on('mouseover', function (node) {
        node.contextMenu = {
          menuSelection: event,
          menuContent: content,
          label
        }
        return viz.trigger('menuMouseOver', node)
      })
      result.push(
        elem.on('mouseout', function (node) {
          delete node.contextMenu
          return viz.trigger('menuMouseOut', node)
        })
      )
    }
    return result
  })()

const createMenuItem = function (
  selection,
  viz,
  eventName,
  itemNumber,
  className,
  position,
  textValue,
  helpValue
) {
  const path = selection.selectAll(`path.${className}`).data(getSelectedNode)
  const iconPath = selection
    .selectAll(`.icon.${className}`)
    .data(getSelectedNode)

  const tab = path
    .enter()
    .append('path')
    .classed(className, true)
    .classed('context-menu-item', true)
    .attr({
      d (node) {
        return arc(node.radius, itemNumber, 1)()
      }
    })

  const rawSvgIcon = icons[textValue];
  // console.log(icons);
  // console.log(rawSvgIcon)
  const icon = iconPath
    .enter()
    .appendSVG(rawSvgIcon)
    .classed(className, true)
    .classed('context-menu-item', true)
    .attr({
      transform (node) {
        return (
          'translate(' +
          Math.floor(
            arc(node.radius, itemNumber).centroid()[0] +
              (position[0] * 100) / 100
          ) +
          ',' +
          Math.floor(
            arc(node.radius, itemNumber).centroid()[1] +
              (position[1] * 100) / 100
          ) +
          ')' +
          ' ' +
          'scale(0.7)'
        )
      },
      color (node) {
        return viz.style.forNode(node).get('text-color-internal')
      },
      fill(node){
        return  viz.style.forNode(node).get('text-color-internal')
      }
    })
  attachContextEvent(eventName, [tab, icon], viz, helpValue, rawSvgIcon)

  tab
    .transition()
    .duration(200)
    .attr({
      d (node) {
        return arc(node.radius, itemNumber)()
      }
    })

  path
    .exit()
    .transition()
    .duration(200)
    .attr({
      d (node) {
        return arc(node.radius, itemNumber, 1)()
      }
    })
    .remove()

  return iconPath.exit().remove()
}

const donutRemoveNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeClose',
      1,
      'remove_node',
      [-8, -8],
      'Remove',
      'Dismiss'
    )
  },

  onTick: noop
})


const donutExpandNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeDblClicked',
      2,
      'expand_node',
      [-8, -8],
      'Expand / Collapse',
      'Expand / Collapse child relationships'
    )
  },

  onTick: noop
})

const donutUnlockNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeUnlock',
      3,
      'unlock_node',
      [-8, -6],
      'Unlock',
      'Unlock the node to re-layout the graph'
    )
  },

  onTick: noop
})




const donutDeleteNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeDelete',
      4,
      'delete_node',
      [-10, -12],
      'Delete',
      'delete node'
    )
  },
  onTick: noop

})


const donutNewNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeNew',
      5,
      'new_node',
      [-9, -9],
      'New',
      'new node'
    )
  },
  onTick: noop

})



const donutEditNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'nodeEdit',
      6,
      'edit_node',
      [-6, -6],
      'Edit',
      'edit node'
    )
  },
  onTick: noop

})


const menu = []

menu.push(donutExpandNode)
menu.push(donutRemoveNode)
menu.push(donutUnlockNode)
menu.push(donutDeleteNode)
menu.push(donutNewNode)
menu.push(donutEditNode)

export { menu }


import d3 from "d3"
import Renderer from '../components/renderer'

const noop = function () {}

// 获取选中的node
const getRightClickedNode = function (node) {
  if (node.rightClicked) {
    return [node]
  } else {
    return []
  }
}

const attachContextEvent = (event, elems, viz, content) =>
  (() => {
    const result = []
    for (let elem of Array.from(elems)) {
      elem.on('mousedown.drag', function () {
        d3.event.stopPropagation()
        return null
      })
      elem.on('mouseup', node => viz.trigger(event, node))
    }  
    return result
  })()

const createMenuItem = function (
  selection,
  viz,
  eventName,
  itemNumber,
  className,
  text
) {
  let g = selection.selectAll(`.right-menu.${className}`);
  g.remove();
  let g1 =  selection.selectAll(`.right-menu.${className}`).data(getRightClickedNode)
    .enter()
    .append('g')
    .classed(className,true)
    .classed('right-menu',true)
  let rec =   g1.append('rect')
    .attr({
      width : 100,
      height : 20,
      fill : 'white',
      stroke : '#e8e8e8',
      'stroke-width':1,
    })
  let txt =   g1.append('text')
    .text(text)
    .classed('right-menu-text',true)
    .attr({
        x : 10,
        y : 10,
    })

    g1.attr({
      transform : `translate(40,${20*itemNumber})`,
    })
  attachContextEvent(eventName, [rec,txt] , viz, text)

  return;
}

const donutClearNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'clearSelected',
      0,
      'clear_selected',
      '清除选择'
    )
  },

  onTick: noop
})
const donutContraryNode = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'contrarySelected',
      1,
      'contrary_selected',
      '反选'
    )
  },

  onTick: noop
})

const donutBackStatus = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'backStatus',
      2,
      'back_status',
      '上一步'
    )
  },

  onTick: noop
})
const donutInitStatus = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'initStatus',
      3,
      'init_status',
      '初始化'
    )
  },
  onTick: noop
})
const donutMadeChart = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'madeChart',
      4,
      'made_chart',
      '生成图'
    )
  },
  onTick: noop
})
const donutStartFrame = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'startFrame',
      3,
      'start_frame',
      '播放动画'
    )
  },
  onTick: noop
})

const donutAddRel = new Renderer({
  onGraphChange (selection, viz) {
    return createMenuItem(
      selection,
      viz,
      'addRel',
      1,
      'add_rel',
      '新增边'
    )
  },
  onTick: noop
})

const rightMenu = []
const rightMenu1 = []

rightMenu.push(donutClearNode)
rightMenu.push(donutContraryNode)
rightMenu.push(donutBackStatus)
rightMenu.push(donutInitStatus)
rightMenu.push(donutMadeChart)
// rightMenu.push(donutStartFrame)
rightMenu1.push(donutAddRel)


export { rightMenu , rightMenu1 }

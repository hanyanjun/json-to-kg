import d3 from 'd3'
import NeoD3Geometry from './graphGeometry'
import * as vizRenderers from '../renders/init'
import { menu as menuRenderer } from '../renders/menu'
import { rightMenu , rightMenu1} from '../renders/rightMenu'
import vizClickHandler from '../utils/clickHandler'

const vizFn = function (el, measureSize, graph, layout, style) {
  const viz = { style }
  const root = d3.select(el)
  const baseGroup = root.append('g').attr('transform', 'translate(0,0)')
  // 渲染底层画布
  const rect = baseGroup
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    // Make the rect cover the whole surface
    .attr('x', '-2500')
    .attr('y', '-2500')
    .attr('width', '5000')
    .attr('height', '5000')
    .attr('transform', 'scale(1)')
// 渲染显示节点的g组
  const container = baseGroup.append('g')
  const geometry = new NeoD3Geometry(style)


  // This flags that a panning is ongoing and won't trigger
  // 'canvasClick' event when panning ends.
  let draw = false

  // Arbitrary dimension used to keep force layout aligned with
  // the centre of the svg view-port.
  const layoutDimension = 200

  let updateViz = true

  // To be overridden
  viz.trigger = function (event, ...args) {
    console.log(event);
  }

  
  const onNodeClick = node => {
    updateViz = false
    if(d3.event.button ==  0){
      if(d3.event.ctrlKey){
        graph.isCtrlClick = true;
        return viz.trigger('nodeCtrlClick',node)
      }else{
        return viz.trigger('nodeClicked', node)
      }
    }else{
      return viz.trigger('nodeClickRight',node)
    }
  }

  const onNodeDblClick = node => viz.trigger('nodeDblClicked', node)

  const onNodeDragToggle = node => viz.trigger('nodeDragToggle', node)

  const onRelationshipClick = relationship => {
    d3.event.stopPropagation()
    updateViz = false
    return viz.trigger('relationshipClicked', relationship)
  }

  const onNodeMouseOver = node => viz.trigger('nodeMouseOver', node)
  const onNodeMouseOut = node => viz.trigger('nodeMouseOut', node)
  const onNodeMouseUp = function(node){
    if(d3.event.button ==  0){
      if(d3.event.ctrlKey){
        graph.isCtrlClick = true;
        return viz.trigger('nodeCtrlClick',node)
      }
    }else{
      return viz.trigger('nodeClickRight',node)
    }
  }

  const onRelMouseOver = rel => viz.trigger('relMouseOver', rel)
  const onRelMouseOut = rel => viz.trigger('relMouseOut', rel)

  let zoomLevel = null

  const zoomed = function () {
    draw = true
    return container.attr(
      'transform',
      `translate(${zoomBehavior.translate()})scale(${zoomBehavior.scale()})`
    )
  }

  var zoomBehavior = d3.behavior
    .zoom()
    .scaleExtent([0.2, 1])
    .on('zoom', zoomed)

  const interpolateZoom = (translate, scale) =>
    d3
      .transition()
      .duration(500)
      .tween('zoom', function () {
        const t = d3.interpolate(zoomBehavior.translate(), translate)
        const s = d3.interpolate(zoomBehavior.scale(), scale)
        return function (a) {
          zoomBehavior.scale(s(a)).translate(t(a))
          return zoomed()
        }
      })

  let isZoomingIn = true

  viz.zoomInClick = function () {
    isZoomingIn = true
    return zoomClick(this)
  }

  viz.zoomOutClick = function () {
    isZoomingIn = false
    return zoomClick(this)
  }

  var zoomClick = function (element) {
    draw = true
    const limitsReached = { zoomInLimit: false, zoomOutLimit: false }

    if (isZoomingIn) {
      zoomLevel = Number((zoomBehavior.scale() * (1 + 0.2 * 1)).toFixed(2))
      if (zoomLevel >= zoomBehavior.scaleExtent()[1]) {
        limitsReached.zoomInLimit = true
        interpolateZoom(zoomBehavior.translate(), zoomBehavior.scaleExtent()[1])
      } else {
        interpolateZoom(zoomBehavior.translate(), zoomLevel)
      }
    } else {
      zoomLevel = Number((zoomBehavior.scale() * (1 + 0.2 * -1)).toFixed(2))
      if (zoomLevel <= zoomBehavior.scaleExtent()[0]) {
        limitsReached.zoomOutLimit = true
        interpolateZoom(zoomBehavior.translate(), zoomBehavior.scaleExtent()[0])
      } else {
        interpolateZoom(zoomBehavior.translate(), zoomLevel)
      }
    }
    return limitsReached
  }
  // Background click event
  // Check if panning is ongoing
  rect.on('click', function () {
    if (!draw) {
      return viz.trigger('canvasClicked', el)
    }
  })

  baseGroup
    .call(zoomBehavior)
    .on('dblclick.zoom', null)
    // Single click is not panning
    .on('click.zoom', () => (draw = false))
    .on('DOMMouseScroll.zoom', null)
    .on('wheel.zoom', null)
    .on('mousewheel.zoom', null)

  const newStatsBucket = function () {
    const bucket = {
      frameCount: 0,
      geometry: 0,
      relationshipRenderers: (function () {
        const timings = {}
        vizRenderers.relationship.forEach(r => (timings[r.name] = 0))
        return timings
      })()
    }
    bucket.duration = () => bucket.lastFrame - bucket.firstFrame
    bucket.fps = () =>
      ((1000 * bucket.frameCount) / bucket.duration()).toFixed(1)
    bucket.lps = () =>
      ((1000 * bucket.layout.layoutSteps) / bucket.duration()).toFixed(1)
    bucket.top = function () {
      let time
      const renderers = []
      for (let name in bucket.relationshipRenderers) {
        time = bucket.relationshipRenderers[name]
        renderers.push({
          name,
          time
        })
      }
      renderers.push({
        name: 'forceLayout',
        time: bucket.layout.layoutTime
      })
      renderers.sort((a, b) => b.time - a.time)
      const totalRenderTime = renderers.reduce(
        (prev, current) => prev + current.time,
        0
      )
      return renderers
        .map(
          d => `${d.name}: ${((100 * d.time) / totalRenderTime).toFixed(1)}%`
        )
        .join(', ')
    }
    return bucket
  }

  let currentStats = newStatsBucket()

  const now =
    window.performance && window.performance.now
      ? () => window.performance.now()
      : () => Date.now()

  const render = function () {
    if (!currentStats.firstFrame) {
      currentStats.firstFrame = now()
    }
    currentStats.frameCount++
    const startRender = now()
    geometry.onTick(graph)
    currentStats.geometry += now() - startRender

    const nodeGroups = container
      .selectAll('g.node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    for (var renderer of Array.from(vizRenderers.node)) {
      nodeGroups.call(renderer.onTick, viz)
    }

    const relationshipGroups = container
      .selectAll('g.relationship')
      .attr(
        'transform',
        d =>
          `translate(${d.source.x} ${d.source.y}) rotate(${d.naturalAngle +
            180})`
      )
    for (renderer of Array.from(vizRenderers.relationship)) {
      const startRenderer = now()
      relationshipGroups.call(renderer.onTick, viz)
      currentStats.relationshipRenderers[renderer.name] += now() - startRenderer
    }

    return (currentStats.lastFrame = now())
  }
  
  // 初始化 力导向图
  const force = layout.init(render)

  // Add custom drag event listeners
  force
    .drag()
    .on('dragstart.node', d => onNodeDragToggle(d))
    .on('dragend.node', () => onNodeDragToggle())

  viz.collectStats = function () {
    const latestStats = currentStats
    latestStats.layout = force.collectStats()
    currentStats = newStatsBucket()
    return latestStats
  }
// update  就是再进行一遍渲染
  viz.update = function () {
    if (!graph) {
      return
    }
    const layers = container
      .selectAll('g.layer')
      .data(['relationships', 'nodes'])
    layers
      .enter()
      .append('g')
      .attr('class', d => `layer ${d}`)

    layers.classed('ctrlClick' , graph.isCtrlClick)
    const nodes = graph.nodes()
    const relationships = graph.relationships()

    const relationshipGroups = container
      .select('g.layer.relationships')
      .selectAll('g.relationship')
      .data(relationships, d => d.id)
      .attr('class',d=>{
        return d.className
      })

    relationshipGroups
      .enter()
      .append('g')
      .attr('class', d=>{
        return d.className
      })
      .attr('opacity',node=>{
        return node.className == 'node-relation_link' ? 0.5 : 1
       })
      .on('mousedown', onRelationshipClick)
      .on('mouseover', onRelMouseOver)
      .on('mouseout', onRelMouseOut)

    relationshipGroups.classed(
      {
        
      'selected' :
      relationship => relationship.selected,
       'relationship' : true,
       'hide' : 
       rel => rel.display == 'hide'
      }
    )

    geometry.onGraphChange(graph)
    if(graph.initConfig.rightMenu.self){
      for (var renderer of Array.from(vizRenderers.relationshipSelf)) {
        relationshipGroups.call(renderer.onGraphChange, viz)
      }

    }else{
      for (var renderer of Array.from(vizRenderers.relationship)) {
        relationshipGroups.call(renderer.onGraphChange, viz)
      }

    }

    relationshipGroups.exit().remove()
    const nodeGroups = container
      .select('g.layer.nodes')
      .selectAll('g.node')
      .data(nodes, d => d.id)
      .attr('class',node=>{
        return node.className
      })
    nodeGroups
      .enter()
      .append('g')
      .attr('class' , node => node.className)
      .call(force.drag)
      .call(clickHandler)
      .on('mouseover', onNodeMouseOver)
      .on('mouseout', onNodeMouseOut)
      .append('p')
      // .on('mouseup', onNodeMouseUp)
    // 增加选中的className
    nodeGroups.classed({'selected': node => node.selected , 'ctrlClicked' : node => {
      return node.ctrlClicked
    } ,   'hide' : node =>  node.display == 'hide' ,'node' : true})

// 渲染节点
    if(graph.initConfig.rightMenu.self){
      for (renderer of Array.from(vizRenderers.nodeSelf)) {
        nodeGroups.call(renderer.onGraphChange, viz)
      }

    }else{
      for (renderer of Array.from(vizRenderers.node)) {
        nodeGroups.call(renderer.onGraphChange, viz)
      }
    }
// 渲染菜单
    if(graph.initConfig.leftMenu.show){
      for (renderer of Array.from(menuRenderer)) {
        nodeGroups.call(renderer.onGraphChange, viz )
      }
    }
//  渲染右击菜单
    if(graph.initConfig.rightMenu.show){
      if(graph.initConfig.rightMenu.self){
        for(renderer of Array.from(rightMenu1)){
          nodeGroups.call(renderer.onGraphChange,viz )
        }
      }else{
        for(renderer of Array.from(rightMenu)){
          nodeGroups.call(renderer.onGraphChange,viz )
        }
      }
    }

    nodeGroups.exit().remove()

    if (updateViz ) {
      force.update(graph, [layoutDimension, layoutDimension])
      viz.resize()
      viz.trigger('updated')
      }
    return (updateViz = true)
  }
  viz.resize = function () {
    const size = measureSize()
    return root.attr(
      'viewBox',
      [
        0,
        (layoutDimension - size.height) / 2,
        layoutDimension,
        size.height
      ].join(' ')
    )
  }

  viz.boundingBox = () => container.node().getBBox()
  viz.force = force

  var clickHandler = vizClickHandler()
  clickHandler.on('click', onNodeClick)
  clickHandler.on('dblclick', onNodeDblClick)

  return viz
}

export default vizFn

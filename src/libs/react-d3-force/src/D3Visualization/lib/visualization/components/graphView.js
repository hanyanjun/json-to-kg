
import viz from './visualization'
import layout from './layout'

export default class graphView {
  constructor (element, measureSize, graph, style) {
    this.graph = graph
    this.style = style
    // 这部分可以用来做布局切换的逻辑
    const forceLayout = layout.force()
    this.viz = viz(element, measureSize, this.graph, forceLayout, this.style)
    this.callbacks = {}
    const { callbacks } = this
    this.viz.trigger = (() => (event, ...args) =>
      Array.from(callbacks[event] || []).map(callback =>
        callback.apply(null, args)
      ))()
  }

  on (event, callback) {
    ;(this.callbacks[event] != null
      ? this.callbacks[event]
      : (this.callbacks[event] = [])
    ).push(callback)
    return this
  }

  layout (value) {
    if (!arguments.length) {
      return this.layout
    }
    this.layout = value
    return this
  }

  grass (value) {
    if (!arguments.length) {
      return this.style.toSheet()
    }
    this.style.importGrass(value)
    return this
  }

  update () {
    this.viz.update()
    return this
  }

  resize () {
    this.viz.resize()
    return this
  }

  boundingBox () {
    return this.viz.boundingBox()
  }

  collectStats () {
    return this.viz.collectStats()
  }

  zoomIn (elem) {
    return this.viz.zoomInClick(elem)
  }

  zoomOut (elem) {
    return this.viz.zoomOutClick(elem)
  }
}

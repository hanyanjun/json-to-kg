
import d3 from 'd3'

const measureUsingCanvas = function (text, font) {
  const canvasSelection = d3.select('canvas#textMeasurementCanvas').data([this])
  canvasSelection
    .enter()
    .append('canvas')
    .attr('id', 'textMeasurementCanvas')
    .style('display', 'none')

  const canvas = canvasSelection.node()
  const context = canvas.getContext('2d')
  context.font = font
  return context.measureText(text).width
}

const cache = function () {
  const cacheSize = 10000
  const map = {}
  const list = []
  return (key, calc) => {
    const cached = map[key]
    if (cached) {
      return cached
    } else {
      const result = calc()
      if (list.length > cacheSize) {
        delete map[list.splice(0, 1)]
        list.push(key)
      }
      return (map[key] = result)
    }
  }
}

export default function (text, fontFamily, fontSize) {
  const font = `normal normal normal ${fontSize}px/normal ${fontFamily}`
  return cache()(text + font, () => measureUsingCanvas(text, font))
}

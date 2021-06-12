
import { prepareForExport } from './svgUtils'
import FileSaver from 'file-saver'

export const downloadPNGFromSVG = (svg, graph, type) => {
  const svgObj = prepareForExport(svg, graph, type)
  const svgData = htmlCharacterRefToNumericalRef(svgObj.node())

  let canvas
  canvas = document.createElement('canvas')
  canvas.width = svgObj.attr('width')
  canvas.height = svgObj.attr('height')

  window.canvg(canvas, svgData)
  return downloadWithDataURI(type + '.png', canvas.toDataURL('image/png'))
}

export const downloadSVG = (svg, graph, type) => {
  const svgObj = prepareForExport(svg, graph, type)
  const svgData = htmlCharacterRefToNumericalRef(svgObj.node())

  return download(type + '.svg', 'image/svg+xml;charset=utf-8', svgData)
}

const htmlCharacterRefToNumericalRef = node =>
  new window.XMLSerializer()
    .serializeToString(node)
    .replace(/&nbsp;/g, '&#160;')

const download = (filename, mime, data) => {
  const blob = new Blob([data], { type: mime })
  return FileSaver.saveAs(blob, filename)
}

const downloadWithDataURI = (filename, dataURI) => {
  var byteString, i, ia, j, mimeString, ref
  byteString = null
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = window.atob(dataURI.split(',')[1])
  } else {
    byteString = unescape(dataURI.split(',')[1])
  }
  mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  ia = new Uint8Array(byteString.length)
  for (
    i = j = 0, ref = byteString.length;
    ref >= 0 ? j <= ref : j >= ref;
    i = ref >= 0 ? ++j : --j
  ) {
    ia[i] = byteString.charCodeAt(i)
  }
  return download(filename, mimeString, ia)
}

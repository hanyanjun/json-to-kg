
import PairwiseArcsRelationshipRouting from '../utils/pairwiseArcsRelationshipRouting'
import measureText from '../utils/textMeasurement'

export default class NeoD3Geometry {
  constructor (style) {
    this.style = style
    this.relationshipRouting = new PairwiseArcsRelationshipRouting(this.style)
  }
  formatNodeCaptions (nodes) {
    return Array.from(nodes).map(
      node => node.caption = fitCaptionIntoCircle(node, this.style)
    )
  }

  formatRelationshipCaptions (relationships) {
    return (() => {
      const result = []
      for (let relationship of Array.from(relationships)) {
        const template = this.style.forRelationship(relationship).get('caption')
        result.push(
          (relationship.caption = this.style.interpolate(
            template,
            relationship
          ))
        )
      }
      return result
    })()
  }

  setNodeRadii (nodes) {
    return Array.from(nodes).map(
      node =>
        (node.radius = parseFloat(this.style.forNode(node).get('diameter')) / 2)
    )
  }

  onGraphChange (graph) {
    this.setNodeRadii(graph.nodes())
    this.formatNodeCaptions(graph.nodes())
    this.formatRelationshipCaptions(graph.relationships())
    return this.relationshipRouting.measureRelationshipCaptions(
      graph.relationships()
    )
  }

  onTick (graph) {
    return this.relationshipRouting.layoutRelationships(graph)
  }
}

let square = distance => distance * distance
let addShortenedNextWord = (line, word, measure) => {
  const result = []
  while (!(word.length <= 2)) {
    word = word.substr(0, word.length - 2) + '\u2026'
    if (measure(word) < line.remainingWidth) {
      line.text += ` ${word}`
      break
    } else {
      result.push(undefined)
    }
  }
  return result
}
let noEmptyLines = function (lines) {
  for (let line of Array.from(lines)) {
    if (line.text.length === 0) {
      return false
    }
  }
  return true
}

let fitCaptionIntoCircle = function (node, style) {
  const template = style.forNode(node).get('caption')
  // 获取显示的文字信息
  let captionText = style.interpolate(template, node)
  const fontFamily = 'sans-serif'
  const fontSize = parseFloat(style.forNode(node).get('font-size'))
  const lineHeight = fontSize
  const measure = text => measureText(text, fontFamily, fontSize)

  const words = captionText.split(' ')

  const emptyLine = function (lineCount, iLine) {
    let baseline = (1 + iLine - lineCount / 2) * lineHeight
    if (style.forNode(node).get('icon-code')) {
      baseline = baseline + node.radius / 3
    }
    const containingHeight =
      iLine < lineCount / 2 ? baseline - lineHeight : baseline
    const lineWidth =
      Math.sqrt(square(node.radius) - square(containingHeight)) * 2
    return {
      node,
      text: '',
      baseline,
      remainingWidth: lineWidth
    }
  }

  const fitOnFixedNumberOfLines = function (lineCount) {
    const lines = []
    let iWord = 0
    for (
      let iLine = 0, end = lineCount - 1, asc = end >= 0;
      asc ? iLine <= end : iLine >= end;
      asc ? iLine++ : iLine--
    ) {
      const line = emptyLine(lineCount, iLine)
      while (
        iWord < words.length &&
        measure(` ${words[iWord]}`) < line.remainingWidth
      ) {
        line.text += ` ${words[iWord]}`
        line.remainingWidth -= measure(` ${words[iWord]}`)
        iWord++
      }
      lines.push(line)
    }
    if (iWord < words.length) {
      addShortenedNextWord(lines[lineCount - 1], words[iWord], measure)
    }
    return [lines, iWord]
  }

  let consumedWords = 0
  const maxLines = (node.radius * 2) / fontSize

  let lines = [emptyLine(1, 0)]
  for (
    let lineCount = 1, end = maxLines, asc = end >= 1;
    asc ? lineCount <= end : lineCount >= end;
    asc ? lineCount++ : lineCount--
  ) {
    const [candidateLines, candidateWords] = Array.from(
      fitOnFixedNumberOfLines(lineCount)
    )
    if (noEmptyLines(candidateLines)) {
      ;[lines, consumedWords] = Array.from([candidateLines, candidateWords])
    }
    if (consumedWords >= words.length) {
      return lines
    }
  }
  return lines
}

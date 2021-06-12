
/* global DOMParser */

import d3 from 'd3'


d3.selection.enter.prototype.appendSVG = function (SVGString) {
  return this.select(function () {
    return this.appendChild(
      document.importNode(
        new DOMParser().parseFromString(SVGString, 'application/xml')
          .documentElement.firstChild,
        true
      )
    )
  })
}


import d3 from 'd3'
export default function clickHandler () {
  const cc = function (selection) {
    // euclidean distance
    const dist = (a, b) =>
      Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2))
    let down
    const tolerance = 5
    let wait = null
    selection.on('mousedown', function () {
      d3.event.target.__data__.fixed = true
      down = d3.mouse(document.body)
      return d3.event.stopPropagation()
    })

    return selection.on('mouseup', function () {
      if (dist(down, d3.mouse(document.body)) > tolerance) {
      } else {
        if (wait) {
          window.clearTimeout(wait)
          wait = null
          return event.dblclick(d3.event.target.__data__)
        } else {
          event.click(d3.event.target.__data__)
          return (wait = window.setTimeout(
            (e => () => (wait = null))(d3.event),
            250
          ))
        }
      }
    })
  }

  var event = d3.dispatch('click', 'dblclick')
  return d3.rebind(cc, event, 'on')
}

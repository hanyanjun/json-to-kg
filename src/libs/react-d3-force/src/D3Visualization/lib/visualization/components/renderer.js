
export default class Renderer {
  onGraphChange = null
  onTick = null
  constructor (opts) {
    if (opts == null) {
      opts = {}
    }
    Object.assign(this, opts)
    if (this.onGraphChange === null) {
      this.onGraphChange = function () {}
    }
    if (this.onTick === null) {
      this.onTick = function () {}
    }
  }
}

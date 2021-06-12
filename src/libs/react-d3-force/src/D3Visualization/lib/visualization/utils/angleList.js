

export default class AngleList {
  constructor (list) {
    this.list = list
  }

  getAngle (index) {
    return this.list[index].angle
  }

  fixed (index) {
    return this.list[index].fixed
  }

  totalLength () {
    return this.list.length
  }

  length (run) {
    if (run.start < run.end) {
      return run.end - run.start
    } else {
      return run.end + this.list.length - run.start
    }
  }

  angle (run) {
    if (run.start < run.end) {
      return this.list[run.end].angle - this.list[run.start].angle
    } else {
      return 360 - (this.list[run.start].angle - this.list[run.end].angle)
    }
  }

  wrapIndex (index) {
    if (index === -1) {
      return this.list.length - 1
    } else if (index >= this.list.length) {
      return index - this.list.length
    } else {
      return index
    }
  }
}

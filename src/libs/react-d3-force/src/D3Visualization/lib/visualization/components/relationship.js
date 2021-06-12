export default class Relationship {
  isNode = false
  isRelationship = true
  constructor (id, source, target, type, properties , className) {
    this.id = id
    this.source = source
    this.target = target
    this.type = type
    this.display = 'unvalue';
    this.className = className
    this.propertyMap = properties
    this.propertyList = (() => {
      const result = []
      for (let key of Object.keys(this.propertyMap || {})) {
        const value = this.propertyMap[key]
        result.push({ key, value })
      }
      return result
    })()
  }

  toJSON () {
    return this.propertyMap
  }
  isLoop () {
    return this.source === this.target
  }
}

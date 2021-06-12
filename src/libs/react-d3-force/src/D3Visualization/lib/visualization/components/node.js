export default class Node {
  isNode = true
  isRelationship = false

  constructor (id, labels, properties,className ) {
    this.id = id
    this.labels = [properties.label_for_match];
    // this.labels = labels;
    // console.log(labels);
    this.labelsAll = labels;
    this.className = className
    this.display = 'unvalue';
    this.isFilter = false;
    this.propertyMap = properties
    this.propertyList = (() => {
      const result = []
      for (let key of Object.keys(properties || {})) {
        const value = properties[key]
        result.push({ key, value })
      }
      return result
    })()
  }

  toJSON () {
    return this.propertyMap
  }
  gainMaxLabel(labels){
    if(labels.length == 1) return labels;
    let arr = ["changed" ,"added"  ,"deleted"  ,"Notupdated"  ,"cryptoRelated"  ,"UncryptoRelated","Tech"];
    for(let i = 0 ; i < labels.length ; i ++){
      if(labels[i] == 'Capital'){
        return ['Capital'];
      }
      if(labels[i] == 'School'){
        return ['School'];
      }
      if(labels[i] == 'Project'){
        return ['Project'];
      }
      if(labels[i] == 'Person'){
        return ['Person'];
      }
      if(arr.indexOf(labels[i]) != -1){
        return [labels[i]]
      }
    }
  }

  relationshipCount (graph) {
    const node = this
    const rels = []
    for (let relationship of Array.from(graph.relationships())) {
      if (relationship.source === node || relationship.target === node) {
        rels.push(relationship)
      }
    }
    return rels.length
  }
}

import { relationship } from "../renders/init";

export default class Graph {
  constructor (config) {
    this.addNodes = this.addNodes.bind(this)
    this.removeNode = this.removeNode.bind(this)
    this.updateNode = this.updateNode.bind(this)
    this.removeConnectedRelationships = this.removeConnectedRelationships.bind(
      this
    )
    this.initConfig = config;
    this.resetGraph = this.resetGraph.bind(this);
    this.addRelationships = this.addRelationships.bind(this)
    this.addInternalRelationships = this.addInternalRelationships.bind(this)
    this.pruneInternalRelationships = this.pruneInternalRelationships.bind(this)
    this.findNode = this.findNode.bind(this)
    this.findNodeNeighbourIds = this.findNodeNeighbourIds.bind(this)
    this.findRelationship = this.findRelationship.bind(this)
    this.findAllRelationshipToNode = this.findAllRelationshipToNode.bind(this)
    this.nodeMap = {}
    this.nodeLabelsMap = {};
    this.relLabelsMap = {};
    this.expandedNodeMap = {}
    this._nodes = []
    this.relationshipMap = {}
    this._relationships = []
    this.filterNodeByLabelMap = {}
    this.filterRelByLabelMap = {}
    this.isCtrlClick = false
  }

  nodes () {
    return this._nodes
  }

  relationships () {
    return this._relationships
  }

  groupedRelationships () {
    const groups = {}
    for (let relationship of Array.from(this._relationships)) {
      let nodePair = new NodePair(relationship.source, relationship.target)
      nodePair = groups[nodePair] != null ? groups[nodePair] : nodePair
      nodePair.relationships.push(relationship)
      groups[nodePair] = nodePair
    }
    return (() => {
      const result = []
      for (let ignored in groups) {
        const pair = groups[ignored]
        result.push(pair)
      }
      return result
    })()
  }

  addNodes (nodes) {
    for (let node of Array.from(nodes)) {
      if (this.findNode(node.id) == null) {
        this.nodeMap[node.id] = node
        this._nodes = Object.values(this.nodeMap)
      }
      this.addNodesLabelsMap(node);
      
    }
    return this
  }
  addNodesLabelsMap(node){
    if(node.labels.length > 0){
       node.labels.map(v=>{
          if(!this.nodeLabelsMap[v]){
            this.nodeLabelsMap[v] = [];
          }
          // 增加的新的节点 如果label 为过滤则不显示
          if(this.filterNodeByLabelMap[v]){
            node.display = 'hide'
          }
          this.nodeLabelsMap[v].push(node.id);
          this.nodeLabelsMap[v] = [... new Set (this.nodeLabelsMap[v])];
       })
    }
    return this;
  }
  addExpandedNodes = (node, nodes) => {
    for (let eNode of Array.from(nodes)) {
      if (this.findNode(eNode.id) == null) {
        this.nodeMap[eNode.id] = eNode
        this._nodes.push(eNode)
        this.expandedNodeMap[node.id] = this.expandedNodeMap[node.id]
          ? this.expandedNodeMap[node.id].concat([eNode.id])
          : [eNode.id]
      }
      this.addNodesLabelsMap(eNode);
    }
  }

  removeNode (node) {
    if (this.findNode(node.id) != null) {
      delete this.nodeMap[node.id]
      this._nodes.splice(this._nodes.indexOf(node), 1)
    }
    return this
  }
  removeNodes (nodes,ids){
    if(ids){
      ids.map(v=>{
        if(this.nodeMap[v]){
          this.removeConnectedRelationships(this.nodeMap[v]);
          this.removeNode(this.nodeMap[v]);
        }
      })
    }else{
      nodes.map(v=>{
        this.removeNode(v);
      })
    }
  }
  removeNodeByLabels(labels){
    let arr = [];
    labels.forEach(v=>{
      arr = arr.concat(this.nodeLabelsMap[v]);
      delete this.nodeLabelsMap[v];
    })
    this.removeNodes(null,[...new Set(arr)]);
  }
  removeRelByLabels(labels){
    let arr = [];
    labels.forEach(v=>{
      arr = arr.concat(this.relLabelsMap[v]);
      delete this.relLabelsMap[v];
    })
    this.removeRels(null,[...new Set(arr)]);
  }
  removeRels(rels,ids){
    if(ids){
      ids.map(v=>{
        if(this.relationshipMap[v]){
          this.removeRel(this.relationshipMap[v]);
        }
      })
    }
  }
  toggleNodeBylabels(labels){
    let nodes  = Object.values(this.nodeMap);
    labels.forEach(v1=>{
      if(!this.isPro(this.filterNodeByLabelMap,v1)){
        this.filterNodeByLabelMap[v1] = true;
      }else{
        this.filterNodeByLabelMap[v1] = !this.filterNodeByLabelMap;
      }
      nodes.forEach(v=>{
        let init = v.display;
            if(v.labels.indexOf(v1) != -1){
              v.display = this.changeDisplay(init);
            }
        this.nodeMap[v.id] = v;
      })
    })
    this._nodes = Object.values(nodes)
    return this
  }
  checkNodeExtendRelToggle(){
    let rels = Object.values(this.relationshipMap);
    rels.forEach(r=>{
      if(r.target.display == 'hide' || r.source.display == 'hide' || this.filterRelByLabelMap[r.type]){
        r.display = 'hide';
      }else {
         if(!this.filterRelByLabelMap[r.type]){
             r.display = 'show';
         }
      }
      this.relationshipMap[r.id]  = r
      this._relationships.splice(this._relationships.indexOf(r),1,r);
    })
  }
  isPro(obj,key){
    return obj.hasOwnProperty(key);
  }
  changeDisplay(value){
    if(value == 'unvalue'){
      return 'hide';
    }
    if(value == 'show'){
      return 'hide'
    }
    if(value = 'hide'){
      return 'show'
    }
  }
  toggleRelByLabels(labels){
    let rels = Object.values(this.relationshipMap);
    labels.forEach(v1=>{
      if(!this.isPro(this.filterRelByLabelMap,v1)){
        this.filterRelByLabelMap[v1] = true;
      }else{
        this.filterRelByLabelMap[v1] = !this.filterRelByLabelMap[v1];
      }
      rels.forEach(v=>{
            let init = this.changeDisplay(v.display);
            if(v.type == v1){
              v.display = init;
              this.relationshipMap[v.id] = v;
              this._relationships.splice(this._relationships.indexOf(v),1,v);
            }
      })
    })
  }
  removeRel(rel){
    if( rel && this.relationshipMap[rel.id] ){
      delete this.relationshipMap[rel.id];
      this._relationships.splice(this._relationships.indexOf(rel), 1);
    }
    return this
  }
  collapseNode = node => {
    if (!this.expandedNodeMap[node.id]) {
      return
    }
    this.expandedNodeMap[node.id].forEach(id => {
      const eNode = this.nodeMap[id]
      this.collapseNode(eNode)
      this.removeConnectedRelationships(eNode)
      this.removeNode(eNode)
    })
    this.expandedNodeMap[node.id] = []
  }

  updateNode (node) {
    if (this.findNode(node.id) != null) {
      this.removeNode(node)
      node.expanded = false
      node.minified = true
      this.addNodes([node])
    }
    return this
  }
  updateNodeProps(node){
    if (this.findNode(node.id) != null) {
      this.nodeMap[node.id] = Object.assign(this.nodeMap[node.id] , node)
      this._nodes.splice(this._nodes.indexOf(node), this.nodeMap[node.id])
    }
    return this
  }
  updateRelProps(relationship){
    if(this.relationshipMap[relationship.id] != null){
      this.relationshipMap[relationship.id] = Object.assign(this.relationshipMap[relationship.id] , relationship)
      this._relationships.splice(this._relationships.indexOf(relationship), 1 , this.relationshipMap[relationship.id])
    }
    return this
  }
  updateNodes (nodes){
    for (let node of Array.from(nodes)) {
      this.nodeMap[node.id]  = node
      this._nodes = Object.values(this.nodeMap);
    }
    return this
  }
  updateRelationships(relations){
    for (let r of Array.from(relations)) {
      this.relationshipMap[r.id]  = r
      this._relationships = Object.values(this.relationshipMap);
    }
    return this

  }

  removeConnectedRelationships (node) {
    for (let r of Array.from(this.findAllRelationshipToNode(node))) {
      this.updateNode(r.source)
      this.updateNode(r.target)
      this._relationships.splice(this._relationships.indexOf(r), 1)
      delete this.relationshipMap[r.id]
    }
    return this
  }
  removeConnectedRelationshipss(nodes){
    nodes.map(v=>{
      this.removeConnectedRelationships(v)
    })
  }
  gainRelByNode(arr){
    let nodes  = [] , relationships = [];
    let nMap = {};
    arr.forEach(v=>{
      nMap[v] = true;
    })
    arr.forEach(v=>{
      if(this.findNode(v)){
        nodes.push(this.findNode(v))
      }
    })
    this._relationships.forEach(v=>{
      if(nMap[v.source.id] && nMap[v.target.id]){
        relationships.push(v);
      }
    })
    return {nodes,relationships}
  }

  addRelationships (relationships) {
    for (let relationship of Array.from(relationships)) {
      const existingRelationship = this.findRelationship(relationship.id)
      this.addRelLabelsMap(relationship);
      if (existingRelationship != null) {
        existingRelationship.internal = false
      } else {
        relationship.internal = false
        this.relationshipMap[relationship.id] = relationship
        this._relationships.push(relationship)
      }
    }
    return this
  }
  addRelLabelsMap(rel){
    if(rel.type){
      if(!this.relLabelsMap[rel.type]){
        this.relLabelsMap[rel.type] = [];
      }
      if(this.filterRelByLabelMap[rel.type]){
        rel.display = 'hide';
      }else{
        rel.display = 'show';
      }
      this.relLabelsMap[rel.type].push(rel.id);
      this.relLabelsMap[rel.type] = [... new Set (this.relLabelsMap[rel.type])];
    }
    return this;
  }

  addInternalRelationships (relationships) {
    for (let relationship of Array.from(relationships)) {
      relationship.internal = true
      if (this.findRelationship(relationship.id) == null) {
        this.relationshipMap[relationship.id] = relationship
        this._relationships.push(relationship)
      }
    }
    return this
  }

  pruneInternalRelationships () {
    const relationships = this._relationships.filter(
      relationship => !relationship.internal
    )
    this.relationshipMap = {}
    this._relationships = []
    return this.addRelationships(relationships)
  }

  findNode (id) {
    return this.nodeMap[id]
  }

  findNodeNeighbourIds (id) {
    return this._relationships
      .filter(
        relationship =>
          relationship.source.id === id || relationship.target.id === id
      )
      .map(function (relationship) {
        if (relationship.target.id === id) {
          return relationship.source.id
        }
        return relationship.target.id
      })
  }

  findRelationship (id) {
    return this.relationshipMap[id]
  }

  findAllRelationshipToNode (node) {
    return this._relationships.filter(
      relationship =>
        relationship.source.id === node.id || relationship.target.id === node.id
    )
  }

  resetGraph () {
    this.nodeMap = {}
    this._nodes = []
    this.relationshipMap = {}
    this.filterRelByLabelMap = {}
    this.filterNodeByLabelMap = {}
    this.nodeLabelsMap = {}
    this.relLabelsMap = {}
    this.isCtrlClick = false
    return (this._relationships = [])
  }
  initSeleced(){
    this.isCtrlClick = false
  }
}

class NodePair {
  constructor (node1, node2) {
    this.relationships = []
    if (node1.id < node2.id) {
      this.nodeA = node1
      this.nodeB = node2
    } else {
      this.nodeA = node2
      this.nodeB = node1
    }
  }

  isLoop () {
    return this.nodeA === this.nodeB
  }

  toString () {
    return `${this.nodeA.id}:${this.nodeB.id}`
  }
}

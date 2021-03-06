import React, { Component } from 'react'
import { createGraph, mapRelationships, getGraphStats ,mapNodes } from '../mapper'
import { GraphEventHandler } from '../GraphEventHandler'
import '../lib/visualization/index'
import deepmerge from 'deepmerge'
import { downloadPNGFromSVG,gainPngBase64} from "../../shared/exporting/imageUtils";
import d3 from "d3";

import neoGraphStyle from '../graphStyle'

import { dim } from './browser-styles'
import { StyledZoomHolder, StyledSvgWrapper, StyledZoomButton } from './styled'
// import { ZoomInIcon, ZoomOutIcon } from 'browser-components/icons/Icons'
import graphView from '../lib/visualization/components/graphView'

let svgElement = null;
const deduplicateNodes = nodes => {
  return nodes.reduce(
    (all, curr) => {
      if (all.taken.indexOf(curr.id) > -1) {
        return all
      } else {
        all.nodes.push(curr)
        all.taken.push(curr.id)
        return all
      }
    },
    { nodes: [], taken: [] }
  ).nodes
}
export class GraphComponent extends Component {
  constructor(props){
    super(props);
    const graphStyle = neoGraphStyle();
    this.defaultStyle = graphStyle.toSheet()
    if (this.props.graphStyleData) {
      const rebasedStyle = deepmerge(
        this.defaultStyle,
        this.props.graphStyleData
      )
      graphStyle.loadRules(rebasedStyle)
    }
    this.state = {
      initGraph : props.initGraphs,
      stats: { labels: {}, relTypes: {} },
      graphStyle,
      zoomInLimitReached: true,
      zoomOutLimitReached: false,
      shouldResize: false,
      nodes : [],
      relationships : [],
      graphEH : {},
      graphView : {},
      graph : {},
      svgElement : ""
    }
    this.onGraphModelChange = this.onGraphModelChange.bind(this);
  }
  componentDidMount(){
    //   console.log(this.props);
  }


  exportPNG () {
    const graphElement  = this.state.graphView;
    const type = 'graph';
    console.log(svgElement,graphElement,type)
    downloadPNGFromSVG(svgElement, graphElement, type)
  }
  gainPngBase64(){
    const graphElement  = this.state.graphView;
    const type = 'graph';
    return gainPngBase64(svgElement, graphElement, type)
  }
  graphInit (el) {
    // ??????svg???
    this.svgElement = el;
    svgElement = el;
  }
  // ?????????????????????????????? ??? ??????
  retainNodesRel(info){
    let {nodeMap, relMap} = info;
    let {graph , graphView} = this.state;
    let nodeMap1 = graph.nodeMap;
    let relMap1 = graph.relationshipMap;
    if(Object.keys(nodeMap).length == 0 && Object.keys(relMap).length == 0 ){
      graph.resetGraph();
      graphView.update();
      return;
    }
    let nodes = graph._nodes.map(v=>{
      return v.id
    });
    let rel = graph._relationships.map(v=>{
      return v.id
    });
    nodes.map(id=>{
      if(!nodeMap.hasOwnProperty(id)){
        // ????????????
        this.graph.removeConnectedRelationships(nodeMap1[id])
        this.graph.removeNode(nodeMap1[id])
      }
    })
    rel.map(id=>{
      if(!relMap.hasOwnProperty(relMap1[id])){
        // ????????????
        this.graph.removeRel(relMap1[id]);
      }
    })
    graphView.update()
  }
  // ????????????
  addNodesRel(info){
    let {nodes, relationships} = info;
    let {graph , graphView} = this.state;
    graph.addNodes(mapNodes(nodes))
    graph.addRelationships(mapRelationships(relationships, graph))
    this.onGraphModelChange(getGraphStats(graph))
    graphView.update()
  }
  // ????????????
  extendNodesRel(d,info){
    let {graph , graphView} = this.state;
    let {nodes, relationships} = info;
    graph.addExpandedNodes(d, mapNodes(nodes))
    graph.addRelationships(mapRelationships(relationships, graph))
    graph.checkNodeExtendRelToggle();

    graphView.update()
    this.onGraphModelChange(getGraphStats(graph))
  }
  //?????????????????????????????? 
  gainRelByNode(arr){
    if(arr.length == 0) return {nodes : [] , relationships : []}
    let {graph , graphView} = this.state;
    return graph.gainRelByNode(arr)
  }
  // ????????????
  resetGraph(info){
    let {nodes, relationships} = info;
    let {graph , graphView , graphEH} = this.state;
    graph.resetGraph();
    graphEH.resetEH();
    graph.addNodes(mapNodes(nodes))
    graph.addRelationships(mapRelationships(relationships, graph))
    this.onGraphModelChange(getGraphStats(graph))
    graphView.update()
  }
  // ????????????
  clearSelected(){
    let {graph , graphView , graphEH} = this.state;
    graph.initSeleced();
    graphEH.resetEH();
    graphView.update()
  }
  // ????????????
  toggleByLabels(ds,type){
    let {graph,graphView} = this.state;
    if(type == 'node'){
      graph.toggleNodeBylabels(ds);
    }else{
      graph.toggleRelByLabels(ds);
    }
    // d3.selectAll('.node').attr({'class' : 'hide node'})
    // graphView.toggleUpdate()
    graph.checkNodeExtendRelToggle();
    graphView.update()
    this.onGraphModelChange(getGraphStats(graph))
  }
  // ??????????????????
  removeByLabels(ds , type){
    let {graph,graphView} = this.state;
    if(type == 'node'){
      graph.removeNodeByLabels(ds);
    }else{
      graph.removeRelByLabels(ds);
    }
    graphView.update()
    this.onGraphModelChange(getGraphStats(graph))
  }
  // ???????????? ??????
  updateNodesRel(nodes,rels){
    let {graph,graphView} = this.state;
    nodes.map(v=>{
      graph.updateNodeProps(v);
    })
    rels.map(v=>{
      graph.updateRelProps(v)
    })
    this.onGraphModelChange(getGraphStats(graph))
    graphView.update()
  }

  // ???????????????????????????
  updateOneNode(d){
    let {graph,graphView} = this.state;
    graph.updateNodeProps(d);
    graphView.update()
  }
  // ??????????????????
  removeNode(d){
    this.graph.removeConnectedRelationships(d)
    this.graph.removeNode(d)
  }
  // ????????????????????????
  updateStyleNodesRel(arr,type){
    let {graphStyle ,graphView , graph} = this.state;
    if(type == 'node' && arr.length > 0){
      arr.forEach(v=>{
        graphStyle.changeForSelector(v.selector, v.styleProp)
      })
    }
    const rebasedStyle = deepmerge(this.defaultStyle, graphStyle.toSheet())
    graphStyle.loadRules(rebasedStyle)
    this.onGraphModelChange(getGraphStats(graph))
    graphView.update()
  }
  zoomOut(){
    let {graphView} = this.state;
    let limits = graphView.zoomOut()
    return limits;
  }
  zoomIn(){
    let {graphView} = this.state;
    let limits =  graphView.zoomIn()
    return limits;
  }
  initGraph(info){
    let {nodes = {},relationships = [] , config} = info;
    let nodesDetail = deduplicateNodes(nodes)
    let selectedItem = ''
    if (nodes.length > parseInt(this.props.initialNodeDisplay)) {
      nodes = nodes.slice(0, this.props.initialNodeDisplay)
      relationships = this.props.relationships.filter(item => {
        return nodes.filter(node => node.id === item.startNodeId) > 0
      })
      selectedItem = {
        type: 'status-item',
        item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${
          this.props.initialNodeDisplay
        } of ${nodes.length} nodes are being displayed`
      }
    }
    this.initGraphView({nodes : nodesDetail  , relationships , config});
  }
  onGraphModelChange(stats){
    this.setState({ stats: stats });
    let {graph} = this.state;
    if(this.props.getStats){
      let labels = Object.keys(stats.labels);
      let {graphStyle} = this.state;
      let relTypes = Object.keys(stats.relTypes);
      let a1 = [];
      let a2 = [];
      a1 = labels.map((v,i)=>{
        let node = v != '*' && graph?.nodeLabelsMap?.[v] ? graph.nodeMap[graph.nodeLabelsMap[v][0]] : null;
        let obj = {};
        if(node && node.display == 'hide'){obj = {filter : true}}
        let obj1 = {...graphStyle.forNode({
          labels : [v]
        }) , label : v ,  ...stats.labels[v] }
         obj1.props = {...obj1.props, ...obj};
        return  obj1 })
      a2 = relTypes.map(v=>{
        let rel = v != '*' && graph?.relLabelsMap?.[v] ? graph.relationshipMap[graph.relLabelsMap[v][0]] : null;
        let obj = {};
        if(rel && rel.display == 'hide'){obj = {filter : true}}
        let obj1 = {...graphStyle.forRelationship({
          type : v
        }  ) , label : v , ...stats.relTypes[v]};
        obj1.props = {...obj1.props , ...obj}
        return obj1
      })
      this.props.getStats({labels : a1 , relTypes : a2});
    }
  }
  

  getVisualAreaHeight () {
    return this.props.frameHeight && this.props.fullscreen
      ? this.props.frameHeight -
          (dim.frameStatusbarHeight + dim.frameTitlebarHeight * 2)
      : this.props.frameHeight - dim.frameStatusbarHeight ||
          this.svgElement.parentNode.offsetHeight
  }
  getNodeNeighbours (node, currentNeighbours, callback) {
    callback(null, { nodes: [], relationships: [] })
  }
  
  initGraphView ({nodes,relationships , config}) {
    if(config == undefined){
      config = {
        rightMenu : {show : true},
        leftMenu : {show : true}
      }
    }
    if (!this.graphView) {
      let NeoConstructor = graphView
      let measureSize = () => {
        return {
          width: this.svgElement.offsetWidth,
          height: this.getVisualAreaHeight()
        }
      }
      this.graph = createGraph(nodes, relationships , config)
      this.graphView = new NeoConstructor(
        this.svgElement,
        measureSize,
        this.graph,
        this.state.graphStyle
      )
      this.graphEH = new GraphEventHandler(
        this.graph,
        this.graphView,
        this.getNodeNeighbours,
        this.props.onItemMouseOver,
        this.props.onItemSelect,
        this.onGraphModelChange,
        this.props.onEventListener
      )
      this.setState({
        graphEH : this.graphEH,
        graph : this.graph ,
        graphView : this.graphView 
      })
      this.graphEH.bindEventHandlers()
      this.onGraphModelChange(getGraphStats(this.graph))
      this.graphView.resize()
      this.graphView.update()
    }
  }

  render () {
    return (
      <StyledSvgWrapper theme={{name : 'normal'}}>
        {/* ?????????????????????????????? */}
        <svg className='neod3viz'   ref={this.graphInit.bind(this)} />
      </StyledSvgWrapper>
    )
  }
}



export default GraphComponent;
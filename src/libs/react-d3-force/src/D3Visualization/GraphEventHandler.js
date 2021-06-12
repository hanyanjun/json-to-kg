import d3 from "d3"
import { mapNodes, mapRelationships, getGraphStats } from './mapper'

export class GraphEventHandler {
  constructor (
    graph,
    graphView,
    getNodeNeighbours,
    onItemMouseOver,
    onItemSelected,
    onGraphModelChange,
    onEventListener
  ) {
    this.graph = graph
    this.graphView = graphView
    this.getNodeNeighbours = getNodeNeighbours
    this.selectedItem = null
    this.rightClickedItem = null;
    this.onItemMouseOver = onItemMouseOver
    this.onItemSelected = onItemSelected
    this.onEventListener = onEventListener
    this.onGraphModelChange = onGraphModelChange
    this.ctrlClickedArr = [];
    this.rightClickedMap = {};
  }

  graphModelChanged () {
    this.onGraphModelChange(getGraphStats(this.graph))
  }
  resetEH (){
    this.ctrlClickedArr = [];
    this.rightClickedMap = {};
    this.selectedItem = null
    this.rightClickedItem = null;
  }

  selectItem (item) {
    if (this.selectedItem) {
      this.selectedItem.selected = false
    }
    this.selectedItem = item
    item.selected = true
    this.graphView.update()
  }

  deselectItem () {
    let isUpdate =  this.selectedItem || this.rightClickedItem;
    if (this.selectedItem) {
      this.selectedItem.selected = false
      this.selectedItem = null
    }
    if(this.rightClickedItem){
      this.rightClickedItem.rightClicked = false
      this.rightClickedItem = null
    }
    this.onItemSelected({
      type: 'canvas',
      item: {
        nodeCount: this.graph.nodes().length,
        relationshipCount: this.graph.relationships().length
      }
    })
    if(isUpdate){
      this.graphView.update();
    }
  }
  clearSelected(){
    if (this.selectedItem) {
      this.selectedItem.selected = false
      this.selectedItem = null
    }
    this.graphView.update();
  }
  clearRightSelected(){
    if(this.rightClickedItem){
      this.rightClickedItem.rightClicked = false
      this.rightClickedItem = null
    }
    this.graphView.update();
  }

  nodeClose (d) {
    this.graph.removeConnectedRelationships(d)
    this.graph.removeNode(d)
    this.deselectItem()
    this.graphView.update()
    this.graphModelChanged()
  }

  nodeClicked (d) {
      if (!d) {
        return
      }
      if(d.rightClicked){
        d.rightClicked = false
      }
      d.fixed = true
      if (!d.selected) {
        this.selectItem(d)
        this.onItemSelected({
          type: 'node',
          item: { id: d.id, labels: d.labels, properties: d.propertyList , layerX : d.px , layerY : d.py}
        })
      } else {
        this.deselectItem()
      }
      
      this.onEventListener({
        type : 'nodeClicked',
        item : d
      })
  }
  onNodeCtrlClick(d){
    if(!d) return;
    if(!d.ctrlClicked){
      d.ctrlClicked = true;
      this.ctrlClickedArr.push(d.id)
    }else{
      d.ctrlClicked = false;
      this.ctrlClickedArr = this.ctrlClickedArr.filter(v=>v.id != d.id)
    }
    this.onEventListener({
      type : 'nodeCtrlClicked',
      item : d
    })
    this.clearSelected();
    this.clearRightSelected();
    // this.graphView.update()
  }
  onNodeClickRight(d){
    if(!d) return;
    if(d.selected){
      d.selected = false;
    }
    if(this.rightClickedItem && this.rightClickedItem.rightClicked){
      this.rightClickedItem.rightClicked = false;
    }
    this.rightClickedItem = d;
    if(!d.rightClicked){
      d.rightClicked = true;
      this.rightClickedMap[d.id] = d;
    }else{
      d.rightClicked = false;
    }
    
    this.onEventListener({
      type : 'nodeRightClicked',
      item : d
    })
    this.clearSelected();
  }

  nodeUnlock (d) {
    if (!d) {
      return
    }
    d.fixed = false
    this.deselectItem()
  }
  nodeDelete (d){
    this.onEventListener({
      type : 'nodeDelete',
      item : d
    })
  }
  nodeNew (d){
    this.onEventListener({
      type : 'nodeNew',
      item : d
    })
  }
  nodeEdit (d){
    // message.success('修改节点,功能开发中!');
    this.onEventListener({
      type : 'nodeEdit',
      item : d
    })
  }

  nodeDblClicked (d) {
    if (d.expanded) {
      this.nodeCollapse(d)
      d.expanded = false;
    }else{
      d.expanded = true;
    }
    this.onEventListener({
      type : 'nodeDbClicked',
      item : d
    })
  }

  nodeCollapse (d) {
    d.expanded = false
    this.graph.collapseNode(d)
    this.graphView.update()
    this.graphModelChanged()
  }

  onNodeMouseOver (node) {
    if (!node.contextMenu) {
      this.onItemMouseOver({
        type: 'node',
        item: {
          id: node.id,
          labels: node.labels,
          properties: node.propertyList
        }
      })
    }
    // 增加节点的hover事件
    if (this.hoveredItem) {
      this.hoveredItem.hovered = false
    }
    
    this.onEventListener({
      type : 'nodeMouseOver',
      item : node
    })
    this.hoveredItem = node
    node.hovered = true
    // this.graphView.update();
  }
  onMenuMouseOver (itemWithMenu) {
    this.onItemMouseOver({
      type: 'context-menu-item',
      item: {
        label: itemWithMenu.contextMenu.label,
        content: itemWithMenu.contextMenu.menuContent,
        selection: itemWithMenu.contextMenu.menuSelection
      }
    })
    this.onEventListener({
      type : 'menuMouseOver',
      item : itemWithMenu
    })

  }
  onRelationshipMouseOver (relationship) {
    this.onItemMouseOver({
      type: 'relationship',
      item: {
        id: relationship.id,
        type: relationship.type,
        properties: relationship.propertyList
      }
    })
    this.onEventListener({
      type : 'relationshipMouseOver',
      item : relationship
    })
  }

  onRelationshipClicked (relationship) {
    if (!relationship.selected) {
      this.selectItem(relationship)
      this.onItemSelected({
        type: 'relationship',
        item: {
          id: relationship.id,
          type: relationship.type,
          properties: relationship.propertyList
        }
      })
    } else {
      this.deselectItem()
    }
    this.onEventListener({
      type : 'relationshipClicked',
      item : relationship
    })
  }

  onCanvasClicked () {
    // update 函数 放在 onEventListener 上方 会导致 页面svg节点抖动 位置重新计算
    this.onEventListener({
      type : 'canvasClicked',
      item : null
    })
    
    this.deselectItem()
  }

  onItemMouseOut (item) {
    this.onItemMouseOver({
      type: 'canvas',
      item: {
        nodeCount: this.graph.nodes().length,
        relationshipCount: this.graph.relationships().length
      }
    })
    this.onEventListener({
      type : 'canvasMouseOver',
      item 
    })
  }
// 反选
  onContrarySelected(item){
    this.onEventListener({
      type : 'contrarySelected',
      item
    })
    this.deselectItem()
  }
  //清除选择 
  onClearSelected(item){
    this.onEventListener({
      type : 'clearSelected',
      item
    })
    this.deselectItem()
  }
  // 撤回到上一种状态
  onBackStatus(item){
    this.onEventListener({
      type : 'backStatus',
      item
    })
    this.deselectItem()
  }
  // 回到初始状态
  onInitStatus(item){
    this.onEventListener({
      type : 'initStatus',
      item
    })
  }
  // 播放过度动画
  onStartFrame(item){
    console.log(this.graph)
    this.graph.resetGraph()
    this.graphView.update()
    this.onEventListener({
      type : 'startFrame',
      item : this.ctrlClickedArr
    })
  }
  // 生成图
  onMadeChart(item){
    this.onEventListener({
      type : 'madeChart',
      item : this.ctrlClickedArr
    })
    this.deselectItem()
  }
  // 新增边
  onAddRel(item){
    this.onEventListener({
      type : 'addRel',
      item 
    })
    this.deselectItem()
  }

  bindEventHandlers () {
    this.graphView
      .on('nodeMouseOver', this.onNodeMouseOver.bind(this))
      .on('nodeMouseOut', this.onItemMouseOut.bind(this))
      .on('menuMouseOver', this.onMenuMouseOver.bind(this))
      .on('menuMouseOut', this.onItemMouseOut.bind(this))
      .on('relMouseOver', this.onRelationshipMouseOver.bind(this))
      .on('relMouseOut', this.onItemMouseOut.bind(this))
      .on('relationshipClicked', this.onRelationshipClicked.bind(this))
      .on('canvasClicked', this.onCanvasClicked.bind(this))
      .on('nodeClose', this.nodeClose.bind(this))
      .on('nodeClicked', this.nodeClicked.bind(this))
      .on('nodeDblClicked', this.nodeDblClicked.bind(this))
      .on('nodeUnlock', this.nodeUnlock.bind(this))
      .on('nodeDelete', this.nodeDelete.bind(this))
      .on('nodeNew', this.nodeNew.bind(this))
      .on('nodeEdit', this.nodeEdit.bind(this))
      .on('nodeCtrlClick', this.onNodeCtrlClick.bind(this))
      .on('nodeClickRight', this.onNodeClickRight.bind(this))
      .on('contrarySelected', this.onContrarySelected.bind(this))
      .on('clearSelected', this.onClearSelected.bind(this))
      .on('backStatus', this.onBackStatus.bind(this))
      .on('initStatus', this.onInitStatus.bind(this))
      .on('startFrame', this.onStartFrame.bind(this))
      .on('madeChart',this.onMadeChart.bind(this))
      .on('addRel',this.onAddRel.bind(this))
    this.onItemMouseOut()
  }
}

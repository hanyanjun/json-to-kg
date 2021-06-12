
import React, { Component } from 'react'
import { StyledRowToggle, StyledCaret } from './styled'

const getHeightFromElem = rowElem =>
  rowElem && rowElem ? rowElem.clientHeight : 0

export class RowExpandToggleComponent extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  updateDimensions = () => {
    this.setState({ rowHeight: getHeightFromElem(this.props.rowElem) })
  }

  componentDidMount () {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions)
  }

  componentDidUpdate (prevProps, prevState) {
    const rowHeight = getHeightFromElem(this.props.rowElem)
    if (this.state.rowHeight !== rowHeight) {
      this.updateDimensions()
    }
  }

  render () {
    if (this.props.containerHeight * 1.1 < this.state.rowHeight) {
      return (
        <StyledRowToggle onClick={this.props.onClick}>
          <StyledCaret
            className={
              this.props.contracted ? 'fa fa-caret-left' : 'fa fa-caret-down'
            }
          />
        </StyledRowToggle>
      )
    } else {
      return null
    }
  }
}

import React, { Component } from 'react'
import neoGraphStyle from '../graphStyle'
import {
  StyledPickerSelector,
  StyledTokenRelationshipType,
  StyledInlineList,
  StyledInlineListItem,
  StyledLabelToken,
  StyledPickerListItem,
  StyledCircleSelector,
  StyledCaptionSelector
} from './styled'
import { toKeyString } from '../../shared/services/utils'


export class GrassEditorComponent extends Component {
  constructor (props) {
    super(props)
    this.graphStyle = neoGraphStyle()
    if (this.props.graphStyleData) {
      this.graphStyle.loadRules(this.props.graphStyleData)
    }
    this.nodeDisplaySizes = []
    this.widths = []
    for (var index = 0; index < 10; index++) {
      this.nodeDisplaySizes.push(`${12 + 2 * index}px`)
      this.widths.push(`${5 + 3 * index}px`)
    }
  }

  sizeLessThan (size1, size2) {
    let size1Numerical = size1 ? size1.replace('px', '') + 0 : 0
    let size2Numerical = size1 ? size2.replace('px', '') + 0 : 0
    return size1Numerical <= size2Numerical
  }

  updateStyle (selector, styleProp) {
    this.graphStyle.changeForSelector(selector, styleProp)
    this.props.update(this.graphStyle.toSheet())
  }

  circleSelector (
    styleProps,
    styleProvider,
    activeProvider,
    className,
    selector,
    textProvider = () => {
      return ''
    }
  ) {
    return styleProps.map((styleProp, i) => {
      const onClick = () => {
        this.updateStyle(selector, styleProp)
      }
      const style = styleProvider(styleProp, i)
      const text = textProvider(styleProp)
      const active = activeProvider(styleProp)
      return (
        <StyledPickerListItem
          className={className}
          key={toKeyString('circle' + i)}
        >
          <StyledCircleSelector
            className={active ? 'active' : ''}
            style={style}
            onClick={onClick}
          >
            {text}
          </StyledCircleSelector>
        </StyledPickerListItem>
      )
    })
  }

  colorPicker (selector, styleForLabel) {
    return (
      <StyledInlineListItem key='color-picker'>
        <StyledInlineList className='color-picker picker'>
          <StyledInlineListItem>Color:</StyledInlineListItem>
          {this.circleSelector(
            this.graphStyle.defaultColors(),
            color => {
              return { backgroundColor: color.color }
            },
            color => {
              return color.color === styleForLabel.get('color')
            },
            'color-picker-item',
            selector
          )}
        </StyledInlineList>
      </StyledInlineListItem>
    )
  }

  sizePicker (selector, styleForLabel) {
    return (
      <StyledInlineListItem key='size-picker'>
        <StyledInlineList className='size-picker picker'>
          <StyledInlineListItem>Size:</StyledInlineListItem>
          {this.circleSelector(
            this.graphStyle.defaultSizes(),
            (size, index) => {
              return {
                width: this.nodeDisplaySizes[index],
                height: this.nodeDisplaySizes[index]
              }
            },
            size => {
              return this.sizeLessThan(
                size.diameter,
                styleForLabel.get('diameter')
              )
            },
            'size-picker-item',
            selector
          )}
        </StyledInlineList>
      </StyledInlineListItem>
    )
  }
  widthPicker (selector, styleForItem) {
    let widthSelectors = this.graphStyle
      .defaultArrayWidths()
      .map((widthValue, i) => {
        const onClick = () => {
          this.updateStyle(selector, widthValue)
        }
        const style = { width: this.widths[i] }
        const active =
          styleForItem.get('shaft-width') === widthValue['shaft-width']
        return (
          <StyledPickerListItem
            className='width-picker-item'
            key={toKeyString('width' + i)}
          >
            <StyledPickerSelector
              className={active ? 'active' : ''}
              style={style}
              onClick={onClick}
            />
          </StyledPickerListItem>
        )
      })
    return (
      <StyledInlineListItem key='width-picker'>
        <StyledInlineList className='width-picker picker'>
          <StyledInlineListItem>Line width:</StyledInlineListItem>
          {widthSelectors}
        </StyledInlineList>
      </StyledInlineListItem>
    )
  }

  iconPicker (selector) {
    return (
      <li key='icon-picker'>
        Icon:
        <ul className='icon-picker picker'>
          {this.picker(
            this.graphStyle.defaultIconCodes(),
            iconCode => {
              return { fontFamily: 'streamline' }
            },
            'icon-picker-item',
            selector,
            iconCode => {
              return iconCode['icon-code']
            }
          )}
        </ul>
      </li>
    )
  }

  captionPicker (
    selector,
    styleForItem,
    propertyKeys,
    showTypeSelector = false
  ) {
    let captionSelector = (displayCaption, captionToSave, key) => {
      const onClick = () => {
        this.updateStyle(selector, { caption: captionToSave })
      }
      let active = styleForItem.props.caption === captionToSave
      return (
        <StyledPickerListItem key={toKeyString('caption' + displayCaption)}>
          <StyledCaptionSelector
            className={active ? 'active' : ''}
            onClick={onClick}
          >
            {displayCaption}
          </StyledCaptionSelector>
        </StyledPickerListItem>
      )
    }
    let captionSelectors = propertyKeys.map((propKey, i) => {
      return captionSelector(propKey, `{${propKey}}`)
    })
    let typeCaptionSelector = null
    if (showTypeSelector) {
      typeCaptionSelector = captionSelector('<type>', '<type>', 'typecaption')
    }
    return (
      <StyledInlineListItem key='caption-picker'>
        <StyledInlineList className='caption-picker picker'>
          <StyledInlineListItem>Caption:</StyledInlineListItem>
          {captionSelector('<id>', '<id>', 'idcaption')}
          {typeCaptionSelector}
          {captionSelectors}
        </StyledInlineList>
      </StyledInlineListItem>
    )
  }

  stylePicker () {
    let pickers
    let title
    if (this.props.selectedLabel) {
      const labelList =
        this.props.selectedLabel.label !== '*'
          ? [this.props.selectedLabel.label]
          : []
      const styleForLabel = this.graphStyle.forNode({ labels: labelList })
      const inlineStyle = {
        backgroundColor: styleForLabel.get('color'),
        color: styleForLabel.get('text-color-internal')
      }
      pickers = [
        this.colorPicker(styleForLabel.selector, styleForLabel),
        this.sizePicker(styleForLabel.selector, styleForLabel),
        this.captionPicker(
          styleForLabel.selector,
          styleForLabel,
          this.props.selectedLabel.propertyKeys
        )
      ]
      title = (
        <StyledLabelToken className='token token-label' style={inlineStyle}>
          {this.props.selectedLabel.label || '*'}
        </StyledLabelToken>
      )
    } else if (this.props.selectedRelType) {
      const relTypeSelector =
        this.props.selectedRelType.relType !== '*'
          ? { type: this.props.selectedRelType.relType }
          : {}
      const styleForRelType = this.graphStyle.forRelationship(relTypeSelector)
      const inlineStyle = {
        backgroundColor: styleForRelType.get('color'),
        color: styleForRelType.get('text-color-internal')
      }
      pickers = [
        this.colorPicker(styleForRelType.selector, styleForRelType),
        this.widthPicker(styleForRelType.selector, styleForRelType),
        this.captionPicker(
          styleForRelType.selector,
          styleForRelType,
          this.props.selectedRelType.propertyKeys,
          true
        )
      ]
      title = (
        <StyledTokenRelationshipType
          className='token token-relationship'
          style={inlineStyle}
        >
          {this.props.selectedRelType.relType || '*'}
        </StyledTokenRelationshipType>
      )
    } else {
      return null
    }
    return (
      <StyledInlineList className='style-picker'>
        {title}
        {pickers}
      </StyledInlineList>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.graphStyleData &&
      nextProps.graphStyleData !== this.props.graphStyleData
    ) {
      this.graphStyle.loadRules(nextProps.graphStyleData)
    }
  }

  render () {
    return this.stylePicker()
  }
}
export default GrassEditorComponent
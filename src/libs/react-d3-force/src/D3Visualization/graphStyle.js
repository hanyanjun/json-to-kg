import {
  selectorStringToArray,
  selectorArrayToString
} from '../shared/services/grassUtils'

export default function neoGraphStyle() {
  // 修改默认的样式
  const defaultStyle = {
    "node": {
      "diameter": "35px",
      "color": "#f9d684",
      "border-color": "#f9d684",
      "border-width": "2px",
      "text-color-internal": "#454545",
      "font-size": "10px"
    },
    "node.changed": {
      "diameter": "25px",
      "color": "#adadad",
      "border-color": "#adadad",
      "border-width": "2px",
      "text-color-internal": "#454545",
      "font-size": "10px"
    },
    "node.cryptoRelated": {
      "diameter": "25px",
      "color": "#adadad",
      "border-color": "#adadad",
      "border-width": "2px",
      "text-color-internal": "#454545",
      "font-size": "10px"
    },
    "node.UncryptoRelated": {
      "diameter": "25px",
      "color": "#adadad",
      "border-color": "#adadad",
      "border-width": "2px",
      "text-color-internal": "#454545",
      "font-size": "10px"
    },
    "relationship": {
      "color": "#A5ABB6",
      "shaft-width": "1px",
      "font-size": "8px",
      "padding": "3px",
      "text-color-external": "#000000",
      "text-color-internal": "#FFFFFF",
      "caption": "<type>"
    },
    "node.Project": {
      "color": "#346894",
      "border-color": "#346894",
      "text-color-internal": "#FFFFFF",
      "defaultCaption": "<id>",
      "diameter": "65px",
      "caption": "{name}"
    },
    "node.Sector": {
      "color": "#a75a29",
      "border-color": "#a75a29",
      "text-color-internal": "#ffffff",
      "defaultCaption": "<id>",
      "diameter": "80px"
    },
    "node.Capital": {
      "color": "#09274b",
      "border-color": "#09274b",
      "text-color-internal": "#FFFFFF",
      "defaultCaption": "<id>",
      "diameter": "65px"
    },
    "node.Token": {
      "color": "#346894",
      "border-color": "#346894",
      "text-color-internal": "#FFFFFF",
      "defaultCaption": "<id>",
      "diameter": "50px"
    },
    "node.Person": {
      "color": "#d79d53",
      "border-color": "#d79d53",
      "text-color-internal": "#1c1c1c",
      "defaultCaption": "<id>",
      "caption": "{name}",
      "diameter": "50px"
    },
    "node.School": {
      "caption": "{name}",
      "diameter": "80px",
      "color": "#604740",
      "border-color": "#604740",
      "text-color-internal": "#ffffff"
    },
    "node.FundingRound": {
      "caption": "{name}",
      "diameter": "35px",
      "color": "#a0a0a0",
      "border-color": "#a0a0a0",
      "text-color-internal": "#ffffff"
    }
  }
  const defaultSizes = [{
      diameter: '10px'
    },
    {
      diameter: '20px'
    },
    {
      diameter: '50px'
    },
    {
      diameter: '65px'
    },
    {
      diameter: '80px'
    }
  ]
  const defaultIconCodes = [{
      'icon-code': 'a'
    },
    {
      'icon-code': '"'
    },
    {
      'icon-code': 'z'
    },
    {
      'icon-code': '_'
    },
    {
      'icon-code': '/'
    },
    {
      'icon-code': '>'
    },
    {
      'icon-code': 'k'
    }
  ]
  const defaultArrayWidths = [{
      'shaft-width': '1px'
    },
    {
      'shaft-width': '2px'
    },
    {
      'shaft-width': '3px'
    },
    {
      'shaft-width': '5px'
    },
    {
      'shaft-width': '8px'
    },
    {
      'shaft-width': '13px'
    },
    {
      'shaft-width': '25px'
    },
    {
      'shaft-width': '38px'
    }
  ]
  const defaultColors = [{
      color: '#FFE081',
      'border-color': '#9AA1AC',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#C990C0',
      'border-color': '#b261a5',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#F79767',
      'border-color': '#f36924',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#57C7E3',
      'border-color': '#23b3d7',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#F16667',
      'border-color': '#eb2728',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#D9C8AE',
      'border-color': '#c0a378',
      'text-color-internal': '#604A0E'
    },
    {
      color: '#8DCC93',
      'border-color': '#5db665',
      'text-color-internal': '#604A0E'
    },
    {
      color: '#ECB5C9',
      'border-color': '#da7298',
      'text-color-internal': '#604A0E'
    },
    {
      color: '#4C8EDA',
      'border-color': '#2870c2',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#FFC454',
      'border-color': '#d7a013',
      'text-color-internal': '#604A0E'
    },
    {
      color: '#DA7194',
      'border-color': '#cc3c6c',
      'text-color-internal': '#FFFFFF'
    },
    {
      color: '#569480',
      'border-color': '#447666',
      'text-color-internal': '#FFFFFF'
    }
  ]
  const Selector = (function () {
    function Selector(tag1, classes1) {
      this.tag = tag1
      this.classes = classes1 != null ? classes1 : []
    }

    Selector.prototype.toString = function () {
      return selectorArrayToString([this.tag].concat(this.classes))
    }

    return Selector
  })()

  const StyleRule = (function () {
    function StyleRule(selector1, props1) {
      this.selector = selector1
      this.props = props1
    }

    StyleRule.prototype.matches = function (selector) {
      if (this.selector.tag !== selector.tag) {
        return false
      }
      for (let i = 0; i < this.selector.classes.length; i++) {
        const classs = this.selector.classes[i]
        if (classs != null && selector.classes.indexOf(classs) === -1) {
          return false
        }
      }
      return true
    }

    StyleRule.prototype.matchesExact = function (selector) {
      return (
        this.matches(selector) &&
        this.selector.classes.length === selector.classes.length
      )
    }

    return StyleRule
  })()

  const StyleElement = (function () {
    function StyleElement(selector) {
      this.selector = selector
      this.props = {}
    }

    StyleElement.prototype.applyRules = function (rules, item) {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        if (rule.matches(this.selector)) {
          this.props = {
            ...this.props,
            ...rule.props
          }
          this.props.caption = this.props.caption || this.props.defaultCaption
        }
      }
      return this
    }

    StyleElement.prototype.get = function (attr) {
      return this.props[attr] || ''
    }

    return StyleElement
  })()

  const GraphStyle = (function () {
    function GraphStyle() {
      this.rules = []
      try {
        this.loadRules()
      } catch (_error) {
        // e = _error
      }
    }

    const parseSelector = function (key) {
      let tokens = selectorStringToArray(key)
      return new Selector(tokens[0], tokens.slice(1))
    }

    const selector = function (item) {
      if (item.isNode) {
        return nodeSelector(item)
      } else if (item.isRelationship) {
        return relationshipSelector(item)
      }
    }

    const nodeSelector = function (node) {
      node = node || {}
      const classes = node.labels != null ? node.labels : []
      return new Selector('node', classes)
    }

    const relationshipSelector = function (rel) {
      rel = rel || {}
      const classes = rel.type != null ? [rel.type] : []
      return new Selector('relationship', classes)
    }

    const findRule = function (selector, rules) {
      for (let i = 0; i < rules.length; i++) {
        let rule = rules[i]
        if (rule.matchesExact(selector)) {
          return rule
        }
      }
    }

    const findAvailableDefaultColor = function (rules) {
      const usedColors = rules
        .filter(rule => {
          return rule.props.color != null
        })
        .map(rule => {
          return rule.props.color
        })
      let index =
        usedColors.length - 1 > defaultColors ? 0 : usedColors.length - 1
      return defaultColors[index]
    }

    const getDefaultNodeCaption = function (item) {
      if (
        !item ||
        !(item.propertyList != null ? item.propertyList.length : 0) > 0
      ) {
        return {
          defaultCaption: '<id>'
        }
      }
      const captionPrioOrder = [
        /^name$/i,
        /^title$/i,
        /^label$/i,
        /name$/i,
        /description$/i,
        /^.+/
      ]
      let defaultCaption = captionPrioOrder.reduceRight(function (
          leading,
          current
        ) {
          let hits = item.propertyList.filter(function (prop) {
            return current.test(prop.key)
          })
          if (hits.length) {
            return '{' + hits[0].key + '}'
          } else {
            return leading
          }
        },
        '')
      defaultCaption || (defaultCaption = '<id>')
      return {
        caption: defaultCaption
      }
    }

    GraphStyle.prototype.calculateStyle = function (selector, item) {
      return new StyleElement(selector).applyRules(this.rules, item)
    }

    // GraphStyle.prototype.forEntity = function (item) {
    //   return this.calculateStyle(selector(item))
    // }

    GraphStyle.prototype.setDefaultNodeStyling = function (selector, item) {
      let defaultColor = true
      let defaultCaption = true
      for (let i = 0; i < this.rules.length; i++) {
        let rule = this.rules[i]
        if (rule.selector.classes.length > 0 && rule.matches(selector)) {
          if (rule.props.hasOwnProperty('color')) {
            defaultColor = false
          }
          if (rule.props.hasOwnProperty('caption')) {
            defaultCaption = false
          }
        }
      }
      const minimalSelector = new Selector(
        selector.tag,
        selector.classes.sort().slice(0, 1)
      )
      if (defaultColor) {
        this.changeForSelector(
          minimalSelector,
          findAvailableDefaultColor(this.rules)
        )
      }
      if (defaultCaption) {
        return this.changeForSelector(
          minimalSelector,
          getDefaultNodeCaption(item)
        )
      }
    }

    GraphStyle.prototype.changeForSelector = function (selector, props) {
      let rule = findRule(selector, this.rules)
      if (rule == null) {
        rule = new StyleRule(selector, props)
        this.rules.push(rule)
      }
      rule.props = {
        ...rule.props,
        ...props
      }
      return rule
    }

    GraphStyle.prototype.destroyRule = function (rule) {
      const idx = this.rules.indexOf(rule)
      if (idx != null) {
        this.rules.splice(idx, 1)
      }
    }

    GraphStyle.prototype.importGrass = function (string) {
      try {
        const rules = this.parse(string)
        return this.loadRules(rules)
      } catch (_error) {
        // e = _error
      }
    }

    GraphStyle.prototype.parse = function (string) {
      const chars = string.split('')
      let insideString = false
      let insideProps = false
      let keyword = ''
      let props = ''
      let rules = {}
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i]
        let skipThis = true
        switch (c) {
          case '{':
            if (!insideString) {
              insideProps = true
            } else {
              skipThis = false
            }
            break
          case '}':
            if (!insideString) {
              insideProps = false
              rules[keyword] = props
              keyword = ''
              props = ''
            } else {
              skipThis = false
            }
            break
          case "'":
            insideString ^= true
            break
          default:
            skipThis = false
        }
        if (skipThis) {
          continue
        }
        if (insideProps) {
          props += c
        } else {
          if (!c.match(/[\s\n]/)) {
            keyword += c
          }
        }
      }
      for (let k in rules) {
        const v = rules[k]
        rules[k] = {}
        v.split(';').forEach(prop => {
          const [key, val] = prop.split(':')
          if (key && val) {
            rules[k][key.trim()] = val.trim()
          }
        })
      }
      return rules
    }

    GraphStyle.prototype.resetToDefault = function () {
      this.loadRules()
      return true
    }

    GraphStyle.prototype.toSheet = function () {
      let sheet = {}
      this.rules.forEach(rule => {
        sheet[rule.selector.toString()] = rule.props
      })
      return sheet
    }

    GraphStyle.prototype.toString = function () {
      let str = ''
      this.rules.forEach(r => {
        str += r.selector.toString() + ' {\n'
        for (let k in r.props) {
          let v = r.props[k]
          if (k === 'caption') {
            v = "'" + v + "'"
          }
          str += '  ' + k + ': ' + v + ';\n'
        }
        str += '}\n\n'
      })
      return str
    }

    GraphStyle.prototype.loadRules = function (data) {
      if (typeof data !== 'object') {
        data = defaultStyle
      }
      this.rules.length = 0
      for (let key in data) {
        const props = data[key]
        this.rules.push(new StyleRule(parseSelector(key), props))
      }
      return this
    }

    GraphStyle.prototype.defaultSizes = function () {
      return defaultSizes
    }

    GraphStyle.prototype.defaultIconCodes = function () {
      return defaultIconCodes
    }

    GraphStyle.prototype.defaultArrayWidths = function () {
      return defaultArrayWidths
    }

    GraphStyle.prototype.defaultColors = function () {
      return defaultColors
    }

    GraphStyle.prototype.interpolate = function (str, item) {
      let ips = str.replace(/\{([^{}]*)\}/g, function (a, b) {
        let r = item.propertyMap[b]
        if (typeof r === 'object') {
          return r.join(', ')
        }
        if (typeof r === 'string' || typeof r === 'number') {
          return r
        }
        return ''
      })
      if (ips.length < 1 && str === '{type}' && item.isRelationship) {
        ips = '<type>'
      }
      if (ips.length < 1 && str === '{id}' && item.isNode) {
        ips = '<id>'
      }
      return ips.replace(/^<(id|type)>$/, function (a, b) {
        const r = item[b]
        if (typeof r === 'string' || typeof r === 'number') {
          return r
        }
        return ''
      })
    }

    GraphStyle.prototype.forNode = function (node) {
      node = node || {}
      const selector = nodeSelector(node)
      if ((node.labels != null ? node.labels.length : 0) > 0) {
        this.setDefaultNodeStyling(selector, node)
      }
      return this.calculateStyle(selector, node)
    }

    GraphStyle.prototype.forRelationship = function (rel) {
      const selector = relationshipSelector(rel)
      return this.calculateStyle(selector, rel)
    }

    return GraphStyle
  })()
  return new GraphStyle()
}
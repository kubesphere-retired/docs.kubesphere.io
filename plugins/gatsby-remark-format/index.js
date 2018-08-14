const visit = require(`unist-util-visit`)

module.exports = ({ markdownAST }, pluginOptions = {}) => {
  visit(markdownAST, 'tableCell', node => {
    let children = node.children
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (child.type === 'text' && child.value === '_') {
        child.value = '_'

        if (index - 1 >= 0 && children[index - 1].type === 'text') {
          child.value = children[index - 1].value + '_'
          children.splice(index - 1, 1)
          index--
        }

        if (
          index + 1 < children.length &&
          children[index + 1].type === 'text'
        ) {
          child.value += children[index + 1].value
          children.splice(index + 1, 1)
        }
      }
    }
    node.children = children
  })
}

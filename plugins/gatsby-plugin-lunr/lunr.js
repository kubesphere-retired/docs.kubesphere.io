const lunr = require('lunr')

lunr.trimmer = function(token) {
  return token.update(function(s) {
    if (isChineseChar(s)) {
      return s
    }

    return s.replace(/^\W+/, '').replace(/\W+$/, '')
  })
}

function isChineseChar(str) {
  var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
  return reg.test(str)
}

module.exports = lunr

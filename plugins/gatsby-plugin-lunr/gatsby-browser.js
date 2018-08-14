const lunr = require('./lunr.js')

exports.onClientEntry = () => {
  fetch('/search_index.json')
    .then(function(response) {
      return response.json()
    })
    .then(function(fullIndex) {
      window.__LUNR__ = Object.keys(fullIndex).reduce(
        (prev, key) => ({
          ...prev,
          [key]: {
            index: lunr.Index.load(fullIndex[key].index),
            store: fullIndex[key].store,
          },
        }),
        {}
      )
    })
    .catch(e => console.log('Failed fetch search index'))
}

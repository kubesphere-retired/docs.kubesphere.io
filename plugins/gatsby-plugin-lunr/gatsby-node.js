const fs = require('fs')
const lunr = require('./lunr.js')

exports.onPostBuild = (
  { graphql },
  { query, indexes = [], fields = [], transformer = obj => obj }
) => {
  const storeFields = fields.filter(f => f.store === true)

  const fullIndex = {}

  return graphql(query)
    .then(transformer)
    .then(result => {
      indexes.forEach(({ name, filter = () => true }) => {
        const store = {}
        const index = lunr(function() {
          this.ref('id')
          fields.forEach(({ name, attributes = {} }) => {
            this.field(name, attributes)
          })

          result.filter(filter).forEach(doc => {
            this.add(doc)

            store[doc.id] = storeFields.reduce(
              (acc, f) => ({
                ...acc,
                [f.name]: doc[f.name],
              }),
              {}
            )
          })
        })

        fullIndex[name] = { index, store }
      })

      fs.writeFileSync(`public/search_index.json`, JSON.stringify(fullIndex))
    })
}

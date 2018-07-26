const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    const parts = slug.split('/').filter(p => !!p)

    if (parts.length !== 3) {
      throw new Error(`Unexpected node path of length !== 3: ${slug}`)
    }

    const [version, language] = parts

    createNodeField({ node, name: `slug`, value: slug, })
    createNodeField({ node, name: `language`, value: language, })
    createNodeField({ node, name: `version`, value: version, })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise(resolve => {
    graphql(`
      {
        pages: allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                language
                version
              }
            }
          }
        }
      }
    `).then(({ data: { pages: { edges } } }) => {
      // let groups = new Set()

      edges.forEach(({ node }) => {
        const { version, language, slug } = node.fields
        createPage({
          path: slug,
          component: path.resolve(`./src/templates/markdown.js`),
          context: {
            slug: slug,
            id: `${version}-${language}`
          }
        });

        // groups.add(`${version}/${language}`)
      })

      // groups.forEach(group => {
      //   const [version, language] = group.split('/')

      //   if(version === 'install') {
      //     createPage({
      //       path: group,
      //       component: path.resolve(`./src/templates/install.js`),
      //       context: { version, language },
      //     })
      //   }
      // })


      resolve()
    })
  })
}

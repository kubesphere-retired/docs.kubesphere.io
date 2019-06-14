const path = require(`path`)
const axios = require('axios')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    const parts = slug.split('/').filter(p => !!p)

    const [version, language] = parts

    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `language`, value: language })
    createNodeField({ node, name: `version`, value: version })
  }
}

const processSwaggerData = paths => {
  const groupedPaths = {}

  Object.keys(paths).forEach(key => {
    const path = paths[key]
    const methods = Object.keys(path)
    methods.forEach(method => {
      const tags = path[method].tags
      tags &&
        tags.forEach(tag => {
          groupedPaths[tag] = groupedPaths[tag] || []
          groupedPaths[tag].push({ method, path: key, ...path[method] })
        })
    })
  })

  return groupedPaths
}

const createMarkdownPages = ({ graphql, boundActionCreators }) =>
  new Promise(resolve => {
    const { createPage, createRedirect } = boundActionCreators

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
      const versions = []

      edges.forEach(({ node }) => {
        const { version, language, slug } = node.fields

        if (!versions.includes(`${version}---${language}`)) {
          versions.push(`${version}---${language}`)
        }

        createPage({
          path: slug,
          component: path.resolve(`./src/templates/markdown.js`),
          context: {
            slug: slug,
            version: version,
            lang: language,
          },
        })
      })

      versions.forEach(version => {
        const [ver, lang] = version.split('---')

        createPage({
          path: `/${ver}/${lang}/all`,
          component: path.resolve(`./src/templates/all.js`),
          context: {
            version: ver,
            lang,
          },
        })
      })

      const redirects = {
        '/express/zh-CN/': '/express/zh-CN/basic/',
        '/express/en/': '/express/en/KubeSphere-Installer-Guide/',
        '/advanced-v1.0/zh-CN/': '/advanced-v1.0/zh-CN/introduction/intro/',
        '/advanced-v1.0/en/': '/advanced-v1.0/en/test-en/',
        '/advanced-v2.0/zh-CN/': '/advanced-v2.0/zh-CN/introduction/intro/',
      }

      Object.entries(redirects).forEach(([key, value]) => {
        createRedirect({
          fromPath: key,
          isPermanent: true,
          redirectInBrowser: true,
          toPath: value,
        })
      })

      resolve()
    })
  })

const createAPIPages = ({ graphql, boundActionCreators }) =>
  new Promise(resolve => {
    const { createPage, createRedirect } = boundActionCreators

    graphql(`
      {
        apiTOC: allContentJson(filter: { swagger_url: { ne: null } }) {
          edges {
            node {
              version
              swagger_url
              chapters {
                name
                description
                groups {
                  name
                  description
                }
              }
            }
          }
        }
      }
    `).then(({ data: { apiTOC } }) => {
      if (apiTOC.edges.length > 0) {
        Promise.all(
          apiTOC.edges.map(({ node }) => {
            if (node.swagger_url === 'local') {
              const data = require(`./src/data/${node.version}_api.json`)
              return Promise.resolve({ data: data })
            } else {
              return axios.get(node.swagger_url)
            }
          })
        ).then(data => {
          data.forEach((item, index) => {
            if (item.data) {
              const swaggerData = processSwaggerData(item.data.paths)
              const edge = apiTOC.edges[index]

              let firstPath

              edge.node.chapters.forEach(chapter => {
                const pagePath = `/${
                  edge.node.version
                }/api/${chapter.name.toLowerCase()}`

                if (!firstPath) {
                  firstPath = pagePath
                }

                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/api.js`),
                  context: {
                    version: edge.node.version,
                    chapter: JSON.stringify(chapter),
                    chapters: JSON.stringify(edge.node.chapters),
                    content: JSON.stringify(swaggerData[chapter.name]),
                    definitions: JSON.stringify(item.data.definitions),
                  },
                })
              })

              if (firstPath) {
                createRedirect({
                  fromPath: `/${edge.node.version}/api`,
                  isPermanent: true,
                  redirectInBrowser: true,
                  toPath: firstPath,
                })
              }
            }
          })
          resolve()
        })
      } else {
        resolve()
      }
    })
  })

exports.createPages = (...rest) => {
  return Promise.all([createMarkdownPages(...rest), createAPIPages(...rest)])
}

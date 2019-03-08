const path = require(`path`)
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

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage, createRedirect } = boundActionCreators
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
}

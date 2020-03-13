const fs = require('fs')
const path = require('path')
const config = require('./gatsby-config')
const { createFilePath } = require(`gatsby-source-filesystem`)

const localesNSContent = {
  en: [
    {
      content: fs.readFileSync(`src/locales/en/common.json`, 'utf8'),
      ns: 'common',
    },
  ],
  'zh-CN': [
    {
      content: fs.readFileSync(`src/locales/zh-CN/common.json`, 'utf8'),
      ns: 'common',
    },
  ],
}

const { availableLocales, defaultLocale } = config.siteMetadata

exports.onCreatePage = async props => {
  const {
    page,
    actions: { createPage },
  } = props

  if (page.path.indexOf('404') !== -1) {
    return
  }

  availableLocales.map(({ value }) => {
    const newPath =
      value === defaultLocale ? page.path : `/${value}${page.path}`

    const localePage = {
      ...page,
      originalPath: page.path,
      path: newPath,
      context: {
        defaultLocale,
        availableLocales,
        locale: value,
        routed: true,
        data: localesNSContent[value],
        originalPath: page.path,
      },
    }
    createPage(localePage)
  })
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    const parts = slug.split('/').filter(p => !!p)

    const [language] = parts

    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `language`, value: language })
  }
}

exports.createPages = ({ graphql, actions }) =>
  new Promise(resolve => {
    const { createPage, createRedirect } = actions

    graphql(`
      {
        pages: allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                language
              }
            }
          }
        }
      }
    `).then(({ data: { pages: { edges } } }) => {
      edges.forEach(({ node }) => {
        const { language, slug } = node.fields
        const shortPath =
          language === defaultLocale ? slug.replace(`/${language}`, '') : slug
        createPage({
          path: shortPath,
          component: path.resolve(`./src/templates/markdown.js`),
          context: {
            slug: slug,
            lang: language,
            availableLocales,
            defaultLocale,
            locale: language,
            routed: true,
            data: localesNSContent[language],
          },
        })
        if (language === defaultLocale) {
          createRedirect({
            fromPath: slug,
            isPermanent: true,
            redirectInBrowser: true,
            toPath: shortPath,
          })
        }
      })

      if (process.env.BUILD !== 'CI') {
        createPage({
          path: `/zh-CN/all`,
          component: path.resolve(`./src/templates/all.js`),
          context: { lang: 'zh-CN' },
        })
      }

      resolve()
    })
  })

const fs = require('fs')
const path = require('path')
const config = require('./gatsby-config')
const { createFilePath } = require(`gatsby-source-filesystem`)
const loadAndBundleSpec = require('@leoendless/redoc').loadAndBundleSpec

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
    actions: { createPage, createRedirect },
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

    if (value === defaultLocale) {
      createRedirect({
        fromPath: `/${value}${page.path}`,
        isPermanent: true,
        redirectInBrowser: true,
        toPath: page.path,
      })
      createRedirect({
        fromPath: `/${value}`,
        isPermanent: true,
        redirectInBrowser: true,
        toPath: '/',
      })
    }
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

const createMarkdownPages = ({ graphql, actions }) =>
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

const createAPIPages = ({ graphql, actions }) =>
  new Promise(resolve => {
    const { createPage } = actions

    graphql(`
      {
        site {
          siteMetadata {
            swaggerUrls {
              name
              url
            }
          }
        }
      }
    `).then(({ data: { site } }) => {
      const promises = []
      site.siteMetadata.swaggerUrls.forEach(item => {
        promises.push(
          new Promise(resolve => {
            if (/^data/.test(item.url)) {
              const data = require(`./src/${item.url}`)
              loadAndBundleSpec(data).then(data => {
                resolve({
                  data,
                  name: item.name,
                })
              })
            } else {
              loadAndBundleSpec(item.url).then(data => {
                resolve({
                  data,
                  name: item.name,
                })
              })
            }
          })
        )
      })
      Promise.all(promises).then(ret => {
        ret.forEach(({ name, data }) => {
          createPage({
            path: `/api/${name}`,
            component: path.resolve(`./src/templates/api.js`),
            context: {
              swaggerData: data,
            },
          })
        })
        resolve()
      })
    })
  })

exports.createPages = (...rest) => {
  return Promise.all([createMarkdownPages(...rest), createAPIPages(...rest)])
}

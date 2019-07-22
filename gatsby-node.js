const fs = require('fs')
const path = require('path')
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

const availableLocales = [
  { name: '简体中文', value: 'zh-CN' },
  { name: 'English', value: 'en' },
]

const defaultLocales = { value: 'zh-CN', text: '简体中文' }

exports.onCreatePage = async props => {
  const {
    page,
    actions: { createPage, createRedirect, deletePage },
  } = props

  if (page.path.indexOf('404') !== -1) {
    return
  }

  deletePage(page)

  availableLocales.map(({ value }) => {
    const newPath = `/${value}${page.path}`

    const localePage = {
      ...page,
      originalPath: page.path,
      path: newPath,
      context: {
        availableLocales,
        locale: value,
        routed: true,
        data: localesNSContent[value],
        originalPath: page.path,
      },
    }
    createPage(localePage)
  })

  if (page.path === '/') {
    createPage({
      ...page,
      context: {
        availableLocales,
        locale: defaultLocales.value,
        routed: true,
        data: localesNSContent[defaultLocales.value],
        originalPath: page.path,
      },
    })
  } else {
    createRedirect({
      fromPath: page.path,
      isPermanent: true,
      redirectInBrowser: true,
      toPath: `/${defaultLocales.value}${page.path}`,
    })
  }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` })

    const parts = slug.split('/').filter(p => !!p)

    const [version, language] = parts

    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `language`, value: language })
    createNodeField({ node, name: `version`, value: version })
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
            availableLocales,
            locale: language,
            routed: true,
            data: localesNSContent[language],
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

const createAPIPages = ({ graphql, actions }) =>
  new Promise(resolve => {
    const { createPage } = actions

    graphql(`
      {
        site {
          siteMetadata {
            apiDocuments {
              version
              swaggerUrls {
                name
                url
              }
            }
          }
        }
      }
    `).then(({ data: { site } }) => {
      const promises = []
      site.siteMetadata.apiDocuments.forEach(doc => {
        doc.swaggerUrls.forEach(item => {
          promises.push(
            new Promise(resolve => {
              if (/^data/.test(item.url)) {
                const data = require(`./src/${item.url}`)
                loadAndBundleSpec(data).then(data => {
                  resolve({
                    data,
                    name: item.name,
                    version: doc.version,
                  })
                })
              } else {
                loadAndBundleSpec(item.url).then(data => {
                  resolve({
                    data,
                    name: item.name,
                    version: doc.version,
                  })
                })
              }
            })
          )
        })
      })
      Promise.all(promises).then(ret => {
        ret.forEach(({ name, version, data }) => {
          createPage({
            path: `/${version}/api/${name}`,
            component: path.resolve(`./src/templates/api.js`),
            context: {
              version: version,
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

const fs = require('fs')

const indexes = []
fs.readdirSync('./content').forEach(file => {
  if (/^toc_.*.json$/.test(file)) {
    const data = require('./content/' + file)
    indexes.push({
      name: `${data.version}_${data.lang}`,
      filter: obj => obj.version === data.version && obj.language === data.lang,
    })
  }
})

const query = `
{
  allMarkdownRemark {
    edges {
      node {
        id
        frontmatter {
          title
        }
        fields {
          slug
          language
          version
        }
        headings {
          value
        }
        excerpt
      }
    }
  }
}
`

const transformer = ({ data }) => {
  const items = []
  data.allMarkdownRemark.edges.forEach(({ node }) => {
    items.push({
      id: node.id,
      title: node.frontmatter.title,
      head: '',
      excerpt: node.excerpt,
      slug: node.fields.slug,
      language: node.fields.language,
      version: node.fields.version,
    })

    if (node.headings) {
      node.headings.forEach(head => {
        const value = head.value
          .replace(/:/g, '')
          .split(' ')
          .join('-')
          .toLowerCase()

        items.push({
          id: node.id + value,
          title: '',
          head_prefix: node.frontmatter.title,
          head: value,
          excerpt: node.excerpt,
          slug: node.fields.slug + '#' + value,
          language: node.fields.language,
          version: node.fields.version,
        })
      })
    }
  })

  return items
}

module.exports = {
  pathPrefix: process.env.NODE_ENV === 'development' ? '/' : '/docs',
  siteMetadata: {
    title: 'KubeSphere Documents',
    versions: [
      {
        label: 'v2.1', 
        value: 'v2.1',
      },
      {
        label: 'v2.0',
        value: 'v2.0',
      },
      {
        label: 'v1.0',
        value: 'v1.0',
      },
      {
        label: 'Express',
        value: 'express',
      },
    ],
    apiDocuments: [
      {
        version: 'v2.0',
        swaggerUrls: [
          {
            name: 'kubesphere',
            url: 'data/v2.0_api.json',
          },
          {
            name: 'notification',
            url: 'data/notification.api.json',
          },
        ],
      },
      {
        version: 'v2.1',
        swaggerUrls: [
          {
            name: 'kubesphere',
            url: 'data/v2.1_api.json',
          },
          {
            name: 'kubesphere-crd',
            url: 'data/v2.1_crd_api.json',
          },
          {
            name: 'notification',
            url: 'data/notification.api.json',
          },
        ],
      },
    ],
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-no-sourcemaps',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 690,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-format',
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: `content`,
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        icon: true,
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#55BC8A',
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-transformer-json',
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        query,
        indexes,
        transformer,
        pathPrefix: '/docs',
        fields: [
          { name: 'title', store: true },
          { name: 'head_prefix', store: true },
          { name: 'head', store: true },
          { name: 'slug', store: true },
          { name: 'excerpt', store: true },
        ],
      },
    },
  ],
}

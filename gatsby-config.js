const fs = require('fs')

const indexes = []
fs.readdirSync('./content').forEach(file => {
  if (/^toc_.*.json$/.test(file)) {
    const [_, version, language] = file.replace('.json', '').split('_')

    indexes.push({
      name: `${version}_${language}`,
      filter: obj => obj.version === version && obj.language === language,
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
  siteMetadata: {
    title: 'KubeSphere Documents',
    versions: [
      {
        label: 'Express v1.0.0-alpha',
        value: 'express',
      }
    ]
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
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
    'gatsby-plugin-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-transformer-json',
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        query,
        indexes,
        transformer,
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

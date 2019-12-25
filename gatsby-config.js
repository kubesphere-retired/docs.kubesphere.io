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
  ],
}

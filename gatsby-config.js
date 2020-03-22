module.exports = {
  pathPrefix: process.env.NODE_ENV === 'development' ? '/' : '/docs/',
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
    ],
    availableLocales: [
      { name: '简体中文', value: 'zh-CN' },
      { name: 'English', value: 'en' },
    ],
    defaultLocale: process.env.DEFAULT_LANG || 'en',
    swaggerUrls: [
      {
        name: 'kubesphere',
        url: 'data/kubesphere.api.json',
      },
      {
        name: 'kubesphere-crd',
        url: 'data/crd.api.json',
      },
      {
        name: 'notification',
        url: 'data/notification.api.json',
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

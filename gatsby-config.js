module.exports = {
  siteMetadata: {
    title: 'KubeSphere Documents',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 690
            }
          },
          {
            resolve: "gatsby-remark-responsive-iframe"
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-autolink-headers",
          "gatsby-remark-format"
        ]
      }
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
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: '#55BC8A',
      }
    },
    {
      resolve: "gatsby-plugin-no-sourcemaps",
    },
    "gatsby-plugin-sharp",
    "gatsby-plugin-catch-links",
    "gatsby-transformer-json",
  ],
}

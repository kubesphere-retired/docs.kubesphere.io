/* eslint-disable no-unused-vars */
import { graphql } from 'gatsby'

export default function NotFound({ data }) {
  if (typeof window !== 'undefined') {
    if (window.location.href.indexOf('/advanced-v') !== -1) {
      window.location.href = window.location.href.replace('/advanced-v', '/v')
    } else if(/\/(v[0-9]\.[0-9])\/(en|zh-CN)/.test(window.location.href)) {
      const [_, version, lang, path] = window.location.href.match(/\/(v[0-9]\.[0-9])\/(en|zh-CN)(.*)$/)
      const latestVersion = data.site.siteMetadata.versions[0].value
      let host = 'kubesphere.io/docs/'
      if (version !== latestVersion) {
        host = version.replace('.', '-') + '.docs.' + host
      }

      window.location.href = `${window.location.protocol}//${host}${lang}${path}`
    } else {
      window.location = data.site.pathPrefix || '/'
    }
  }

  return null
}

export const query = graphql`
  query {
    site {
      pathPrefix
      siteMetadata {
        versions {
          value
          label
        }
      }
    }
  }
`

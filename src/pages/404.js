import { graphql } from 'gatsby'

export default function NotFound({ data }) {
  if (typeof window !== 'undefined') {
    if (window.location.href.indexOf('/advanced-v') !== -1) {
      window.location.href = window.location.href.replace('/advanced-v', '/v')
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
    }
  }
`

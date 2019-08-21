import { graphql } from 'gatsby'

export default function NotFound({ data }) {
  if (typeof window !== 'undefined') {
    window.location = data.site.pathPrefix || '/'
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

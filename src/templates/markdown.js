import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import SiteHeader from '../components/Header'
import Versions from '../components/Versions'
import TableOfContents from '../components/TableOfContents/index'

import './markdown.css'
import './b16-tomorrow-dark.css'

export default class MarkdownTemplate extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
  }

  componentDidMount() {
    this.scrollToHash()

    if (typeof docsearch !== 'undefined') {
      docsearch({
        apiKey: '221332a85783d16a5b930969fe4a934a',
        indexName: 'kubesphere',
        inputSelector: '.ks-search > input',
        debug: false,
      })
    }
  }

  scrollToHash = () => {
    setTimeout(() => {
      if (this.props.location.hash) {
        const id = decodeURIComponent(this.props.location.hash).slice(1)
        const element = document.getElementById(id)
        element && element.scrollIntoView()
      }
    }, 100)
  }

  getChildContext() {
    return {
      location: this.props.location,
    }
  }

  render() {
    const { slug } = this.props.pathContext
    const postNode = this.props.data.postBySlug

    const post = postNode.frontmatter
    if (!post.id) {
      post.id = slug
    }

    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${
            this.props.data.site.siteMetadata.title
          }`}</title>
        </Helmet>
        <BodyGrid>
          <NavContainer>
            <Versions
              versions={this.props.data.versions}
              current={postNode.fields.version}
            />
            <ToCContainer>
              <TableOfContents
                chapters={
                  this.props.data.tableOfContents.edges[0].node.chapters
                }
              />
            </ToCContainer>
          </NavContainer>
          <MainContainer>
            <HeaderContainer>
              <SiteHeader location={this.props.location} />
            </HeaderContainer>
            <div style={{ padding: 40 }} className="md-body">
              <h1>{post.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
            </div>
          </MainContainer>
        </BodyGrid>
      </div>
    )
  }
}

const BodyGrid = styled.div`
  height: 100vh;
`

const NavContainer = styled.div`
  float: left;
  width: 280px;
  height: 100%;
  background-color: #242e42;
  box-shadow: 4px 0 8px 0 rgba(101, 125, 149, 0.2);
  color: #fff;
  overflow-y: auto;
`

const MainContainer = styled.div`
  height: 100%;
  margin-left: 280px;
  overflow-y: auto;

  & > div {
    margin: auto;
  }

  & > h1 {
    color: #303e5a;
  }
`

const HeaderContainer = styled.div`
  height: 80px;
`

const ToCContainer = styled.div`
  padding: 40px 0;
`

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  fragment ChildMarkdownRemark on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      title
    }
    headings {
      value
      depth
    }
  }
  query MarkdownBySlug($slug: String!, $id: String!, $version: String!) {
    site {
      siteMetadata {
        title
      }
    }
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      fields {
        version
      }
    }
    versions: allMarkdownRemark {
      group(field: fields___version) {
        fieldValue
      }
    }
    languages: allMarkdownRemark(
      filter: { fields: { version: { eq: $version } } }
    ) {
      group(field: fields___language) {
        fieldValue
      }
    }
    tableOfContents: allContentJson(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          chapters {
            title
            entry {
              id
              childMarkdownRemark {
                ...ChildMarkdownRemark
              }
            }
            entries {
              entry {
                id
                childMarkdownRemark {
                  ...ChildMarkdownRemark
                }
              }
            }
            chapters {
              title
              entry {
                id
                childMarkdownRemark {
                  ...ChildMarkdownRemark
                }
              }
              entries {
                entry {
                  id
                  childMarkdownRemark {
                    ...ChildMarkdownRemark
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

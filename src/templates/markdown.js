import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled from 'styled-components'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Headings from '../components/Headings'
import Versions from '../components/Versions'
import SearchResult from '../components/SearchResult'
import TableOfContents from '../components/TableOfContents/index'

import './markdown.css'
import './b16-tomorrow-dark.css'

export default class MarkdownTemplate extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
  }

  state = {
    isExpand: false,
    query: '',
    showSearchResult: false,
    results: [],
    prev: {},
    next: {},
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick)

    if (this.markdownRef && !this.scroll && typeof SmoothScroll !== 'undefined') {
      this.scroll = new SmoothScroll('a[href*="#"]', {
        offset: 100,
      })
    }

    this.scrollToHash()

    this.getPrevAndNext()
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick)
  }

  isCurrentLink = link => {
    let ret = false

    if (link.classList) {
      ret = link.classList.contains('selected-link')
    } else {
      ret = new RegExp('(^| )selected-link( |$)', 'gi').test(link.className)
    }

    return ret
  }

  getPrevAndNext = () => {
    if (this.tocRef) {
      const linkDoms = this.tocRef.querySelectorAll('a[href]')
      const prev = {}
      const next = {}

      linkDoms.forEach((link, index) => {
        if (this.isCurrentLink(link)) {
          if (linkDoms[index - 1]) {
            prev.text = linkDoms[index - 1].text
            prev.href = linkDoms[index - 1].pathname
          }

          if (linkDoms[index + 1]) {
            next.text = linkDoms[index + 1].text
            next.href = linkDoms[index + 1].pathname
          }

          this.setState({ prev, next })
          return
        }
      })
    }
  }

  scrollToHash = () => {
    setTimeout(() => {
      if (this.props.location.hash) {
        if (this.scroll) {
          const hash = decodeURIComponent(this.props.location.hash)
          this.handleHeadClick(hash)
        } else {
          const id = decodeURIComponent(this.props.location.hash).slice(1)
          const element = document.getElementById(id)
          element && element.scrollIntoView()
        }
      }
    }, 0)
  }

  getChildContext() {
    return {
      location: this.props.location,
    }
  }

  handleExpand = () => {
    this.setState(({ isExpand }) => ({
      isExpand: !isExpand,
    }))
  }

  handleClick = e => {
    if (this.markdownRef && this.markdownRef.contains(e.target)) {
      this.setState({ isExpand: false })
    }
  }

  handleHeadClick = head => {
    this.scroll.animateScroll(document.querySelector(head), null, {
      offset: 100,
    })
  }

  handleSearch = query => {
    const results = this.getSearchResults(`title:*${query}* head:*${query}*`)
    this.setState({
      results: [...results].reverse(),
      showSearchResult: true,
    })
  }

  hideSearch = () => {
    this.setState({
      query: '',
      results: [],
      showSearchResult: false,
    })
  }

  handleQueryChange = query => {
    this.setState({ query })
  }

  getSearchResults(query) {
    const postNode = this.props.data.postBySlug
    const index = `${postNode.fields.version}_${postNode.fields.language}`
    if (!query || !window.__LUNR__) return []
    const lunrIndex = window.__LUNR__[index]
    const results = lunrIndex.index.search(query)
    return results.map(({ ref }) => lunrIndex.store[ref])
  }

  render() {
    const { slug } = this.props.pathContext
    const postNode = this.props.data.postBySlug

    const post = postNode.frontmatter
    if (!post.id) {
      post.id = slug
    }

    const {
      isExpand,
      query,
      showSearchResult,
      results,
      prev,
      next,
    } = this.state

    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${
            this.props.data.site.siteMetadata.title
          }`}</title>
        </Helmet>
        <BodyGrid>
          <NavContainer isExpand={isExpand}>
            <Versions
              versions={this.props.data.site.siteMetadata.versions}
              current={postNode.fields.version}
            />
            <ToCContainer
              innerRef={ref => {
                this.tocRef = ref
              }}
            >
              <TableOfContents
                chapters={
                  this.props.data.tableOfContents.edges[0].node.chapters
                }
              />
            </ToCContainer>
          </NavContainer>
          <MainContainer isExpand={isExpand}>
            <Header
              query={query}
              isExpand={isExpand}
              onSearch={this.handleSearch}
              toggleExpand={this.handleExpand}
              onQueryChange={this.handleQueryChange}
            />
            <MarkdownWrapper>
              <MarkdownBody
                className="md-body"
                innerRef={ref => {
                  this.markdownRef = ref
                }}
              >
                <MarkdownTitle>{post.title}</MarkdownTitle>
                <div
                  ref={ref => {
                    this.markdownRef = ref
                  }}
                  dangerouslySetInnerHTML={{ __html: postNode.html }}
                />
              </MarkdownBody>
              <FooterWrapper>
                <Footer prev={prev} next={next} />
              </FooterWrapper>
            </MarkdownWrapper>
            <HeadingsWrapper>
              <Headings
                title={postNode.frontmatter.title}
                headings={postNode.headings}
                current={this.props.location.hash}
                onHeadClick={this.handleHeadClick}
              />
            </HeadingsWrapper>
          </MainContainer>
        </BodyGrid>
        <SearchResult
          query={query}
          results={results}
          visible={showSearchResult}
          onCancel={this.hideSearch}
          onSearch={this.handleSearch}
          onQueryChange={this.handleQueryChange}
        />
      </div>
    )
  }
}

const BodyGrid = styled.div`
  overflow-x: hidden;
`

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: #242e42;
  box-shadow: 4px 0 8px 0 rgba(101, 125, 149, 0.2);
  transition: left 0.2s ease-in-out;
  overflow-y: auto;
  color: #fff;
  z-index: 2;

  @media only screen and (max-width: 768px) {
    left: ${({ isExpand }) => {
      return isExpand ? 0 : '-290px'
    }};
  }
`

const MainContainer = styled.div`
  margin-left: 280px;

  & > div {
    margin: auto;
  }

  & > h1 {
    color: #303e5a;
  }

  @media only screen and (max-width: 768px) {
    width: 100vw;
    margin-left: ${({ isExpand }) => {
      return isExpand ? '280px' : '0'
    }};
    transition: margin-left 0.2s ease-in-out;
  }
`

const ToCContainer = styled.div`
  padding: 40px 0;
`

const MarkdownWrapper = styled.div`
  padding-right: 280px;

  @media only screen and (max-width: 1280px) {
    padding-right: 0;
  }
`

const MarkdownBody = styled.div`
  margin: 0 auto;
  padding: 120px 30px 30px;

  @media only screen and (max-width: 768px) {
    padding: 100px 24px 24px;
  }
`

const HeadingsWrapper = styled.div`
  position: fixed;
  top: 120px;
  right: 20px;
  height: calc(100vh - 120px);
  overflow-y: auto;
  box-shadow: -1px 0 0 0 #d5dee7;

  @media only screen and (max-width: 1280px) {
    display: none;
  }
`

const MarkdownTitle = styled.h1``

const FooterWrapper = styled.div`
  max-width: 1217px;
  padding: 0 30px;
  margin: 0 auto;
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
  }
  query MarkdownBySlug($slug: String!, $id: String!, $version: String!) {
    site {
      siteMetadata {
        title
        versions {
          label
          value
        }
      }
    }
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
      headings {
        value
        depth
      }
      fields {
        version
        language
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

/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import classnames from 'classnames'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import * as tocbot from 'tocbot'

import Layout from '../layouts'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Versions from '../components/Versions'
import TableOfContents from '../components/TableOfContents/index'
import WithI18next from '../components/WithI18next'

import './markdown.css'
import './b16-tomorrow-dark.css'

class MarkdownTemplate extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      isExpand: false,
      prev: {},
      next: {},
    }
  }

  componentDidMount() {
    const { lang } = this.props.pageContext
    const version = get(this, 'props.data.site.siteMetadata.versions[0].value')

    document.addEventListener('click', this.handleClick)

    if (
      this.markdownRef &&
      !this.scroll &&
      typeof SmoothScroll !== 'undefined'
    ) {
      this.scroll = new SmoothScroll('a[href*="#"]', {
        offset: 100,
      })
    }

    this.scrollToHash()

    this.getPrevAndNext()

    if (this.markdownRef) {
      const viewer = new Viewer(this.markdownRef, {
        rotatable: false,
        scalable: false,
        transition: false,
      })

      this.viewer = viewer
    }

    if (typeof docsearch !== 'undefined') {
      docsearch({
        apiKey: '221332a85783d16a5b930969fe4a934a',
        indexName: 'kubesphere',
        inputSelector: '.ks-search > input',
        algoliaOptions: {
          facetFilters: [`lang:${lang}`, `version:${version}`],
        },
        transformData: function(hits) {
          hits.forEach(hit => {
            if (
              typeof window !== undefined &&
              process.env.NODE_ENV !== 'development'
            ) {
              hit.url = hit.url.replace('kubesphere.io', window.location.host)
            }
          })
          return hits
        },
        debug: false,
      })
    }

    this.setLinkTargetBlank()

    tocbot.init({
      // Where to render the table of contents.
      tocSelector: '.toc',
      // Where to grab the headings to build the table of contents.
      contentSelector: '.md-body',
      // Which headings to grab inside of the contentSelector element.
      headingSelector: 'h2, h3',
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
    })
  }

  componentDidUpdate() {
    this.setLinkTargetBlank()
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick)
    if (this.viewer) {
      this.viewer.destroy()
    }

    tocbot.destroy()
  }

  setLinkTargetBlank() {
    const { defaultLocale } = this.props.pageContext
    const $links = document.querySelectorAll('.md-body a')
    Array.prototype.forEach.call($links, el => {
      el.setAttribute('target', '_blank')
      const url = el.getAttribute('href')
      if (url && !/^http(s?):\/\//.test(url)) {
        el.setAttribute('href', url.replace(`/${defaultLocale}`, ''))
      }
    })
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
      if (this.state.isExpand) {
        this.setState({ isExpand: false })
      }
    }
  }

  handleHeadClick = head => {
    this.scroll.animateScroll(document.querySelector(head), null, {
      offset: 100,
    })
  }

  handleQueryChange = query => {
    this.setState({ query })
  }

  render() {
    const { slug, lang, defaultLocale } = this.props.pageContext
    const postNode = this.props.data.postBySlug
    const pathPrefix = this.props.data.site.pathPrefix

    const excerpt = postNode.excerpt
    const post = postNode.frontmatter
    if (!post.id) {
      post.id = slug
    }

    const { t } = this.props
    const { isExpand, prev, next } = this.state

    const metas = []

    if (post.description || excerpt) {
      metas.push({ name: 'description', content: post.description || excerpt })
    }
    if (post.keywords) {
      metas.push({ name: 'keywords', content: post.keywords })
    }

    const html = pathPrefix
      ? postNode.html.replace(
          /"(\/.*\.(svg|png|jpg|jpeg|gif))/g,
          `"${pathPrefix}$1`
        )
      : postNode.html

    const latestVersion = get(
      this,
      'props.data.site.siteMetadata.versions[0].value'
    )

    console.log(slug.slice(
      1,
      slug.length - 1
    ))

    return (
      <>
        <Layout data={this.props.data}>
          <div>
            <Helmet
              title={`${post.title} | ${
                this.props.data.site.siteMetadata.title
              }`}
              meta={metas}
            >
              <link
                rel="stylesheet"
                type="text/css"
                href="/asciinema-player.css"
              />
              <script src="/asciinema-player.js" />
            </Helmet>
            <BodyGrid>
              <NavContainer isExpand={isExpand}>
                <Versions
                  versions={this.props.data.site.siteMetadata.versions}
                  current={postNode.fields.version}
                  pathPrefix={pathPrefix}
                  lang={lang}
                />
                <ToCContainer
                  ref={ref => {
                    this.tocRef = ref
                  }}
                >
                  <TableOfContents
                    chapters={
                      this.props.data.tableOfContents.edges[0].node.chapters
                    }
                    defaultLocale={defaultLocale}
                  />
                  <ICP>KubeSphere®️ 2020 All Rights Reserved.</ICP>
                </ToCContainer>
              </NavContainer>
              <MainContainer isExpand={isExpand}>
                <Header
                  isExpand={isExpand}
                  placeholder={t('Quick search')}
                  toggleExpand={this.handleExpand}
                  pageContext={this.props.pageContext}
                  pathPrefix={pathPrefix}
                />
                <MarkdownWrapper>
                  <MarkdownBody
                    className={classnames('md-body', {
                      'md-en': postNode.fields.language === 'en',
                    })}
                    ref={ref => {
                      this.markdownRef = ref
                    }}
                  >
                    <MarkdownTitle>{post.title}</MarkdownTitle>
                    <MarkdownEditTip
                      href={`https://github.com/kubesphere/docs.kubesphere.io/edit/release-${latestVersion.slice(1)}/content/${slug.slice(
                        1,
                        slug.length - 1
                      )}.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('Edit')}
                    </MarkdownEditTip>
                    <div
                      ref={ref => {
                        this.markdownRef = ref
                      }}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </MarkdownBody>
                  <FooterWrapper>
                    <Footer prev={prev} next={next} />
                  </FooterWrapper>
                </MarkdownWrapper>
                <HeadingsWrapper>
                  <div className="toc" />
                </HeadingsWrapper>
              </MainContainer>
            </BodyGrid>
          </div>
        </Layout>
        <script src={`${pathPrefix}/smooth-scroll.polyfills.min.js`} />
      </>
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

  @media only screen and (max-width: 1440px) {
    width: 240px;
  }

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

  @media only screen and (max-width: 1440px) {
    margin-left: 240px;
  }

  @media only screen and (max-width: 768px) {
    width: 100vw;
    margin-left: ${({ isExpand }) => {
      return isExpand ? '240px' : '0'
    }};
    transition: margin-left 0.2s ease-in-out;
  }
`

const ToCContainer = styled.div`
  position: relative;
  padding: 40px 0 60px 0;
  min-height: calc(100vh - 92px);
`

const MarkdownWrapper = styled.div`
  padding-right: 280px;

  @media only screen and (max-width: 1440px) {
    padding-right: 240px;
  }

  @media only screen and (max-width: 1280px) {
    padding-right: 0;
  }
`

const MarkdownEditTip = styled.a`
  position: absolute;
  top: 136px;
  right: 20px;
  transform: translateY(-50%);
  font-size: 14px !important;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const MarkdownBody = styled.div`
  position: relative;
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

  @media only screen and (max-width: 1440px) {
    right: 10px;
  }

  @media only screen and (max-width: 1280px) {
    display: none;
  }

  .toc {
    ul,
    ol {
      list-style: none;
    }

    li {
      margin-bottom: 0;
    }

    .node-name--H2,
    .node-name--H3 {
      display: block;
      width: 260px;
      height: 24px;
      padding-left: 20px;
      font-size: 12px;
      line-height: 1.71;
      color: rgb(48, 62, 90);
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media only screen and (max-width: 1440px) {
        width: 240px;
      }

      &:hover {
        color: #55bc8a;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      &.is-active-link {
        color: #55bc8a;
        font-weight: 500;
      }
    }

    .node-name--H3 {
      padding-left: 40px;
    }
  }
`

const MarkdownTitle = styled.h1``

const FooterWrapper = styled.div`
  max-width: 1217px;
  padding: 0 30px;
  margin: 0 auto;
`

const ICP = styled.div`
  position: absolute;
  padding: 20px 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
`

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query MarkdownBySlug($slug: String!, $lang: String!) {
    site {
      pathPrefix
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
      excerpt
      frontmatter {
        title
        keywords
        description
      }
      fields {
        language
      }
    }
    tableOfContents: allContentJson(filter: { lang: { eq: $lang } }) {
      edges {
        node {
          lang
          chapters {
            title
            chapters {
              title
              tag
              entry
              entries {
                title
                entry
              }
            }
          }
        }
      }
    }
  }
`

export default WithI18next({ ns: 'common' })(MarkdownTemplate)

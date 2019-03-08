import React from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import cheerio from 'cheerio'

import './markdown.css'
import './prince.css'
import './b16-tomorrow-dark.css'

export default class MarkdownTemplate extends React.Component {
  renderEntry(entry) {
    let content = entry.childMarkdownRemark.html

    if (typeof window === 'undefined') {
      const $ = cheerio.load(content)

      $('a').each(function(i, ele) {
        if (
          $(this)
            .attr('href')
            .indexOf('../') !== -1
        ) {
          $(this).attr('href', `#${encodeURIComponent($(this).text())}`)
        }
      })

      content = $.html()
    }

    return (
      <MarkdownBody className="md-body" key={entry.childMarkdownRemark.id}>
        <h1 id={entry.childMarkdownRemark.frontmatter.title}>
          {entry.childMarkdownRemark.frontmatter.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </MarkdownBody>
    )
  }

  renderChapter(chapter, level = 1) {
    if (chapter.chapters) {
      return (
        <div key={chapter.title}>
          <div className={`h${level}`} id={chapter.title}>
            {chapter.title}
          </div>
          {chapter.chapters.map(_chapter =>
            this.renderChapter(_chapter, level + 1)
          )}
        </div>
      )
    }

    if (chapter.entries) {
      return (
        <div key={chapter.title}>
          <div className={`h${level}`} id={chapter.title}>
            {chapter.title}
          </div>
          {chapter.entries.map(entry => this.renderEntry(entry.entry))}
        </div>
      )
    }

    return (
      <div key={chapter.title}>
        {level === 1 && (
          <div className="h1" id={chapter.title}>
            {chapter.title}
          </div>
        )}
        {chapter.entry && this.renderEntry(chapter.entry)}
      </div>
    )
  }

  render() {
    const { tableOfContents, site } = this.props.data

    const version = site.siteMetadata.versions.find(
      version => version.value === tableOfContents.edges[0].node.version
    ) || {}

    return (
      <div className="markdown-all">
        <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href="/PingFangSC/stylesheet.css"
          />
          <script>{`
            document.body.style.backgroundColor = 'white'
          `}</script>
        </Helmet>
        <div className="first-page">KubeSphere 文档 {version.label}</div>
        {tableOfContents.edges[0].node.chapters.map(chapter =>
          this.renderChapter(chapter)
        )}
      </div>
    )
  }
}

const MarkdownBody = styled.div`
  margin: 0 auto;
  padding: 12px 0;
`

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  fragment ChildMarkdownRemark2 on MarkdownRemark {
    id
    html
    frontmatter {
      title
    }
  }
  query MarkdownByVersion($lang: String!, $version: String!) {
    site {
      siteMetadata {
        title
        versions {
          label
          value
        }
      }
    }
    tableOfContents: allContentJson(
      filter: { version: { eq: $version }, lang: { eq: $lang } }
    ) {
      edges {
        node {
          version
          lang
          chapters {
            title
            entry {
              childMarkdownRemark {
                ...ChildMarkdownRemark2
              }
            }
            entries {
              entry {
                childMarkdownRemark {
                  ...ChildMarkdownRemark2
                }
              }
            }
            chapters {
              title
              entry {
                childMarkdownRemark {
                  ...ChildMarkdownRemark2
                }
              }
              entries {
                entry {
                  childMarkdownRemark {
                    ...ChildMarkdownRemark2
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

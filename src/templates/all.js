import React from 'react'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import cheerio from 'cheerio'

import Layout from '../layouts/index'

import './markdown.css'
import './prince.css'
import './b16-tomorrow-dark.css'

export default class MarkdownTemplate extends React.Component {
  renderEntry(pathPrefix, entry, title) {
    const { allMarkdowns } = this.props.data
    let content = allMarkdowns.edges.find(
      edge => edge.node.fields.slug === `${entry}/`
    )

    content = get(content, 'node.html')

    if (content && typeof window === 'undefined') {
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

      content = $.html().replace(
        /"(\/.*\.(svg|png|jpg|jpeg|gif))/g,
        `"${pathPrefix}$1`
      )
    }

    return (
      <MarkdownBody className="md-body" key={title}>
        <h1 id={entry}>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </MarkdownBody>
    )
  }

  renderChapter(pathPrefix, chapter, level = 1) {
    if (chapter.chapters) {
      return (
        <div key={chapter.title}>
          <div className={`h${level}`} id={chapter.title}>
            {chapter.title}
          </div>
          {chapter.chapters.map(_chapter =>
            this.renderChapter(pathPrefix, _chapter, level + 1)
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
          {chapter.entries.map(entry =>
            this.renderEntry(pathPrefix, entry.entry, entry.title)
          )}
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
        {chapter.entry &&
          this.renderEntry(pathPrefix, chapter.entry, chapter.title)}
      </div>
    )
  }

  render() {
    const { tableOfContents, site } = this.props.data

    const version = get(this, 'props.data.site.siteMetadata.versions[0]', {})

    return (
      <Layout data={this.props.data}>
        <div className="markdown-all">
          <Helmet>
            <link
              rel="stylesheet"
              type="text/css"
              href={`${site.pathPrefix}/PingFangSC/stylesheet.css`}
            />
            <script>{`
            document.body.style.backgroundColor = 'white'
          `}</script>
          </Helmet>
          <div className="first-page">KubeSphere 文档 {version.label}</div>
          {tableOfContents.edges[0].node.chapters.map(chapter =>
            this.renderChapter(site.pathPrefix, chapter)
          )}
        </div>
      </Layout>
    )
  }
}

const MarkdownBody = styled.div`
  margin: 0 auto;
  padding: 12px 0;
`

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query MarkdownByVersion($lang: String!) {
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
    allMarkdowns: allMarkdownRemark(
      filter: { fields: { language: { eq: $lang } } }
    ) {
      edges {
        node {
          html
          fields {
            slug
            language
          }
        }
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

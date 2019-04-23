import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import get from 'lodash/get'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import { translate } from 'react-i18next'

import { getLanguage } from '../utils'

import Logo from '../components/Logo'
import Select from '../components/Select'
import Search from '../components/Search'
import SearchResult from '../components/SearchResult'
import Language from '../components/Language'

import { ReactComponent as RoadMapIcon } from '../assets/icon-roadmap.svg'
import { ReactComponent as ChatIcon } from '../assets/icon-chat.svg'
import { ReactComponent as BugIcon } from '../assets/icon-bug.svg'
import { ReactComponent as DownloadIcon } from '../assets/download.svg'

class IndexPage extends React.Component {
  state = {
    query: '',
    results: [],
    showSearchResult: false,
    selectVersion: this.props.data.site.siteMetadata.versions[0],
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
    const { selectVersion } = this.state
    const { i18n } = this.props

    const index = `${selectVersion.value}_${getLanguage(i18n.language)}`

    if (!query || !window.__LUNR__) return []
    const lunrIndex = window.__LUNR__[index]
    const results = lunrIndex.index.search(query)
    return results.map(({ ref }) => lunrIndex.store[ref])
  }

  handleVersionChange = value => {
    this.setState({ selectVersion: value })
  }

  render() {
    const { query, results, showSearchResult, selectVersion } = this.state
    return (
      <div>
        <Header
          {...this.props}
          query={query}
          onSearch={this.handleSearch}
          onQueryChange={this.handleQueryChange}
        />
        <Content
          {...this.props}
          selectVersion={selectVersion}
          onVersionChange={this.handleVersionChange}
        />
        <Footer t={this.props.t} />
        <SearchResult
          query={query}
          results={results}
          visible={showSearchResult}
          onCancel={this.hideSearch}
          onSearch={this.handleSearch}
          onQueryChange={this.handleQueryChange}
          t={this.props.t}
        />
      </div>
    )
  }
}

export default translate('base')(IndexPage)

const Header = ({ t, query, onSearch, onQueryChange }) => (
  <HeaderWrapper>
    <LogoWrapper>
      <Logo />
    </LogoWrapper>
    <Wrapper>
      <h1>{t('Welcome to the KubeSphere Documentation')}</h1>
      <p>
        {t(
          'We will introduce the services and features of KubeSphere with clear and concise pictures and texts as far as possible.'
        )}
      </p>
      <div style={{ textAlign: 'center' }}>
        <Search
          placeholder={t('Enter keywords to get help quickly')}
          query={query}
          onSearch={onSearch}
          onQueryChange={onQueryChange}
        />
      </div>
    </Wrapper>
  </HeaderWrapper>
)

const Versions = ({ t, current, versions, onChange }) => {
  const handleDownload = current => {
    const a = document.createElement('a')
    a.target = '_blank'
    a.download = `KubeSphere-${current.value}.pdf`
    a.href = `${window.location.origin}/KubeSphere-${current.value}.pdf`
    a.click()
  }

  return (
    <VersionsWrapper>
      <Wrapper>
        <div className="version-text">
          <div>
            {t('The current document is available for')} KubeSphere {current.label}
          </div>
          <p>
            {t(
              'The following provides the current version of the documentation, if you need other versions of the document please switch on the right.'
            )}
          </p>
        </div>
        <div className="version-select">
          <Select
            defaultValue={current}
            options={versions}
            onChange={onChange}
          />
          <Tooltip
            style={{ marginLeft: 12 }}
            title={`${t('Download')} ${current.label} ${t('offline document')}`}
            position="top"
            distance={16}
            arrow
          >
            <Button onClick={() => handleDownload(current)}>
              <DownloadIcon />
            </Button>
          </Tooltip>
        </div>
      </Wrapper>
    </VersionsWrapper>
  )
}

const getTitleLink = chapter => {
  const entry =
    get(chapter, 'entry') ||
    get(chapter, 'entries[0].entry') ||
    get(chapter, 'chapters[0].entry') ||
    get(chapter, 'chapters[0].entries[0].entry') ||
    {}

  return get(entry, 'childMarkdownRemark.fields.slug', '')
}

const Documents = ({ tableOfContent }) => (
  <DocumentWrapper>
    <Wrapper>
      <ul className="chapter-list">
        {tableOfContent.node.chapters.map((chapter, index) => {
          return (
            <li key={index}>
              <h3>
                {chapter.icon && <img src={chapter.icon} alt="" />}
                <Link to={getTitleLink(chapter)}>{chapter.title}</Link>
                {chapter.tag && <Tag>{chapter.tag}</Tag>}
              </h3>
              {chapter.desc && <p>{chapter.desc}</p>}
              {chapter.chapters && (
                <ul className="sub-chapter-list">
                  {chapter.chapters.map(subChapter => (
                    <li key={subChapter.title}>
                      <Link to={getTitleLink(subChapter)}>
                        {subChapter.title}
                      </Link>
                      {subChapter.tag && <Tag>{subChapter.tag}</Tag>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Wrapper>
  </DocumentWrapper>
)

const Content = props => {
  const lang = getLanguage(props.i18n.language)
  const tableOfContent = props.data.allContentJson.edges.find(
    edge =>
      edge.node.version === props.selectVersion.value && edge.node.lang === lang
  )

  return (
    <ContentWrapper>
      <Versions
        current={props.selectVersion}
        versions={props.data.site.siteMetadata.versions}
        onChange={props.onVersionChange}
        t={props.t}
      />
      {tableOfContent && <Documents tableOfContent={tableOfContent} />}
    </ContentWrapper>
  )
}

const Footer = ({ t }) => {
  return (
    <FooterWrapper>
      <Wrapper>
        <ul>
          <li>
            <h3>
              <RoadMapIcon />
              {t('Get')} KubeSphere
            </h3>
            <p>
              {t('Recommend you to download and use the latest free')}{' '}
              <a href="https://kubesphere.io/download">{t('KubeSphere Advanced Edition')}</a>{' '}
            </p>
          </li>
          <li>
            <h3>
              <BugIcon />
              {t('Report the Bug')}
            </h3>
            <p>
            {t('KubeSphere uses')}{' '}
              <a href="https://github.com/kubesphere/kubesphere/issues">
                GitHub issue
              </a>{' '}
              {t('to manage bug tracking')}
            </p>
          </li>
          <li>
            <h3>
              <ChatIcon />
              {t('Communication')}
            </h3>
            <p>
              {t('Find us on the Slack channel')}:{' '}
              <a href="https://kubesphere.slack.com" target="_blank">
                kubesphere.slack.com
              </a>
            </p>
          </li>
        </ul>
        <LanguageWrapper>
          <Language />
        </LanguageWrapper>
        <p className="icp">KubeSphere®️ 2019 All Rights Reserved.</p>
      </Wrapper>
    </FooterWrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  max-width: 1160px;
  margin: 0 auto;
`

const LogoWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 200;
`

const HeaderWrapper = styled.div`
  position: relative;
  padding-top: 106px;
  padding-bottom: 60px;
  text-align: center;

  @media only screen and (max-width: 768px) {
    padding-left: 24px;
    padding-right: 24px;
  }

  h1 {
    margin-bottom: 8px;
    font-size: 32px;
    font-weight: 500;
    text-shadow: 0 8px 16px rgba(35, 45, 65, 0.16);
    line-height: 1.75;
    color: #303e5a;
  }

  p {
    line-height: 1.43;
    color: #657d95;
  }

  .ks-search input {
    width: 588px;
    font-size: 16px;
    line-height: 2;
    color: #657d95;
    background-color: #f5f8f9;
    padding: 6px 30px 6px 52px;
    border-radius: 22px;
    transition: all 0.2s ease-in-out;

    @media only screen and (max-width: 768px) {
      width: calc(100vw - 40px);
    }

    &:hover {
      background-color: #f4f4f4;
    }

    &:focus {
      background-color: #fff;
    }
  }
`

const ContentWrapper = styled.div`
  background-color: #fff;
  box-shadow: 0 1px 0 0 #e4ebf1;
`

const VersionsWrapper = styled.div`
  padding: 16px 0;
  box-shadow: 0 1px 0 0 #d5dee7, 0 -1px 0 0 #d5dee7;
  background-color: #ffffff;

  @media only screen and (max-width: 768px) {
    padding: 12px 0;
    height: 62px;
  }

  .version-text {
    @media only screen and (max-width: 768px) {
      display: none;
    }

    div {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.75;
      color: #303e5a;
    }

    p {
      font-size: 12px;
      line-height: 2;
      letter-spacing: 0.4px;
      color: #657d95;
      margin-bottom: 0;
    }
  }

  .version-select {
    float: right;
    margin-top: -42px;

    @media only screen and (max-width: 768px) {
      float: none;
      margin-top: 0;
      margin-right: 24px;
      text-align: right;
    }
  }
`

const DocumentWrapper = styled.div`
  padding: 80px 0;
  border: solid 0 #e4ebf1;
  border-top-width: 1px;
  background-color: #ffffff;

  @media only screen and (max-width: 768px) {
    padding: 40px 24px;
  }

  .chapter-list {
    list-style: none;

    & > li {
      h3 {
        position: relative;
        padding-left: 32px;
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.75;
        color: #303e5a;

        a {
          color: #303e5a;
          transition: all 0.2s ease-in-out;

          &:hover {
            color: #00aa72;
          }
        }

        img {
          position: absolute;
          top: 50%;
          left: 4px;
          transform: translateY(-50%);
          margin-bottom: 0;
        }
      }

      p {
        font-size: 12px;
        line-height: 2;
        letter-spacing: 0.4px;
        color: #657d95;
        margin-bottom: 4px;
      }

      & + li {
        margin-top: 40px;
      }
    }
  }

  .sub-chapter-list {
    list-style: none;

    & > li {
      display: inline-block;
      padding-right: 20px;
      margin: 4px 20px 4px 0;
      border-right: solid 1px #d5dee7;

      @media only screen and (max-width: 768px) {
        margin: 12px 20px 12px 0;
      }

      &:first-of-type {
        padding-left: 0;
      }

      &:last-of-type {
        padding-right: 0;
        border-right: none;
      }

      a {
        font-size: 14px;
        color: #485b7f;
        transition: all 0.2s ease-in-out;

        &:hover {
          color: #00aa72;
        }
      }
    }
  }
`

const FooterWrapper = styled.div`
  ul {
    list-style: none;
    padding: 80px 0;

    @media only screen and (max-width: 768px) {
      padding: 40px 24px;
    }

    & > li {
      display: inline-block;
      width: calc(33% - 66px);
      vertical-align: top;

      @media only screen and (max-width: 768px) {
        display: block;
        width: 100%;
        margin-bottom: 1.5rem;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.75;
        color: #303e5a;
        margin-bottom: 0;

        svg {
          width: 28px;
          height: 28px;
          margin-right: 12px;
          vertical-align: top;
        }
      }

      p {
        height: 48px;
        font-size: 12px;
        line-height: 2;
        letter-spacing: 0.4px;
        color: #657d95;
        margin-bottom: 0;

        a {
          font-family: Monaco;
          color: #65c194;
        }
      }

      & + li {
        margin-left: 100px;

        @media only screen and (max-width: 768px) {
          margin-left: 0;
        }
      }
    }
  }

  .icp {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    font-family: Proxima Nova;
    line-height: 1.43;
    letter-spacing: 1.1px;
    color: #242e42;
  }
`

const Button = styled.a`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #1d2b3a;
  padding: 8px;
  cursor: pointer;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
  }

  &:active {
    & > svg {
      opacity: 0.5;
    }
  }
`

const Tag = styled.span`
  display: inline-block;
  height: 20px;
  margin-left: 8px;
  padding: 0 13px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.67;
  color: #ffffff;
  border-radius: 10px;
  background-color: #f5a623;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.01),
    rgba(0, 0, 0, 0.05)
  );
`

const LanguageWrapper = styled.div`
  margin-bottom: 36px;
  text-align: left;

  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`

export const query = graphql`
  fragment ChildRemark on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      title
    }
  }

  query Index {
    site {
      siteMetadata {
        title
        versions {
          label
          value
        }
      }
    }
    allContentJson {
      edges {
        node {
          version
          lang
          chapters {
            title
            icon
            desc
            entry {
              id
              childMarkdownRemark {
                ...ChildRemark
              }
            }
            entries {
              entry {
                id
                childMarkdownRemark {
                  ...ChildRemark
                }
              }
            }
            chapters {
              title
              tag
              entry {
                id
                childMarkdownRemark {
                  ...ChildRemark
                }
              }
              entries {
                entry {
                  id
                  childMarkdownRemark {
                    ...ChildRemark
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

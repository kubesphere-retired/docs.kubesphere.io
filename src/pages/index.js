import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import get from 'lodash/get'

import Search from '../components/Search'
import Select from '../components/Select'
import SearchResult from '../components/SearchResult'

import { ReactComponent as LogoIcon } from '../assets/logo.svg'
import { ReactComponent as RoadMapIcon } from '../assets/icon-roadmap.svg'
import { ReactComponent as ChatIcon } from '../assets/icon-chat.svg'
import { ReactComponent as BugIcon } from '../assets/icon-bug.svg'

export default class IndexPage extends React.Component {
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

    const index = `${selectVersion.value}_zh-CN`

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
        <Footer />
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

const Logo = () => (
  <LogoWrapper>
    <a href="https://kubesphere.io/" target="_blank">
      <LogoIcon className="logo" />
    </a>
    <p>文档中心</p>
  </LogoWrapper>
)

const Header = ({ query, onSearch, onQueryChange }) => (
  <HeaderWrapper>
    <Logo />
    <Wrapper>
      <h1>欢迎使用 KubeSphere 文档</h1>
      <p>
        欢迎阅读 KubeSphere 文档，我们尽可能以清晰简明的图文，介绍 KubeSphere
        各项服务及使用方法。
      </p>
      <div style={{ textAlign: 'center' }}>
        <Search
          placeholder="输入关键字快速获取帮助"
          query={query}
          onSearch={onSearch}
          onQueryChange={onQueryChange}
        />
      </div>
    </Wrapper>
  </HeaderWrapper>
)

const Versions = ({ current, versions, onChange }) => (
  <VersionsWrapper>
    <Wrapper>
      <div className="version-text">
        <div>当前文档适用于 KubeSphere {current.label}</div>
        <p>
          这里将提供适用于当前版本的帮助文档，如果需要其它版本文档请选择右侧版本
        </p>
      </div>
      <Select
        className="version-select"
        defaultValue={current}
        options={versions}
        onChange={onChange}
      />
    </Wrapper>
  </VersionsWrapper>
)

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
              </h3>
              {chapter.desc && <p>{chapter.desc}</p>}
              {chapter.chapters && (
                <ul className="sub-chapter-list">
                  {chapter.chapters.map(subChapter => (
                    <li key={subChapter.title}>
                      <Link to={getTitleLink(subChapter)}>
                        {subChapter.title}
                      </Link>
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
  const tableOfContent = props.data.allContentJson.edges.find(
    edge =>
      edge.node.version === props.selectVersion.value &&
      edge.node.lang === 'zh-CN'
  )

  return (
    <ContentWrapper>
      <Versions
        current={props.selectVersion}
        versions={props.data.site.siteMetadata.versions}
        onChange={props.onVersionChange}
      />
      {tableOfContent && <Documents tableOfContent={tableOfContent} />}
    </ContentWrapper>
  )
}

const Footer = () => {
  return (
    <FooterWrapper>
      <Wrapper>
        <ul>
          <li>
            <h3>
              <RoadMapIcon />
              获取 KubeSphere
            </h3>
            <p>我们提供了多种版本的 KubeSphere，您只需选择适合您的即可</p>
          </li>
          <li>
            <h3>
              <BugIcon />
              报告 Bug
            </h3>
            <p>
              KubeSphere 使用{' '}
              <a href="https://github.com/kubesphere/kubesphere/issues">
                GitHub issue
              </a>{' '}
              来管理 bug 跟踪
            </p>
          </li>
          <li>
            <h3>
              <ChatIcon />
              日常沟通
            </h3>
            <p>
              在 Slack 频道上找到我们:{' '}
              <a href="https://kubesphere.slack.com" target="_blank">
                kubesphere.slack.com
              </a>
            </p>
          </li>
        </ul>
        <p className="icp">© 2018 KubeSphere All rights reserved.</p>
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

  .logo {
    display: inline-block;
    vertical-align: middle;
    height: 32px;
    width: 150px;
  }

  p {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 0;
    margin-left: 30px;
    font-size: 16px;
    line-height: 1.75;
    color: #303e5a;

    &::before {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -14px;
      content: '|';
      color: #00aa72;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.75;
    }
  }
`

const HeaderWrapper = styled.div`
  position: relative;
  padding-top: 106px;
  padding-bottom: 60px;
  text-align: center;

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

  .version-text {
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
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }
`

const DocumentWrapper = styled.div`
  padding: 80px 0;
  border: solid 0 #e4ebf1;
  border-top-width: 1px;
  background-color: #ffffff;

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
      padding: 0 20px;
      margin: 4px 0;
      border-right: solid 1px #d5dee7;

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

    & > li {
      display: inline-block;
      width: calc(33% - 66px);
      vertical-align: top;

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
      }
    }
  }

  .icp {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #303e5a;
    margin-bottom: 33px;
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

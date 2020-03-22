/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Link from 'gatsby-link'
import get from 'lodash/get'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

import { getLanguage } from '../utils'

import Layout from '../layouts'
import Logo from '../components/Logo'
import Select from '../components/Select'
import Search from '../components/Search'
import Language from '../components/Language'
import WithI18next from '../components/WithI18next'

import { ReactComponent as RoadMapIcon } from '../assets/icon-roadmap.svg'
import { ReactComponent as ChatIcon } from '../assets/icon-chat.svg'
import { ReactComponent as BugIcon } from '../assets/icon-bug.svg'
import { ReactComponent as DownloadIcon } from '../assets/download.svg'

class IndexPage extends React.Component {
  state = {
    selectVersion: this.props.data.site.siteMetadata.versions[0],
  }

  componentDidMount() {
    const lang = getLanguage(this.props.pageContext.locale)
    const version = get(this, 'props.data.site.siteMetadata.versions[0].value')
    if (typeof docsearch !== 'undefined') {
      /* eslint-disable no-undef */
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
      /* eslint-enable no-undef */
    }
  }

  handleVersionChange = version => {
    const { locale } = this.props.pageContext
    const { versions } = this.props.data.site.siteMetadata
    const latestVersion = versions[0].value
    let host = 'kubesphere.io/docs/'
    if (version.value !== latestVersion) {
      host = version.value.replace('.', '-') + '.docs.' + host
    }
    window.location.href = `${window.location.protocol}//${host}${locale}`
  }

  render() {
    const { selectVersion } = this.state
    const pathPrefix = this.props.data.site.pathPrefix
    const { locale } = this.props.pageContext
    if (!locale) {
      if (typeof window !== 'undefined') {
        if (
          navigator.language.toLowerCase().indexOf('zh') !== -1 ||
          navigator.language.toLowerCase().indexOf('cn') !== -1
        ) {
          window.location.href = `${pathPrefix}/zh-CN/`
        } else {
          window.location.href = pathPrefix
        }
      }

      return null
    }

    return (
      <Layout data={this.props.data}>
        <div>
          <Header {...this.props} pathPrefix={pathPrefix} />
          <Content
            {...this.props}
            selectVersion={selectVersion}
            onVersionChange={this.handleVersionChange}
          />
          <Footer {...this.props} />
        </div>
      </Layout>
    )
  }
}

export default WithI18next({ ns: 'common' })(IndexPage)

const Header = ({ t, pageContext, pathPrefix }) => (
  <HeaderWrapper>
    <LogoWrapper>
      <Logo pageContext={pageContext} pathPrefix={pathPrefix} />
    </LogoWrapper>
    <Wrapper>
      <h1>{t('Welcome to the KubeSphere Documentation')}</h1>
      <p>
        {t(
          'We will introduce the services and features of KubeSphere with clear and concise pictures and texts as far as possible.'
        )}
      </p>
      <div>
        <Search placeholder={t('Enter keywords to get help quickly')} />
      </div>
    </Wrapper>
  </HeaderWrapper>
)

const getTitleLink = (chapter, defaultLocale) => {
  const entry =
    get(chapter, 'entry') ||
    get(chapter, 'entries[0].entry') ||
    get(chapter, 'chapters[0].entry') ||
    get(chapter, 'chapters[0].entries[0].entry') ||
    {}

  return `${entry}/`.replace(`/${defaultLocale}`, '').replace(/\/\//g, '/')
}

const Documents = ({ tableOfContent, pathPrefix, defaultLocale }) => (
  <DocumentWrapper>
    <Wrapper>
      <ul className="chapter-list">
        {tableOfContent.node.chapters.map((chapter, index) => {
          return (
            <li key={index}>
              <h3>
                {chapter.icon && (
                  <img
                    src={`${pathPrefix}${chapter.icon}`.replace(/\/\//g, '/')}
                    alt=""
                  />
                )}
                <Link to={getTitleLink(chapter, defaultLocale)}>
                  {chapter.title}
                </Link>
                {chapter.tag && <Tag>{chapter.tag}</Tag>}
              </h3>
              {chapter.desc && <p>{chapter.desc}</p>}
              {chapter.chapters && (
                <ul className="sub-chapter-list">
                  {chapter.chapters.map(subChapter => (
                    <li key={subChapter.title}>
                      <Link to={getTitleLink(subChapter, defaultLocale)}>
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

const Versions = ({ t, current, versions, onChange, pathPrefix }) => {
  const handleDownload = current => {
    const a = document.createElement('a')
    a.target = '_blank'
    a.download = `KubeSphere-${current.value}.pdf`
    a.href = `${window.location.origin}${pathPrefix}/KubeSphere-${
      current.value
    }.pdf`
    a.click()
  }

  return (
    <VersionsWrapper>
      <Wrapper>
        <div className="version-text">
          <div>
            {t('The current document is available for')} KubeSphere{' '}
            {current.label}
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
          {!current.isDev && (
            <Tooltip
              style={{ marginLeft: 12 }}
              title={`${t('Download')} ${current.label} ${t(
                'offline document'
              )}`}
              position="top"
              distance={16}
              arrow
            >
              <Button onClick={() => handleDownload(current)}>
                <DownloadIcon />
              </Button>
            </Tooltip>
          )}
        </div>
      </Wrapper>
    </VersionsWrapper>
  )
}

const Content = props => {
  const { locale, defaultLocale } = props.pageContext
  const lang = getLanguage(locale)
  const tableOfContent = props.data.allContentJson.edges.find(
    edge => edge.node.lang === lang
  )
  return (
    <ContentWrapper>
      <Versions
        current={props.selectVersion}
        versions={props.data.site.siteMetadata.versions}
        onChange={props.onVersionChange}
        pathPrefix={props.data.site.pathPrefix}
        t={props.t}
      />
      {tableOfContent && (
        <Documents
          tableOfContent={tableOfContent}
          pathPrefix={props.data.site.pathPrefix}
          defaultLocale={defaultLocale}
        />
      )}
    </ContentWrapper>
  )
}

const Footer = props => {
  const t = props.t
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
              <a href={`/${props.pageContext.locale}/install`}>KubeSphere</a>{' '}
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
              <a
                href="https://kubesphere.slack.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                kubesphere.slack.com
              </a>
            </p>
          </li>
        </ul>
        <LanguageWrapper>
          <Language {...props} pathPrefix={props.data.site.pathPrefix} />
        </LanguageWrapper>
        <p className="icp">KubeSphere®️ 2020 All Rights Reserved.</p>
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

  .ks-search {
    width: 588px;
    margin: 0 auto;
  }

  .ks-search > svg {
    left: 24px;
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
  query Index {
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
    allContentJson(filter: { lang: { ne: null } }) {
      edges {
        node {
          lang
          chapters {
            title
            icon
            desc
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

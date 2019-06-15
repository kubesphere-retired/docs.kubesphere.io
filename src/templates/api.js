import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Layout from '../layouts'
import Tabs from '../components/Tabs'

import { safeParseJSON } from '../utils'
import { ReactComponent as BlackLogo } from '../assets/logo-black.svg'
import { ReactComponent as RightArrow } from '../assets/right-arrow.svg'
import { ReactComponent as WhiteClose } from '../assets/close-white.svg'

import './api.css'

const Navs = ({ data, version, selected }) => (
  <div>
    <NavHeader>
      <BlackLogo width={24} height={24} />
      <span>API Docs</span>
    </NavHeader>
    <NavList>
      {data.map(item => (
        <NavItem key={item.name} selected={selected === item.name}>
          <a href={`/${version}/api/${item.name.toLowerCase()}`}>{item.name}</a>
          {item.groups && (
            <ul>
              {item.groups.map(group => (
                <li key={group.name}>
                  <a
                    href={`/${version}/api/${item.name.toLowerCase()}/#${
                      group.name
                    }`}
                  >
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </NavItem>
      ))}
    </NavList>
  </div>
)

const RequestParams = ({ data, definitions }) => (
  <ul>
    <li>
      <div className="left-pane">attribute</div>
      <div className="right-pane">description</div>
    </li>
    {data.parameters &&
      data.parameters.map(param => (
        <li key={param.name}>
          <div className="left-pane">
            <span>
              {param.name}
              &nbsp;
              {!param.required && <span className="text-dark">[optional]</span>}
            </span>
            <span className="text-dark">{param.type}</span>
            <span className="text-dark">({param.in})</span>
          </div>
          <div className="right-pane">
            <span className="text-dark">{param.description}</span>
            <span className="request-schema">
              {param.schema && (
                <BodyCode data={param.schema.$ref} definitions={definitions} />
              )}
            </span>
          </div>
        </li>
      ))}
  </ul>
)

const BodyCode = ({ data, definitions }) => {
  if (!data) {
    return null
  }

  const id = data.replace(/#\/definitions\//g, '')
  const definition = definitions[id]

  const value = Object.keys(definition.properties).reduce(
    (prev, cur) => ({ ...prev, [cur]: definition.properties[cur].type }),
    {}
  )

  return (
    <pre>
      <code>{JSON.stringify(value, null, 2)}</code>
    </pre>
  )
}

class Detail extends React.Component {
  constructor(props) {
    super(props)

    const statuses = Object.keys(this.props.data.responses).filter(
      key => key !== 'default'
    )

    this.state = {
      statuses,
      selectedStatus: statuses.includes(200) ? 200 : statuses[0],
    }
  }

  handleStatusChange = value => {
    this.setState({ selectedStatus: value })
  }

  render() {
    const { statuses, selectedStatus } = this.state
    const { data, definitions, onClose } = this.props

    return (
      <DetailWrapper className="detail">
        <div className="detail-content">
          <div className="detail-summary">{data.summary}</div>
          <div className="detail-path">
            <Tag className={`tag tag-${data.method}`}>
              {data.method.toUpperCase()}
            </Tag>
            <span>{data.path}</span>
          </div>
          <div className="detail-section">
            <div className="section-title">Parameters</div>
            <div className="section-content">
              <RequestParams data={data} definitions={definitions} />
            </div>
          </div>
          <div className="detail-section">
            <div className="section-title">Responses</div>
            <div className="section-content">
              <Tabs
                options={statuses}
                value={selectedStatus}
                onChange={this.handleStatusChange}
              />
              <div className="sub-title">body</div>
              <div className="response-schema">
                {data.responses[selectedStatus].schema && (
                  <BodyCode
                    data={data.responses[selectedStatus].schema.$ref}
                    definitions={definitions}
                  />
                )}
              </div>
              <div className="sub-title">headers</div>
              <HeaderCode>{data.produces.join('; ')}</HeaderCode>
            </div>
          </div>
        </div>
        <WhiteClose width={32} height={32} onClick={onClose} />
      </DetailWrapper>
    )
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      detail: {},
    }
  }

  showDetail = item => {
    this.setState({ detail: item })
  }

  handleClose = () => {
    this.setState({ detail: {} })
  }

  render() {
    const { detail } = this.state
    const showDetail = detail && detail.method

    return (
      <div
        ref={ref => {
          this.mainRef = ref
        }}
      >
        <MainContent showDetail={showDetail}>
          {this.props.groups.map(group => (
            <Group id={group.name} key={group.name}>
              <GroupTitle>
                <h4>{group.name}</h4>
                <p>{group.description}</p>
              </GroupTitle>
              <GroupContent>
                {this.props.data
                  .filter(item => item.tags.includes(group.name))
                  .map((item, index) => (
                    <Item
                      className="item"
                      key={`${item.method}-${item.path}}`}
                      deprecate={item.deprecate}
                      selected={
                        detail.method === item.method &&
                        detail.path === item.path
                      }
                      onClick={this.showDetail.bind(this, item)}
                    >
                      <div className="item-summary">{item.summary}</div>
                      <div className="item-path">
                        <Tag className={`tag tag-${item.method}`}>
                          {item.method.toUpperCase()}
                        </Tag>
                        <span>{item.path}</span>
                      </div>
                      <RightArrow width={20} height={20} />
                    </Item>
                  ))}
              </GroupContent>
            </Group>
          ))}
        </MainContent>
        {showDetail && (
          <Detail
            data={detail}
            definitions={this.props.definitions}
            onClose={this.handleClose}
          />
        )}
      </div>
    )
  }
}

class APIDocTemplate extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: safeParseJSON(props.pageContext.content, {}),
      navs: safeParseJSON(props.pageContext.chapters, []),
      chapter: safeParseJSON(props.pageContext.chapter, []),
      definitions: safeParseJSON(props.pageContext.definitions, {}),
    }
  }

  render() {
    const { version } = this.props.pageContext
    const { content, definitions, navs, chapter } = this.state

    return (
      <Layout data={this.props.data}>
        <Wrapper>
          <NavWrapper>
            <Navs data={navs} version={version} selected={chapter.name} />
          </NavWrapper>
          <MainWrapper>
            <Main
              data={content}
              groups={chapter.groups}
              definitions={definitions}
            />
          </MainWrapper>
        </Wrapper>
      </Layout>
    )
  }
}

const Wrapper = styled.div``

const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 238px;
  box-shadow: 1px 0 0 0 #e3e9ef;
  background-color: #f9fbfd;
`

const NavHeader = styled.div`
  padding: 20px;
  font-family: Proxima Nova;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.43;
  color: #242e42;

  & > svg,
  & > span {
    vertical-align: middle;
  }
`

const NavList = styled.ul`
  padding: 20px 0;
  height: calc(100vh - 60px);
  overflow: auto;
`

const NavItem = styled.li`
  margin: 0;
  padding: 6px 20px;

  & > a {
    font-family: Proxima Nova;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.67;
    color: ${({ selected }) => {
      return selected ? '#479e88' : '#242e42'
    }};

    &:hover {
      color: #479e88;
    }
  }

  & > ul {
    margin-top: 4px;
    list-style: none;

    & > li {
      margin: 0;
      padding: 2px 20px;

      & > a {
        position: relative;
        font-family: Proxima Nova;
        font-size: 12px;
        line-height: 1.67;
        color: #242e42;

        &:hover {
          color: #479e88;
        }

        &::after {
          content: '·';
          position: absolute;
          top: -4px;
          left: -10px;
        }
      }
    }
  }
`

const MainWrapper = styled.div`
  margin-left: 238px;
`
const MainContent = styled.div`
  height: 100vh;
  overflow: auto;
  min-width: ${({ showDetail }) => {
    return showDetail ? '962px' : 'none'
  }};
  padding: 20px;
  padding-right: ${({ showDetail }) => {
    return showDetail ? '532px' : '20px'
  }};
  transition: all 0.2s ease-in-out;
`

const Group = styled.section`
  margin-bottom: 20px;
`

const GroupTitle = styled.div`
  h4 {
    margin: 0;
    font-family: Proxima Nova;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.43;
    color: #242e42;
  }

  p {
    margin: 0;
    font-family: Proxima Nova;
    font-size: 12px;
    line-height: 1.67;
    color: #79879c;
  }
`

const GroupContent = styled.div`
  margin-top: 12px;
`

const Item = styled.div`
  position: relative;
  padding: 8px 44px 8px 12px;
  border-radius: 4px;
  border: ${({ selected }) => {
    return selected ? 'solid 1px #eff4f9' : 'solid 1px #e3e9ef'
  }};
  background-color: ${({ selected }) => {
    return selected ? '#eff4f9' : '#ffffff'
  }};
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 4px;
    height: calc(100% + 2px);
    background-color: ${({ selected }) => {
      return selected ? '#242e42' : 'transparent'
    }};
  }

  &:hover {
    background-color: #eff4f9;
    border-color: #eff4f9;

    &::after {
      background-color: #242e42;
    }
  }

  & > svg {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }

  .tag {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .item-summary {
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.67;
    color: #36435c;
    text-decoration: ${({ deprecate }) => {
      return deprecate ? 'line-through' : 'none'
    }};
    opacity: ${({ deprecate }) => {
      return deprecate ? 0.6 : 1
    }};
  }

  .item-path {
    position: relative;
    padding-left: 78px;

    & > span {
      font-family: Monaco;
      font-size: 12px;
      line-height: 2;
      color: #363e4a;
      opacity: ${({ deprecate }) => {
        return deprecate ? 0.6 : 1
      }};
    }
  }
`

const Tag = styled.div`
  width: 66px;
  padding: 2px;
  border-radius: 2px;
  background-color: ${({ deprecate }) => {
    return deprecate ? '#d8dee5 !important' : '#329dce'
  }};
  text-align: center;
  color: #ffffff;
  line-height: 1.67;
  font-size: 12px;
  font-weight: 600;

  &.tag-post {
    background-color: #55bc8a;
  }
  &.tag-put {
    background-color: #f5a623;
  }
  &.tag-get {
    background-color: #329dce;
  }
  &.tag-patch {
    background-color: #5f708a;
  }
  &.tag-delete {
    background-color: #ca2621;
  }
`

const DetailWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 512px;
  background-color: #181d28;
  color: #fff;
  padding: 20px;
  padding-top: 110px;

  & > svg {
    position: absolute;
    top: 39px;
    left: 20px;
    cursor: pointer;
  }

  .detail-content {
    height: calc(100vh - 130px);
    margin-right: -20px;
    padding-right: 20px;
    overflow: auto;
  }

  .detail-summary {
    padding-bottom: 12px;
    text-shadow: 0 2px 4px rgba(36, 46, 66, 0.1);
    font-family: Proxima Nova;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.33;
    color: #ffffff;
    border-bottom: solid 1px #404e68;
  }

  .detail-path {
    position: relative;
    margin-top: 12px;
    padding-left: 82px;

    .tag {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    & > span {
      font-size: 12px;
      line-height: 2;
      font-family: Monaco, PingFang SC;
    }
  }

  .detail-section {
    margin-top: 40px;

    .section-title {
      font-family: Proxima Nova;
      font-size: 14px;
      font-weight: bold;
      line-height: 1.43;
      color: #ffffff;
    }

    .section-content {
      margin-top: 12px;

      ul {
        margin: 0;
        font-family: Proxima Nova;
        font-size: 12px;
        line-height: 1.67;

        & > li {
          margin: 0;
          padding: 8px 0;
          border-bottom: solid 1px #404e68;

          .left-pane {
            display: inline-block;
            width: 30%;
            text-align: right;
            vertical-align: top;

            & > span {
              display: block;
            }
          }

          .right-pane {
            display: inline-block;
            width: 70%;
            padding-left: 32px;
            vertical-align: top;
          }
        }
      }
    }
  }

  .request-schema,
  .response-schema {
    pre {
      padding: 8px;
      border-radius: 4px;
      background-color: #242e42;
      max-height: 92px;

      code {
        font-family: Monaco;
        font-size: 12px;
        line-height: 1.67;
        color: #ffffff;
      }
    }
  }

  .response-schema {
    pre {
      max-height: 200px;
    }
  }

  .sub-title {
    margin: 12px 0;
    font-family: Proxima Nova;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.67;
  }
`

const HeaderCode = styled.div`
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  font-family: Monaco;
  font-size: 12px;
  line-height: 1.67;
  color: #ffffff;
`

export default APIDocTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

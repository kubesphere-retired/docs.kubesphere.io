import React from 'react'
import PropTypes from 'prop-types'
import GatsbyLink from 'gatsby-link'
import styled from 'styled-components'
import classnames from 'classnames'

import { ReactComponent as Arrow } from '../../assets/arrow.svg'

const Link = ({ to, ...rest }, { location }) => {
  const selected =
    (location.pathname + decodeURIComponent(location.hash)).indexOf(to) !== -1

  return (
    <GatsbyLink
      to={to}
      {...rest}
      className={classnames({ 'selected-link': selected })}
    />
  )
}

Link.contextTypes = {
  location: PropTypes.object,
}

class LinkWrapper extends React.Component {
  render() {
    const { entry, tag, level, title, defaultLocale } = this.props

    const url = entry.replace(`/${defaultLocale}`, '')

    return (
      <Link to={url}>
        <Title level={level} onClick={this.handleClick}>
          {level === 0 && <Arrow />}
          {title}
          {tag && <Tag>{tag}</Tag>}
        </Title>
      </Link>
    )
  }
}

const Links = ({ entries, level, defaultLocale }) => (
  <StyledList>
    {entries.map(({ entry, title }, key) => (
      <ListItem key={key}>
        <LinkWrapper
          title={title}
          entry={entry}
          level={level}
          defaultLocale={defaultLocale}
        />
      </ListItem>
    ))}
  </StyledList>
)

class ChapterList extends React.Component {
  constructor(props, context) {
    super(props)

    this.state = {
      open: this.getOpenState(props, context),
    }
  }

  getOpenState = (props, context) => {
    let open = false
    const locale = props.defaultLocale
    let pathname = context.location.pathname
    if (!/\/$/.test(pathname)) {
      context.location.pathname = context.location.pathname + '/'
      pathname = context.location.pathname
    }

    if (props.entries) {
      const slugs = props.entries.map(({ entry }) => entry)

      open = slugs.some(
        slug => pathname.indexOf(slug.replace(`/${locale}`, '')) !== -1
      )
    } else if (props.chapters) {
      const slugs = []
      props.chapters.forEach(chapter => {
        if (chapter.entry) {
          slugs.push(chapter.entry)
        } else if (chapter.entries) {
          slugs.push(...chapter.entries.map(({ entry }) => entry))
        }
      })
      open = slugs.some(
        slug => pathname.indexOf(slug.replace(`/${locale}`, '')) !== -1
      )
    }

    return open
  }

  handleClick = () => {
    this.setState(({ open }) => ({
      open: !open,
    }))
  }

  render() {
    const {
      chapters,
      entry,
      tag,
      entries,
      title,
      level = 0,
      defaultLocale,
    } = this.props
    const { open } = this.state

    return (
      <StyledList>
        {title && (
          <ListItem key={`${title}${level}`}>
            {entry ? (
              <LinkWrapper
                entry={entry}
                tag={tag}
                level={level}
                title={title}
                defaultLocale={defaultLocale}
              />
            ) : (
              <Title level={level} onClick={this.handleClick}>
                <Arrow className={classnames({ 'arrow-open': open })} />
                {title}
              </Title>
            )}
          </ListItem>
        )}
        <ListItem className={classnames('list-toggle', { 'list-open': open })}>
          {entries && (
            <Links
              entries={entries}
              level={level + 1}
              defaultLocale={defaultLocale}
            />
          )}
        </ListItem>
        <ListItem className={classnames('list-toggle', { 'list-open': open })}>
          {chapters &&
            chapters.map((chapter, index) => (
              <ChapterList
                {...chapter}
                level={level + 1}
                key={`${index}`}
                defaultLocale={defaultLocale}
              />
            ))}
        </ListItem>
      </StyledList>
    )
  }
}

ChapterList.contextTypes = {
  location: PropTypes.object,
}

export default ChapterList

const StyledList = styled.ol`
  list-style: none;
  margin: 0;
`

const ListItem = styled.li`
  margin: 0;

  .selected-link > h5 {
    background-color: #55bc8a;
  }

  &.list-toggle > ol > li {
    height: 0;
    overflow: hidden;
  }

  &.list-open > ol > li {
    height: auto;
  }
`

const Title = styled.h5`
  position: relative;
  font-family: Proxima Nova;
  font-size: 0.725rem;
  font-weight: 600;
  line-height: 1.67;
  text-align: left;
  color: #ffffff;
  padding: 8px 20px;
  padding-left: ${({ level }) => {
    switch (level % 4) {
      case 1:
        return '40px'
      case 2:
        return '60px'
      case 3:
        return '80px'
      default:
        return '20px'
    }
  }};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #55bc8add;
  }

  & > svg {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    margin-right: 8px;
    vertical-align: top;
    transform: rotate(-90deg);
    transition: all 0.2s ease;

    &.arrow-open {
      transform: rotate(0);
    }
  }
`

const Tag = styled.span`
  display: block;
  position: absolute;
  height: 20px;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
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

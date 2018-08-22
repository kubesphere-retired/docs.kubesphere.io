import React from 'react'
import PropTypes from 'prop-types'
import GatsbyLink from 'gatsby-link'
import styled from 'styled-components'
import classnames from 'classnames'

import { formatAnchor } from '../../utils/index'
import { ReactComponent as Arrow } from '../../assets/arrow.svg'

const Link = ({ to, ...rest }, { location }) => {
  const selected = location.pathname + decodeURIComponent(location.hash) === to

  return (
    <GatsbyLink
      to={to}
      {...rest}
      className={classnames({ ['selected-link']: selected })}
    />
  )
}

Link.contextTypes = {
  location: PropTypes.object,
}

class LinkWithHeadings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    const { location } = this.context
    const { fields } = this.props.entry.childMarkdownRemark

    this.setState({
      open: location.pathname === fields.slug,
    })
  }

  handleClick = () => {
    this.setState(({ open }) => ({
      open: !open,
    }))
  }

  render() {
    const { entry, level, title } = this.props
    const { headings, fields, frontmatter } = entry.childMarkdownRemark
    const { open } = this.state

    let heads = []

    if (headings) {
      heads = headings.filter(head => head.depth === 2)
    }

    return (
      <div>
        <Link to={fields.slug}>
          <Title level={level} onClick={this.handleClick}>
            {heads.length > 0 && (
              <Arrow className={classnames({ 'arrow-open': open })} />
            )}
            {title || frontmatter.title}
          </Title>
        </Link>
        <HeadingsWrapper
          className={classnames('heads-toggle', { 'heads-open': open })}
        >
          {heads.length > 0 && (
            <Headings heads={heads} prefix={fields.slug} level={level + 1} />
          )}
        </HeadingsWrapper>
      </div>
    )
  }
}

LinkWithHeadings.contextTypes = {
  location: PropTypes.object,
}

const Headings = ({ heads, prefix, level }) => (
  <StyledList>
    {heads.map(({ value }, key) => (
      <ListItem key={key}>
        <Link to={`${prefix}#${formatAnchor(value)}`}>
          <Title level={level}>{value}</Title>
        </Link>
      </ListItem>
    ))}
  </StyledList>
)

const Links = ({ entries, level }) => (
  <StyledList>
    {entries.map(({ entry }, key) => (
      <ListItem key={key}>
        <LinkWithHeadings entry={entry} level={level} />
      </ListItem>
    ))}
  </StyledList>
)

class ChapterList extends React.Component {
  constructor(props, context) {
    super(props)

    let open = false
    if (props.entries) {
      const slugs = props.entries.map(
        ({ entry }) => entry.childMarkdownRemark.fields.slug
      )

      open = slugs.includes(context.location.pathname)
    } else if (props.chapters) {
      const slugs = []
      props.chapters.forEach(chapter => {
        if (chapter.entry) {
          slugs.push(chapter.entry.childMarkdownRemark.fields.slug)
        } else if (chapter.entries) {
          slugs.push(
            ...chapter.entries.map(
              ({ entry }) => entry.childMarkdownRemark.fields.slug
            )
          )
        }
      })
      open = slugs.includes(context.location.pathname)
    }

    this.state = { open }
  }

  componentDidMount() {}

  handleClick = () => {
    this.setState(({ open }) => ({
      open: !open,
    }))
  }

  render() {
    const { chapters, entry, entries, title, level = 0 } = this.props
    const { open } = this.state

    return (
      <StyledList>
        {title && (
          <ListItem key={`${title}${level}`}>
            {entry ? (
              <LinkWithHeadings entry={entry} level={level} title={title} />
            ) : (
              <Title level={level} onClick={this.handleClick}>
                <Arrow className={classnames({ 'arrow-open': open })} />
                {title}
              </Title>
            )}
          </ListItem>
        )}
        <ListItem className={classnames('list-toggle', { 'list-open': open })}>
          {entries && <Links entries={entries} level={level + 1} />}
        </ListItem>
        <ListItem className={classnames('list-toggle', { 'list-open': open })}>
          {chapters &&
            chapters.map((chapter, index) => (
              <ChapterList {...chapter} level={level + 1} key={`${index}`} />
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

const HeadingsWrapper = styled.div`
  &.heads-toggle > ol > li {
    height: 0;
    overflow: hidden;
  }

  &.heads-open > ol > li {
    height: auto;
  }
`

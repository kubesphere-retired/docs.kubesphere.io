import React from 'react'
import OriginLink from 'gatsby-link'
import styled from 'styled-components'
import classnames from 'classnames'

import { ReactComponent as Arrow } from '../assets/arrow.svg'

/* eslint react/no-array-index-key: "off" */

const Link = ({ to, current, ...rest}) => {
  const selected = current === to

  return (
    <OriginLink to={to} {...rest} className={classnames({['selected-link']: selected})}/>
  )
}

const Links = ({ entries, current }) => (
  <StyledLinkList>
    {entries.map(({ entry }, key) => (
      <EntryListItem key={key}>
        <Link to={entry.childMarkdownRemark.fields.slug} current={current}>
          <EntryTitle>{entry.childMarkdownRemark.frontmatter.title}</EntryTitle>
        </Link>
      </EntryListItem>
    ))}
  </StyledLinkList>
)

const ChapterList = ({ chapters, entry, entries, current, title, level = 0 }) => {

  return (
    <StyledChapterList>
      {title && (
        <ChapterListItem key={`${title}${level}`}>
          {
            entry ?
            <Link to={entry.childMarkdownRemark.fields.slug} current={current}>
              <ChapterTitle level={level}>{title}</ChapterTitle>
            </Link> : <ChapterTitle level={level}>{title}<Arrow /></ChapterTitle>
          }
        </ChapterListItem>
      )}
      <ChapterListItem>{entries && <Links current={current} entries={entries} />}</ChapterListItem>
      <ChapterListItem>
        {chapters &&
          chapters.map((chapter, index) => (
            <ChapterList {...chapter} level={level + 1} key={`${index}`} current={current} />
          ))}
      </ChapterListItem>
    </StyledChapterList>
  )
}
class TableOfContents extends React.Component {
  render() {
    const { chapters, current } = this.props;

    return (
      <TOCWrapper>
        {chapters.map((chapter, index) => <ChapterList {...chapter} current={current} key={index} />)}
      </TOCWrapper>
    )
  }
}

export default TableOfContents

const TOCWrapper = styled.div`
  margin: 0;
`

const StyledChapterList = styled.ol`
  list-style: none;
  margin: 0;
`

const StyledLinkList = styled.ol`
  list-style: none;
  background-color: #1a202d;
`

const EntryTitle = styled.h5`
  font-family: Proxima Nova;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.67;
  text-align: left;
  color: #ffffff;
  padding: 8px 20px 8px 50px;

  &:hover {
    background-color: #55bc8add;
  }
`

const ChapterListItem = styled.li`
  margin: 0;

  .selected-link > h5 {
    background-color: #55bc8a;
  }
`

const EntryListItem = styled.li`
  margin: 0;

  .selected-link > h5 {
    background-color: #55bc8a;
  }
`

const ChapterTitle = styled.h5`
  position: relative;
  font-family: Proxima Nova;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.67;
  text-align: left;
  color: #ffffff;
  padding: 8px 20px;
  cursor: pointer;

  &:hover {
    background-color: #55bc8add;
  }

  & > svg {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
  }
`

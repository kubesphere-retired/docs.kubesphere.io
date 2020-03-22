import React from 'react'
import styled from 'styled-components'

import ChapterList from './chapter'

class TableOfContents extends React.Component {
  render() {
    const { chapters, defaultLocale } = this.props

    return (
      <TOCWrapper>
        {chapters.map((chapter, index) => (
          <ChapterList {...chapter} key={index} defaultLocale={defaultLocale} />
        ))}
      </TOCWrapper>
    )
  }
}

export default TableOfContents

const TOCWrapper = styled.div`
  position: relative;
  margin: 0;
`

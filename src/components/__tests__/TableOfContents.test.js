import React from 'react'
import renderer from 'react-test-renderer'
import TableOfContents from '../TableOfContents'

describe('TableOfContents', () => {
  it('renders correctly', () => {
    const props = {
      chapters: [],
    }

    const tree = renderer.create(<TableOfContents {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

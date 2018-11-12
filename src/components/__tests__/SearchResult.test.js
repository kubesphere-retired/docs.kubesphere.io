import React from 'react'
import renderer from 'react-test-renderer'
import SearchResult from '../SearchResult'

describe('SearchResult', () => {
  it('renders correctly', () => {
    const props = {
      results: []
    }

    const tree = renderer.create(<SearchResult {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

import React from 'react'
import renderer from 'react-test-renderer'
import Search from '../Search'

describe('Search', () => {
  it('renders correctly', () => {
    const props = {}

    const tree = renderer.create(<Search {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

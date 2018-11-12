import React from 'react'
import renderer from 'react-test-renderer'
import Headings from '../Headings'

describe('Headings', () => {
  it('renders correctly', () => {
    const props = {
      headings: [
        { value: 'title 1', depth: 1 },
        { value: 'title 2', depth: 1 },
        { value: 'sub title 1-1', depth: 2 },
      ],
    }

    const tree = renderer.create(<Headings {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

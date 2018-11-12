import React from 'react'
import renderer from 'react-test-renderer'
import Versions from '../Versions'

describe('Versions', () => {
  it('renders correctly', () => {
    const props = {
      versions: [
        {
          label: 'Express v1.0.0-alpha',
          value: 'express',
        },
        {
          label: 'Advance v1.0.0',
          value: 'advance-v1.0.0',
        },
      ]
    }

    const tree = renderer.create(<Versions {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

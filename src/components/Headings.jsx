import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { formatAnchor } from '../utils/index'

export default class Headings extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    headings: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        depth: PropTypes.number,
      })
    ).isRequired,
    onHeadClick: PropTypes.func,
    current: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      current: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.state.current) {
      this.setState({
        current: nextProps.current,
      })
    }
  }

  handleClick = e => {
    const anchor = e.target.dataset.anchor
    this.setState({
      current: anchor,
    })
    this.props.onHeadClick(anchor)
  }

  render() {
    const { title, headings } = this.props

    const current = decodeURIComponent(this.state.current)

    return (
      <Wrapper>
        <Title>{title}</Title>
        <div>
          {headings.map(({ value, depth }) => (
            <Head
              key={`${depth}-${value}`}
              level={depth - 2}
              data-anchor={`#${formatAnchor(value)}`}
              selected={`#${formatAnchor(value)}` === current}
              onClick={this.handleClick}
            >
              {value}
            </Head>
          ))}
        </div>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  width: 260px;
  padding: 76px 0;
`

const Title = styled.h5`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.71;
  color: #141f29;
  padding-left: 20px;
  margin-bottom: 12px;
`

const Head = styled.h5`
  position: relative;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.71;

  margin: 0;
  margin-top: ${({ level }) => {
    switch (level % 4) {
      case 1:
        return '8px'
      case 2:
        return '4px'
      case 3:
        return '4px'
      default:
        return '24px'
    }
  }};
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ selected }) => (selected ? '#55bc8a' : '#141f29')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #55bc8a;
  }

  &:first-of-type {
    margin-top: 0;
  }
`

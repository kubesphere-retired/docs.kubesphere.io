import React from 'react'
import styled from 'styled-components'

const Tabs = ({ options, value, onChange }) => (
  <Wrapper>
    {options.map(option => (
      <Tab
        key={option}
        onClick={() => onChange(value)}
        selected={option === value}
      >
        {option}
      </Tab>
    ))}
  </Wrapper>
)

const Wrapper = styled.div`
  border-radius: 4px;
  background-color: #242e42;
  padding: 4px 8px;
`

const Tab = styled.span`
  display: inline-block;
  border-radius: 4px;
  box-shadow: ${({ selected }) => {
    return selected ? '0 8px 16px 0 rgba(85, 188, 138, 0.36)' : 'none'
  }};
  border: ${({ selected }) => {
    return selected ? 'solid 1px #55bc8a' : 'none'
  }};
  background-color: ${({ selected }) => {
    return selected ? '#55bc8a' : 'transparent'
  }};
  padding: 6px 0;
  width: 96px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.67;
  color: #ffffff;
  cursor: pointer;

  & + span {
    margin-left: 12px;
  }
`

export default Tabs

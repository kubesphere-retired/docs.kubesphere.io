import React from 'react'
import styled from 'styled-components'

const Header = ({ siteTitle }) => (
  <div
    style={{
      position: 'relative',
      height: '100%',
      background: 'transparent',
    }}
  >
    <SearchWrapper>
      <input type="text" placeholder="快速查找"/>
    </SearchWrapper>
  </div>
)

const SearchWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  height: 36px;
  border-radius: 18px;
  border: solid 1px #cfd9df;

  & > input {
    width: 100%;
    height: 100%;
    border-radius: 18px;
    border: none;
    padding: 7px 13px;
    font-size: 12px;
    line-height: 2;
    color: #657d95;
    &:focus {
      outline: none;
    }
  }
`

export default Header

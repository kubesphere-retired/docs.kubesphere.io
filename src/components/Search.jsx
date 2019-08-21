import React from 'react'
import styled from 'styled-components'

import { ReactComponent as SearchIcon } from '../assets/search.svg'

class Search extends React.Component {
  render() {
    const { placeholder } = this.props

    return (
      <SearchWrapper className="ks-search">
        <SearchIcon />
        <input type="text" placeholder={placeholder} />
      </SearchWrapper>
    )
  }
}

const SearchWrapper = styled.div`
  position: relative;
  width: 350px;
  height: 36px;

  .algolia-autocomplete {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  .algolia-autocomplete .ds-dropdown-menu {
    transform: translateY(6px);
  }
  input {
    width: 100%;
    height: 100%;
    padding: 7px 20px 7px 40px;
    font-size: 0.875rem;
    font-family: Proxima Nova;
    font-weight: 600;
    line-height: 1.7;
    color: #303e5a;
    border-radius: 18px;
    border: solid 1px #cfd9df;
    background-color: transparent;
    transition: all 0.2s ease;
    &::placeholder {
      color: #657d95;
      font-weight: normal;
    }
    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
  & > svg {
    position: absolute;
    top: 50%;
    left: 14px;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    z-index: 2;
  }
`

export default Search

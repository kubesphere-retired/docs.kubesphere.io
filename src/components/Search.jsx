import React from 'react'
import styled from 'styled-components'

import { ReactComponent as SearchIcon } from '../assets/search.svg'

class Search extends React.Component {

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      const query = e.target.value
      this.props.onSearch(query)
    }
  }

  handleChange = (e) => {
    this.props.onQueryChange && this.props.onQueryChange(e.target.value)
  }

  render() {
    const { placeholder } = this.props

    return (
      <SearchWrapper className="ks-search">
        <SearchIcon />
        <input 
          type="text" 
          value={this.props.query} 
          placeholder={placeholder} 
          onKeyUp={this.handleKeyUp}
          onChange={this.handleChange}
        />
      </SearchWrapper>
    );
  }
}

const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;

  input {
    padding: 7px 20px 7px 40px;
    font-size: 14px;
    font-family: Proxima Nova;
    font-weight: 600;
    line-height: 1.7;
    color: #303e5a;
    border-radius: 18px;
    border: solid 1px #d8dee5;
    background-color: transparent;
    transition: all .2s ease;

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
    left: 24px;
    width: 16px;
    height: 16px;
    padding: 1px;
    transform: translateY(-50%);
    z-index: 2;
  }
`

export default Search

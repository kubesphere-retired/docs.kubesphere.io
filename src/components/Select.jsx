import React from 'react'
import ReactSelect from 'react-select'
import styled from 'styled-components'

export default class Select extends React.Component {
  render() {
    const { className, ...rest} = this.props
    return (
      <Wrapper className={className}>
        <ReactSelect
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={false}
          {...rest}
        />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: inline-block;
  vertical-align: middle;

  .react-select__control {
    border: none;
    box-shadow: none;
    border-radius: 4px;
    background-color: #1d2b3a;
    cursor: pointer;
  }

  .react-select__value-container {
    padding-left: 18px;
    height: 28px;
  }

  .react-select__single-value {
    font-size: 14px;
    font-weight: 600;
    line-height: 2;
    color: #ffffff;
    max-width:none;
    position: static;
    overflow: inherit;
    transform: none;
    top: 0;
  }

  .react-select__indicator-separator {
    display: none;
  }

  .react-select__menu {
    width: 200px;
    margin: 4px 0;
    right: 0;
    border-radius: 4px;
    box-shadow: 0 8px 16px 0 rgba(9, 18, 26, 0.2);
    background-color: #1d2b3a;
  }

  .react-select__menu-list {
    padding: 8px 0;
  }

  .react-select__option {
    padding: 6px 20px;
    font-size: 14px;
    font-weight: 600;
    line-height: 2;
    color: #ffffff;
    cursor: pointer;
  }

  .react-select__option--is-selected,
  .react-select__option--is-focused {
    background-color: #17222e !important;
    outline: none;
  }
  span[aria-live] {
    display: none;
  }
`

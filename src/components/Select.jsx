import React from 'react'
import ReactSelect from 'react-select'
import styled from 'styled-components'

export default class Select extends React.Component {
  render() {
    const { className, ...rest } = this.props
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
    box-sizing: border-box;
    transition: all 100ms ease 0s;
    outline: 0px !important;

    border: none;
    box-shadow: none;
    border-radius: 4px;
    background-color: #1d2b3a;
    cursor: pointer;
  }

  .react-select__value-container {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    flex: 1 1 0%;
    padding: 2px 8px;
    overflow: hidden;
    padding-left: 18px;
    height: 28px;

    & > input {
      font-size: inherit;
      width: 1px;
      color: transparent;
      left: -100px;
      opacity: 0;
      position: relative;
      transform: scale(0);
      background: 0px center;
      border-width: 0px;
      border-style: initial;
      border-color: initial;
      border-image: initial;
      outline: 0px;
      padding: 0px;
    }
  }

  .react-select__single-value {
    margin-left: 2px;
    margin-right: 2px;
    font-size: 14px;
    font-weight: 600;
    line-height: 2;
    color: #ffffff;
    max-width: none;
    position: static;
    overflow: inherit;
    transform: none;
    top: 0;
  }

  .react-select__indicators {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .react-select__indicator {
    color: rgb(204, 204, 204);
    display: flex;
    box-sizing: border-box;
    padding: 8px;
    transition: color 150ms ease 0s;
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

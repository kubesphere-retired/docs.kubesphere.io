import React from 'react'
import styled from 'styled-components'
import Search from './Search'
import Logo from './Logo'

import { getScrollTop } from '../utils/index'

class Header extends React.Component {
  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const scrollTop = getScrollTop()
    const classes = this.headerRef.classList
    const headerShadow = classes.contains('header-shadow')

    if (scrollTop >= 10 && !headerShadow) {
      classes.add('header-shadow')
    } else if (scrollTop < 10 && headerShadow) {
      classes.remove('header-shadow')
    }
  }

  handleExpand = () => {
    this.props.toggleExpand()
  }

  render() {
    const { isExpand, ...rest } = this.props

    return (
      <HeaderWrapper
        isExpand={isExpand}
        innerRef={ref => {
          this.headerRef = ref
        }}
      >
        <div className="header-expand" onClick={this.handleExpand}>
          <span className="v-line" />
          <span className="v-line" />
          <span className="v-line" />
        </div>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <SearchWrapper>
          <Search {...rest} />
        </SearchWrapper>
      </HeaderWrapper>
    )
  }
}

const LogoWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 200;

  @media only screen and (max-width: 768px) {
    top: 14px;
    left: 84px;
  }
`

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 280px;
  width: calc(100% - 280px);
  height: 80px;
  opacity: 0.92;
  background: #eff4f9;
  transition: left 0.2s cubic-bezier(0.79, 0.33, 0.14, 0.53);

  @media only screen and (max-width: 768px) {
    width: 100%;
    height: 60px;
    left: ${({ isExpand }) => {
      return isExpand ? '280px' : 0
    }};
  }

  .header-expand {
    display: none;

    @media only screen and (max-width: 768px) {
      display: inline-block;
      margin-top: 21px;
      margin-left: 31px;
      cursor: pointer;
    }
  }

  .v-line {
    display: block;
    width: 20px;
    height: 3px;
    border-radius: 1.5px;
    background-color: #b6c2cd;
  }

  .v-line + .v-line {
    margin-top: 4px;
  }

  .header-logo {
    display: inline-block;
    height: 30px;
    width: 150px;
    margin-top: 25px;
    margin-left: 30px;

    @media only screen and (max-width: 768px) {
      position: absolute;
      top: 0;
      left: 0;
      margin-top: 30px;
      margin-left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`

const SearchWrapper = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);

  @media only screen and (max-width: 768px) {
    display: none;
  }

  .ks-search {
    & > input {
      width: 350px;
      height: 37px;
      font-size: 12px;
      line-height: 2;
      color: #657d95;
      padding: 6px 30px 6px 40px;
      background-color: transparent;
      border-color: transparent;
      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: #cfd9df;
      }

      &:focus {
        background-color: #fff;
        border-color: #cfd9df;
      }
    }

    & > svg {
      left: 13px;
      width: 20px;
      height: 20px;
      padding: 3px;
    }
  }
`

export default Header

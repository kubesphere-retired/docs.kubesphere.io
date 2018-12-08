import React from 'react'
import styled from 'styled-components'

import { ReactComponent as LogoIcon } from '../assets/logo.svg'

const Logo = () => (
  <Wrapper>
    <a href="//kubesphere.io/" target="_blank">
      <LogoIcon className="logo" />
    </a>
    <a href="/">
      <p>文档中心</p>
    </a>
  </Wrapper>
)

const Wrapper = styled.div`
  .logo {
    display: inline-block;
    vertical-align: middle;
    height: 32px;
    width: 150px;
  }

  p {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 0;
    margin-left: 30px;
    font-size: 16px;
    line-height: 1.75;
    color: #303e5a;

    &::before {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -14px;
      content: '|';
      color: #00aa72;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.75;
    }
  }
`

export default Logo

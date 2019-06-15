import React from 'react'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

import { ReactComponent as LogoIcon } from '../assets/logo.svg'

const Logo = ({ t, pageContext: { locale } }) => (
  <Wrapper>
    <a
      href={`//kubesphere.io/${locale}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <LogoIcon className="logo" />
    </a>
    <a href={`/${locale}`}>
      <p>{t('Documentation')}</p>
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

export default withTranslation()(Logo)

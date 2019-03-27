import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import { ReactComponent as EarthIcon } from '../assets/earth.svg'

import { getLanguage } from '../utils'

const LANGS = [
  { name: '简体中文', value: 'zh-CN' },
  { name: 'English', value: 'en' },
]

const Language = ({ className, i18n }) => {
  const handleChange = e => {
    i18n.changeLanguage(e.target.dataset.lang)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const currentLang = getLanguage(i18n.language)

  return (
    <Wrapper>
      <EarthIcon />
      {LANGS.map(lang => (
        <Item
          key={lang.value}
          selected={lang.value === currentLang}
          data-lang={lang.value}
          onClick={handleChange}
        >
          {lang.name}
        </Item>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
  }
`

const Item = styled.a`
  font-size: 12px;
  line-height: 2.5;
  color: #919aa3;
  font-weight: ${({ selected }) => (selected ? 500 : 400)};
  cursor: pointer;

  & + a {
    position: relative;
    margin-left: 10px;

    &::after {
      content: '/';
      position: absolute;
      top: 50%;
      left: -8px;
      transform: translateY(-50%);
    }
  }

  &:hover {
    font-weight: 500;
  }
`

export default translate('base')(Language)

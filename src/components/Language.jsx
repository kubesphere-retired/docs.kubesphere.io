import React from 'react'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

import { ReactComponent as EarthIcon } from '../assets/earth.svg'

import { getLanguage } from '../utils'

const Language = ({
  pageContext: { locale, originalPath, slug, defaultLocale, availableLocales },
  pathPrefix,
  noIcon,
}) => {
  const handleChange = e => {
    e.stopPropagation()
    e.preventDefault()
    const newLang = e.target.dataset.lang

    if (typeof window !== 'undefined') {
      if (originalPath) {
        window.location.href = `${pathPrefix}/${newLang}${originalPath}`.replace(
          `/${defaultLocale}`,
          ''
        )
      } else if (slug) {
        window.location.href = `${pathPrefix}${slug.replace(
          `/${locale}/`,
          `/${newLang}/`
        )}`.replace(`/${defaultLocale}`, '')
      }
    }
  }

  return (
    <Wrapper>
      {!noIcon && <EarthIcon />}
      {availableLocales.map(lang => (
        <Item
          key={lang.value}
          selected={lang.value === getLanguage(locale)}
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

export default withTranslation()(Language)

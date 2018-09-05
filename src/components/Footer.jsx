import React from 'react'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'

import { ReactComponent as Previous } from '../assets/previous.svg'
import { ReactComponent as Next } from '../assets/next.svg'

class Footer extends React.Component {
  render() {
    const { prev, next } = this.props

    return (
      <div>
        <Pagination>
          {!isEmpty(prev) && (
            <Link href={prev.href}>
              <Previous />
              上一篇: {prev.text}
            </Link>
          )}
          {!isEmpty(next) && (
            <Link href={next.href} right>
              下一篇: {next.text}
              <Next />
            </Link>
          )}
        </Pagination>
        <FooterText>KubeSphere Docs</FooterText>
      </div>
    )
  }
}

const Pagination = styled.div`
  height: 53px;
  padding: 12px 0;
  border-bottom: solid 1px #d5dee7;
`

const Link = styled.a`
  float: ${({ right }) => (right ? 'right' : 'none')};
  line-height: 2;
  font-size: 14px;
  color: #5d6b79;

  & > svg {
    width: 20px;
    height: 20px;
    margin: ${({ right }) => (right ? '0 0 0 12px' : '0 12px 0 0')};
    vertical-align: text-bottom;
  }

  &:hover {
    color: #55bc8a;
  }
`

const FooterText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #5d6b79;
  text-align: center;
`

export default Footer

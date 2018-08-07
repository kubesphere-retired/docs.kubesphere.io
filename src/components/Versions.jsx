import React from 'react'
import styled from 'styled-components'

import { ReactComponent as Logo } from '../assets/logo.svg'
import { ReactComponent as KubeSphere } from '../assets/kubesphere.svg'
import { ReactComponent as Arrow } from '../assets/arrow.svg'

const Versions = ({ versions, current }) => {

  return (
    <VersionsWrapper>
      <Logo className="version-logo"/>
      <div className="version-text">
        <KubeSphere className="kubesphere-icon"/>
        <p style={{ textTransform: 'capitalize' }}>{current}</p>
      </div>
      {versions.length > 0 && <Arrow className="version-arrow"/>}
    </VersionsWrapper>
  )
}

const VersionsWrapper = styled.div`
  padding: 25px 20px;

  .version-logo {
    width: 30px; 
    height: 30px; 
    margin-right: 20px; 
    vertical-align: middle;
  }

  .version-text {
    display: inline-block;
    vertical-align: middle;

    .kubesphere-icon {
      display: block;
      width: 104px;
      height: 16px;
    }

    & > p {
      margin: 0; 
      font-size: 12px; 
      line-height: 17px;
    }
  }

  .version-arrow {
    float: right;
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
`

export default Versions

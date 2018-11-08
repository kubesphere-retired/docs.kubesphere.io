import React from 'react'
import styled from 'styled-components'

import { ReactComponent as DocsIcon } from '../assets/docs.svg'
import { ReactComponent as KubeSphere } from '../assets/kubesphere.svg'
import { ReactComponent as Arrow } from '../assets/arrow.svg'

class Versions extends React.Component {
  state = {
    showOptions: false,
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
  }

  handleDocumentClick = e => {
    if (this.ref && !this.ref.contains(e.target)) {
      if (this.state.showOptions) {
        this.setState({ showOptions: false }, () => {
          document.removeEventListener('click', this.handleDocumentClick)
        })
      }
    }
  }

  handleClick = () => {
    this.setState({ showOptions: true }, () => {
      document.addEventListener('click', this.handleDocumentClick)
    })
  }

  changeVersion = (version) => {
    location.href=`/${version}/zh-CN/basic/`
  }

  renderOptions() {
    const { versions, current } = this.props

    if (versions.length <= 1) {
      return null
    }

    return (
      <OptionsWrapper showOptions={this.state.showOptions}>
        {versions.map(version => (
          <Option
            key={version.value}
            selected={version.value === current}
            onClick={() => this.changeVersion(version.value)}
          >
            {version.label}
          </Option>
        ))}
      </OptionsWrapper>
    )
  }

  render() {
    const { versions, current } = this.props

    const currentVersion = versions.find(version => version.value === current) || {}

    return (
      <VersionsWrapper>
        <VersionPanel
          onClick={versions.length > 1 ? this.handleClick : null}
          showOptions={this.state.showOptions}
          clickable={versions.length > 1}
        >
          <DocsIcon className="version-logo" />
          <div className="version-text">
            <KubeSphere className="kubesphere-icon" />
            <p>{currentVersion.label}</p>
          </div>
          {versions.length > 1 && <Arrow className="version-arrow" />}
        </VersionPanel>
        <div
          ref={ref => {
            this.ref = ref
          }}
        >
          {this.renderOptions()}
        </div>
      </VersionsWrapper>
    )
  }
}

const VersionsWrapper = styled.div`
  position: relative;
  user-select: none;
`

const VersionPanel = styled.div`
  padding: 25px 20px;
  background-color: ${({ showOptions }) => {
    return showOptions ? 'rgba(0, 170, 114, 0.99)' : 'transparent'
  }};
  cursor: ${({ clickable }) => {
    return clickable ? 'pointer' : 'normal'
  }};

  .version-logo {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    vertical-align: middle;
  }

  .version-text {
    display: inline-block;
    vertical-align: middle;
    font-family: Proxima Nova;

    .kubesphere-icon {
      display: block;
      width: 104px;
      height: 16px;
    }

    & > p {
      margin: 0;
      margin-top: 8px;
      font-size: 12px;
      line-height: 17px;
    }
  }

  .version-arrow {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 24px;
    height: 24px;
    transform: ${({ showOptions }) => {
      return showOptions
        ? 'translateY(-50%) rotate(180deg)'
        : 'translateY(-50%)'
    }};
  }
`

const OptionsWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -1px;
  
  background-color: rgba(0, 170, 114, 0.99);
  opacity: ${({ showOptions }) => {
    return showOptions ? 1 : 0
  }};
  transform: ${({ showOptions }) => {
    return showOptions ? 'translateY(100%)' : 'translateY(95%)'
  }};
  z-index: ${({ showOptions }) => {
    return showOptions ? 100 : -1
  }};
  transition: all 0.2s ease-in-out;
`

const Option = styled.div`
  padding: 20px 20px 20px 32px;
  cursor: pointer;
  font-family: Proxima Nova;
  transition: all 0.2s ease-in-out;
  background-color: ${({ selected }) => {
    return selected ? '#008a5c' : 'transparent'
  }};

  &:hover {
    background-color: #008a5cdd;
  }

  &:active {
    background-color: #008a5c;
  }
`

export default Versions

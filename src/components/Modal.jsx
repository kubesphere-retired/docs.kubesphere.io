import { omit } from 'lodash'
import React from 'react'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { ReactComponent as CloseIcon } from '../assets/close.svg'

ReactModal.defaultStyles.overlay = Object.assign(
  {},
  ReactModal.defaultStyles.overlay,
  {
    padding: 0,
    backgroundColor: 'rgba(35, 45, 65, 0.7)',
    zIndex: 2000,
    overflow: 'auto',
  }
)

ReactModal.defaultStyles.content = Object.assign(
  {},
  omit(ReactModal.defaultStyles.content, [
    'top',
    'left',
    'right',
    'bottom',
    'padding',
    'border-radius',
    'border',
  ]),
  {
    width: 744,
    position: 'relative',
    margin: '0 auto',
    marginTop: 160,
  }
)

export default class Modal extends React.Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    children: PropTypes.any,
  }

  static defaultProps = {
    width: 600,
    visible: false,
    onCancel() {},
  }

  render() {
    const { header, width, visible, children, onCancel } = this.props

    const style = {
      content: { width },
    }

    return (
      <ReactModal
        style={style}
        isOpen={visible}
        onRequestClose={onCancel}
        ariaHideApp={false}
      >
        <Header>
          {header}
          <CloseIcon onClick={onCancel} />
        </Header>
        <div>{children}</div>
      </ReactModal>
    )
  }
}

const Header = styled.div`
  position: relative;
  border-radius: 8px 8px 0 0;
  & > svg {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 16px;
    right: 20px;
    cursor: pointer;
  }
`

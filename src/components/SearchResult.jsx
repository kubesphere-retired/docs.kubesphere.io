import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Mark from 'mark.js'

import Modal from './Modal'
import Search from './Search'

import { ReactComponent as RightIcon } from '../assets/right.svg'

const Header = (props) => (
  <HeaderWrapper>
    <Search {...props} />
  </HeaderWrapper>
)

export default class SearchResult extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.doMark();
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      setTimeout(() => {
        this.doMark();
      }, 500);
    }
  }

  doMark = () => {
    if (this.ref) {
      new Mark(this.ref).mark(this.props.query);
    }
  }

  render() {
    const { results, onCancel, visible, ...search } = this.props;

    return (
      <Modal
        width={756}
        visible={visible}
        onCancel={onCancel}
        header={<Header {...search}/>}
      >
        <Wrapper>
          <p>共找到 { results.length } 条相关信息</p>
          <div ref={(ref) => { this.ref = ref; }}>
            <Results>
              {
                results.map((result, index) => (
                  <Link key={index} to={result.slug} onClick={onCancel}>
                    <ResultItem>
                      <p className="result-title">
                        KubeSphere Docs: {result.title || result.head_prefix}&nbsp;&nbsp;
                        <span className="font-normal">{result.head}</span>
                      </p>
                      <p className="result-desc">{result.excerpt}</p>
                      <RightIcon />
                    </ResultItem>
                  </Link>
                ))
              }
            </Results>
          </div>
        </Wrapper>
      </Modal>
    )
  }
}

const Wrapper = styled.div`
  height: 475px;
  padding: 14px 20px;
  overflow-y: auto;

  & > p {
    color: #a1abb5;
  }
`

const HeaderWrapper = styled.div`
  .ks-search {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    height: 50px;
    transform: none;

    & > input{
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #cfd9df;
    }
  }
`

const Results = styled.ul`
  margin-top: 12px;
  list-style: none;
  border-top: 1px solid #eff4f8;
`

const ResultItem = styled.li`
  position: relative;
  padding: 12px 56px 12px 12px;
  margin: 0;
  border-bottom: 1px solid #eff4f8;

  &:hover {
    background-color: #eff4f8;

    & > svg {
      opacity: 1;
    }
  }

  & > svg {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    opacity: 0;
  }

  & > p {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .font-normal {
    font-weight: normal;
  }

  .result-title {
    font-weight: 600;
    line-height: 2;
    color: #141f29;
  }

  .result-desc {
    font-size: 12px;
    line-height: 1.67;
    color: #4c5e70;
  }
`
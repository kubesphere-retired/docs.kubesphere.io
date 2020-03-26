import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import { Redoc, AppStore } from '@leoendless/redoc'
import {
  darken,
  desaturate,
  lighten,
  readableColor,
  transparentize,
} from 'polished'

import Layout from '../layouts'

const THEME = {
  spacing: {
    unit: 5,
    sectionHorizontal: ({ spacing }) => spacing.unit * 8,
    sectionVertical: ({ spacing }) => spacing.unit * 8,
  },
  breakpoints: {
    small: '50rem',
    medium: '85rem',
    large: '105rem',
  },
  colors: {
    tonalOffset: 0.3,
    primary: {
      main: '#242e42',
      light: ({ colors }) => lighten(colors.tonalOffset, colors.primary.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.primary.main),
      contrastText: ({ colors }) => readableColor(colors.primary.main),
    },
    success: {
      main: '#55bc8a',
      light: ({ colors }) => lighten(colors.tonalOffset, colors.success.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.success.main),
      contrastText: ({ colors }) => readableColor(colors.success.main),
    },
    warning: {
      main: '#f5a623',
      light: ({ colors }) => lighten(colors.tonalOffset, colors.warning.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.warning.main),
      contrastText: '#ffffff',
    },
    error: {
      main: '#8c3231',
      light: ({ colors }) => lighten(colors.tonalOffset, colors.error.main),
      dark: ({ colors }) => darken(colors.tonalOffset, colors.error.main),
      contrastText: ({ colors }) => readableColor(colors.error.main),
    },
    text: {
      primary: '#333333',
      secondary: ({ colors }) =>
        lighten(colors.tonalOffset, colors.text.primary),
    },
    border: {
      dark: 'rgba(0,0,0, 0.1)',
      light: '#ffffff',
    },
    responses: {
      success: {
        color: ({ colors }) => colors.success.main,
        backgroundColor: ({ colors }) =>
          transparentize(0.9, colors.success.main),
      },
      error: {
        color: ({ colors }) => colors.error.main,
        backgroundColor: ({ colors }) => transparentize(0.9, colors.error.main),
      },
      redirect: {
        color: '#ffa500',
        backgroundColor: ({ colors }) =>
          transparentize(0.9, colors.responses.redirect.color),
      },
      info: {
        color: '#87ceeb',
        backgroundColor: ({ colors }) =>
          transparentize(0.9, colors.responses.info.color),
      },
    },
    http: {
      get: '#326e93',
      post: '#3b747a',
      put: '#f5a623',
      options: '#d3ca12',
      patch: '#4a5974',
      delete: '#8c3231',
      basic: '#999',
      link: '#31bbb6',
      head: '#c167e4',
    },
  },
  schema: {
    linesColor: theme =>
      lighten(
        theme.colors.tonalOffset,
        desaturate(theme.colors.tonalOffset, theme.colors.primary.main)
      ),
    defaultDetailsWidth: '75%',
    typeNameColor: theme => theme.colors.text.secondary,
    typeTitleColor: theme => theme.schema.typeNameColor,
    requireLabelColor: theme => theme.colors.error.main,
    labelsTextSize: '0.9em',
    nestingSpacing: '1em',
    nestedBackground: '#f9fbfd',
    arrow: {
      size: '1.1em',
      color: theme => theme.colors.text.secondary,
    },
  },
  typography: {
    fontSize: '14px',
    lineHeight: '1.5em',
    fontWeightRegular: '400',
    fontWeightBold: '600',
    fontWeightLight: '300',
    fontFamily: 'Proxima Nova, Roboto, sans-serif',
    smoothing: 'antialiased',
    optimizeSpeed: true,
    headings: {
      fontFamily: 'Proxima Nova, Montserrat, sans-serif',
      fontWeight: '400',
      lineHeight: '1.6em',
    },
    code: {
      fontSize: '14px',
      fontFamily: 'Monaco, Courier, monospace',
      lineHeight: ({ typography }) => typography.lineHeight,
      fontWeight: ({ typography }) => typography.fontWeightRegular,
      color: '#e53935',
      backgroundColor: 'rgba(38, 50, 56, 0.05)',
      wrap: false,
    },
    links: {
      color: ({ colors }) => colors.primary.main,
      visited: ({ typography }) => typography.links.color,
      hover: ({ typography }) => lighten(0.2, typography.links.color),
    },
  },
  menu: {
    width: '260px',
    backgroundColor: '#f9fbfd',
    textColor: '#242e42',
    groupItems: {
      textTransform: 'uppercase',
    },
    level1Items: {
      textTransform: 'none',
    },
    arrow: {
      size: '1.5em',
      color: theme => theme.menu.textColor,
    },
  },
  logo: {
    maxHeight: ({ menu }) => menu.width,
    maxWidth: ({ menu }) => menu.width,
    gutter: '2px',
  },
  rightPanel: {
    backgroundColor: '#181d28',
    width: '40%',
    textColor: '#ffffff',
  },
  codeSample: {
    backgroundColor: ({ rightPanel }) =>
      darken(0.1, rightPanel.backgroundColor),
  },
}

const style = `
  body { 
    background-color: #fff; 
  }

  div[role="search"] > svg { 
    margin-top: 2px; 
  }

  span.http-verb { 
    border-radius: 4px;
    font-size: 14px;
  }

  .react-tabs__tab-panel {
    border-radius: 4px;
    margin-bottom: 12px;
  }

  li {
    margin-bottom: 0;
  }

  tr > td {
    font-size: 14px;
  }

  .menu-content {
    position: fixed;
  }

  .api-content {
    margin-left: 260px;
  }

  .menu-content img[alt="logo"] {
    width: 160px;
    height: 80px;
    margin-bottom: 0;
  }

  label[type="tag"] > span {
    font-weight: 500;
    font-size: 14px;
  }
`

class APIDocTemplate extends React.Component {
  constructor(props) {
    super(props)

    const spec = props.pageContext.swaggerData
    this.store = new AppStore(spec, '', { theme: THEME })
  }

  render() {
    const { data } = this.props

    return (
      <Layout data={data}>
        <Helmet>
          <style>{style}</style>
        </Helmet>
        <Redoc store={this.store} />
      </Layout>
    )
  }
}

export default APIDocTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

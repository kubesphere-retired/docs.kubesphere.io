import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import '../i18n'

import '../assets/fonts/ProximaNova/stylesheet.css'
import './index.css'

const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'KubeSphere Documents' },
        {
          name: 'keywords',
          content: 'KubeSphere, KubeSphere Documents, Kubernetes',
        },
      ]}
    />
    {children}
  </div>
)

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout

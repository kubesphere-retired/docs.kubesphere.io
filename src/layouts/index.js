import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import '../i18n'

import '../assets/fonts/ProximaNova/stylesheet.css'
import './index.css'

const Layout = ({ children, data, locale }) => (
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
    {locale && (
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html:
            locale.indexOf('zh') !== -1
              ? `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:1749426,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
              : `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:1756364,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv='); `,
        }}
      />
    )}
  </div>
)

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout

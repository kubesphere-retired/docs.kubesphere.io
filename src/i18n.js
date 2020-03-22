import i18n from 'i18next'
import config from '../gatsby-config'

export const defaultLocale = config.siteMetadata.defaultLocale
export const defaultNamespace = 'common'

export const options = {
  fallbackLng: defaultLocale,
  ns: [defaultNamespace],
  defaultNS: defaultNamespace,

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  react: {
    wait: false,
  },

  keySeparator: '$%^%$', // set separator something won't exists in localeResources keys

  initImmediate: false, // Important for SSR to work
}

export default () => {
  i18n.init(options)

  return i18n
}

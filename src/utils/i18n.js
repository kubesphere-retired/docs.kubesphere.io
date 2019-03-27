import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'
import localeResources from '../locales'

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    ns: ['base'],
    defaultNS: 'base',
    debug: false,
    keySeparator: '$%^%$', // set separator something won't exists in localeResources keys
    react: {
      wait: true,
    },
    resources: localeResources,
  })

export default i18n

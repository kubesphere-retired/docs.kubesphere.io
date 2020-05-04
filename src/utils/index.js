export function getLanguage(lang) {
  let formatLang = 'en'

  switch (lang) {
    case 'zh':
    case 'zh-cn':
    case 'zh-CN':
      formatLang = 'zh-CN'
      break
    case 'tr':
      formatLang = 'tr'
      break
    default:
      break
  }

  return formatLang
}

export function getScrollTop() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop
}

export function formatAnchor(str) {
  return str
    .replace(/:/g, '')
    .split(' ')
    .join('-')
    .toLowerCase()
}

export function safeParseJSON(json, defaultValue) {
  let result
  try {
    result = JSON.parse(json)
  } catch (e) {}

  if (!result && defaultValue !== undefined) {
    return defaultValue
  }
  return result
}

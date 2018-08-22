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

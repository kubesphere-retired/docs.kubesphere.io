export default function NotFound() {
  if (typeof window !== 'undefined') {
    window.location = '/'
  }

  return null
}

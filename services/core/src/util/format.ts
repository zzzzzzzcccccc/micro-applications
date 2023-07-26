export function getFileExtension(target: string) {
  const index = target.lastIndexOf('.')
  if (index !== -1) {
    return target.substring(index + 1).toLowerCase()
  }
  return ''
}

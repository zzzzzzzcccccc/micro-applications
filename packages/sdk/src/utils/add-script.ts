export default function addScript(target: string) {
  return new Promise<void>((resolve, reject) => {
    if (target.indexOf('.js') === -1) {
      reject('load url must be a js file')
    } else {
      const script = document.createElement('script')
      script.src = target
      script.type = 'text/javascript'
      script.async = true
      document.head.appendChild(script)
      const remove = () => document.head.removeChild(script)
      script.onload = () => {
        remove()
        resolve()
      }
      script.onerror = (e) => {
        remove()
        reject(e)
      }
    }
  })
}

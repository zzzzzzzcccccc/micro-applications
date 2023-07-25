import Sdk from './sdk'

const sdk = (() => {
  let instance: Sdk | undefined

  return () => {
    if (!instance) {
      instance = new Sdk({
        historyMode: 'browser',
      })
    }

    return instance
  }
})()

const instance = sdk()

export default instance

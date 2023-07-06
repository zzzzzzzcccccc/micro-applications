import { useState, useCallback } from 'react'
import { Update } from 'history'

export interface Options {
  defaultUpdate: Update
}

export default function useRouter(options: Options) {
  const [update, setUpdate] = useState(options.defaultUpdate)

  const onChange = useCallback(
    (update: Update) => {
      setUpdate(update)
    },
    [options],
  )

  return {
    update,
    onChange,
  }
}

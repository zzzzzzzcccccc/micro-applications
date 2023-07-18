import React, { useEffect } from 'react'
import { httpClient } from '../../config'
import sdk, { App } from '@micro/sdk'
import { reactHooks } from '@micro/hooks'

export default function ProviderGlobal({ children }: { children: React.ReactNode }) {
  const { loading, run } = reactHooks.useRequest<App[]>(httpClient.instance, {
    initialState: {
      data: [] as App[],
      loading: true,
      error: null,
    },
  })

  useEffect(() => {
    const mounted = async () => {
      const data = await run({ method: 'get', url: '/app' })
      if (data?.length) {
        sdk.app.set(data)
      }
    }

    mounted()
  }, [run])

  return loading ? 'loading...' : children
}

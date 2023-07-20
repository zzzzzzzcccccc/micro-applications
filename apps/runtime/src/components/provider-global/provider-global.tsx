import React, { useEffect } from 'react'
import { httpClient } from '../../config'
import sdk, { App, Feature, FeatureStatus } from '@micro/sdk'
import { reactHooks } from '@micro/hooks'

export default function ProviderGlobal({ children }: { children: React.ReactNode }) {
  const { loading: loadingFeatures, run: fetchFeatures } = reactHooks.useRequest<Feature[]>(httpClient.instance, {
    initialState: {
      data: [] as Feature[],
      loading: true,
      error: null,
    },
  })
  const { loading: loadingApps, run: fetchApps } = reactHooks.useRequest<App[]>(httpClient.instance, {
    initialState: {
      data: [] as App[],
      loading: true,
      error: null,
    },
  })
  const loading = loadingFeatures || loadingApps

  useEffect(() => {
    const mounted = async () => {
      const [features, apps] = await Promise.all([
        fetchFeatures({
          method: 'get',
          url: '/feature',
          params: { tenant_id: sdk.app.envs.PROVIDER_TENANT_ID, status: [FeatureStatus.ACTIVE, FeatureStatus.ROLLOUT] },
        }),
        fetchApps({ method: 'get', url: '/app' }),
      ])
      features?.length && sdk.feature.set(features as Feature[])
      apps?.length && sdk.app.set(apps as App[])
    }

    mounted()
  }, [fetchApps])

  return loading ? 'loading...' : children
}

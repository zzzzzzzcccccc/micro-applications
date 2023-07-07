import React, { useEffect } from 'react'
import { Router as RootRouter, Routes, Route } from 'react-router-dom'
import sdk from '@micro/sdk'
import { reactHooks } from '@micro/hooks'
import Layout from '../layout'
import Container from '../container'

function Router() {
  const { update, onChange } = reactHooks.useRouter({ defaultUpdate: sdk.navigation.update })
  const apps = [
    {
      path: '/home',
      appName: 'home_app',
      remotePath: './App',
      url: 'http://localhost:3334/v0.0.1/remoteEntry.js',
    },
    {
      path: '/dashboard',
      appName: 'dashboard_app',
      remotePath: './App',
      url: 'http://localhost:3335/v0.0.0/remoteEntry.js',
    },
  ]

  useEffect(() => {
    const unbind = sdk.navigation.on(onChange)
    return () => unbind()
  }, [onChange])

  return (
    <RootRouter location={update.location} navigationType={update.action} navigator={history}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {apps.map((item) => (
            <Route key={item.path} path={`${item.path}/*`} element={<Container app={item} />} />
          ))}
        </Route>
      </Routes>
    </RootRouter>
  )
}

export default Router

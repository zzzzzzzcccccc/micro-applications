import React, { useEffect } from 'react'
import { Router as RootRouter, Routes, Route } from 'react-router-dom'
import sdk from '@micro/sdk'
import { reactHooks } from '@micro/hooks'
import Layout from '../layout'
import Container from '../container'

function Router() {
  const { update, onChange } = reactHooks.useRouter({ defaultUpdate: sdk.navigation.update })

  useEffect(() => {
    const unbind = sdk.navigation.on(onChange)
    return () => unbind()
  }, [onChange])

  return (
    <RootRouter location={update.location} navigationType={update.action} navigator={history}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path=":name" element={<Container />}>
            <Route path="*" element={<Container />} />
          </Route>
        </Route>
      </Routes>
    </RootRouter>
  )
}

export default Router

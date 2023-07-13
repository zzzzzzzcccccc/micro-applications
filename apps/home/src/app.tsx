import React, { useEffect } from 'react'
import { MemoryHistory } from 'history'
import { Router as RootRouter, Routes, Route, Outlet, Link, Navigate } from 'react-router-dom'
import { reactHooks } from '@micro/hooks'
import sdk from '@micro/sdk'
import './app.less'

interface AppProps {
  history: MemoryHistory
}

export default function App({ history }: AppProps) {
  const app = sdk.app.findByName('home')
  const { update, onChange } = reactHooks.useRouter({
    defaultUpdate: { action: history.action, location: history.location },
  })

  useEffect(() => {
    const unbindChild = history.listen((update) => {
      const { location } = update
      onChange(update)
      if (location.pathname !== sdk.navigation.pathname) {
        sdk.navigation.push(location.pathname)
      }
    })
    return () => {
      unbindChild()
    }
  }, [onChange])

  return (
    <RootRouter location={update.location} navigationType={update.action} navigator={history}>
      <Routes>
        <Route
          path={app?.path}
          element={
            <>
              <ul>
                <li>
                  <Link to={app?.path}>home app1</Link>
                </li>
                <li>
                  <Link to={`${app?.path}/app2`}>home app2</Link>
                </li>
              </ul>
              <Outlet />
            </>
          }
        >
          <Route path={app?.path} element={<div className="app">home app app1</div>} />
          <Route path={`${app?.path}/app2`} element={<div className="app">home app app2</div>} />
          <Route path="*" element={<Navigate to={app?.path} replace />} />
        </Route>
      </Routes>
    </RootRouter>
  )
}

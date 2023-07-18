import React from 'react'
import sdk from '@micro/sdk'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <div>
        <h1>runtime</h1>
        <ul>
          <li onClick={() => sdk.navigation.push('/')}>root</li>
          {sdk.app.filterByField('mode', 'APPLICATION').map((app) => (
            <li key={app.path} onClick={() => sdk.navigation.push(app.path as string)}>
              {app.name}
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </>
  )
}

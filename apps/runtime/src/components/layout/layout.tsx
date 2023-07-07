import React from 'react'
import sdk from '@micro/sdk'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <div>
        <h1>runtime</h1>
        <ul>
          <li onClick={() => sdk.navigation.push('/home')}>home</li>
          <li onClick={() => sdk.navigation.push('/dashboard')}>dashboard</li>
        </ul>
      </div>
      <Outlet />
    </>
  )
}

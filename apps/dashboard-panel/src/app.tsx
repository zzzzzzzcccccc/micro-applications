import React, { useEffect, useState } from 'react'
import sdk from '@micro/sdk'

export default function App() {
  const [message, setMessage] = useState<string>(sdk.context.get('dashboard')?.message || '')

  const handleOnChange = (event: React.MouseEvent<HTMLInputElement>) => {
    sdk.context.dispatch('dashboard', { message: (event.target as HTMLInputElement).value || '' })
  }

  useEffect(() => {
    const off = sdk.context.on('dashboard', (context) => {
      setMessage(context?.message || '')
    })
    return () => off()
  }, [])

  return (
    <div>
      dashboard-panel by react-component
      <input value={message} onChange={handleOnChange} />
    </div>
  )
}

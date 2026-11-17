'use client' // Error boundaries must be Client Components
import { useEffect } from 'react'

export default function ErrorPage({error, retry}: {error: unknown, retry: () => void}) {
    useEffect(() => {
        console.error(error)
    }, [error])
    return (
        <div>
        <h2>Failed to login</h2>
        <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
'use client' // Error boundaries must be Client Components
import { useEffect } from 'react'

export default function ErrorPage({error, retry}: {error: unknown, retry: () => void}) {
    useEffect(() => {
        console.error(error)
    }, [error])
    return (
        <div>
        <h2>Something went wrong while loading Drop page</h2>
        <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
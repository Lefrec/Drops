'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function SearchBox() {
    const router = useRouter()
    const params = useSearchParams()

    const onSearch = useDebouncedCallback((search: string) => {
        const nextURL = new URLSearchParams(params)
        if (search) nextURL.set('search', search); else nextURL.delete('search')
        router.replace(`?${nextURL}`)
    }, 300) // <- debounce timer

    return <input defaultValue={params.get('search') ?? ''} onChange={(e) => onSearch(e.target.value)} />
}
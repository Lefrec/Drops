'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Field, FieldLabel } from "@/components/ui/field"

export function SearchBox() {
    const router = useRouter()
    const params = useSearchParams()

    const onSearch = useDebouncedCallback((q: string) => {
        const nextURL = new URLSearchParams(params)
        if (q) nextURL.set('q', q); else nextURL.delete('q')
        router.replace(`?${nextURL}`)
    }, 300) // <- debounce timer

    return (
        <Field className="max-w-sm">
            <FieldLabel className="sr-only" htmlFor="drop-search">Rechercher des drops</FieldLabel>
            <input
                id="drop-search"
                type="search"
                defaultValue={params.get('q') ?? ''}
                onChange={(e) => onSearch(e.target.value)}
            />
        </Field>
    )
}
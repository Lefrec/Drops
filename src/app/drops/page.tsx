import Link from "next/link"
import { SearchParams } from "next/dist/server/request/search-params"
import { Suspense } from "react"

import { getSessionToken } from "@/lib/session"
import { apiGet } from "@/lib/api/client"
import type { DropPage } from "@/lib/api/types"

import { SearchBox } from "@/components/search/searchbox"
import { Categories } from "@/components/search/categories"
import { LoginRequired } from "@/components/auth/login_required"
import { DropsExplorer } from "@/components/drops/drops_explorer"

export default function DropPage({searchParams}: {searchParams: Promise<SearchParams>}) {
  return (
    <main className="flex flex-col">
      <header className="flex flex-row items-center justify-between">
        <h1>Drops</h1>
        <Link href="/drops/add" className="border border-white px-3 py-2">
          Créer un drop
        </Link>
      </header>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropsContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DropsContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const token = await getSessionToken()
  if (!token) return <LoginRequired action="consulter les drops" />

  const params = await searchParams
  const apiParams = new URLSearchParams()
  const query = typeof params.q === "string" ? params.q.trim() : ""
  const category = typeof params.category === "string" ? params.category : undefined
  
  if (query) apiParams.set("q", query)
  if (category) apiParams.set("category", category)
  
  const apiQuery = apiParams.toString()
  const drops = await apiGet<DropPage>(`/drops${apiQuery ? `?${apiQuery}` : ""}`, token)

  return (
    <>
      <Suspense fallback={null}>
        <SearchBox />
        <nav className="category-filters" aria-label="Filtrer par catégorie">
          <Categories searchParams={searchParams} token={token} />
        </nav>
      </Suspense>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropsExplorer drops={drops} query={query} category={category}/>
      </Suspense>
    </>
  )
}

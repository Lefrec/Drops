import { SearchBox } from "@/components/search/searchbox"
import { Categories } from "@/components/search/categories"
import { Suspense } from "react"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropList } from "@/components/drops/drop_list"
import Link from "next/link"
import { getSessionToken } from "@/lib/session"
import { LoginRequired } from "@/components/auth/login_required"

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

  return (
    <>
      <Suspense fallback={null}>
        <SearchBox />
        <nav className="category-filters" aria-label="Filtrer par catégorie">
          <Categories searchParams={searchParams} token={token} />
        </nav>
      </Suspense>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropList searchParams={searchParams} token={token} />
      </Suspense>
    </>
  )
}

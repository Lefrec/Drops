import { SearchBox } from "@/app/drops/searchbox"
import { Categories } from "@/app/drops/categories"
import { Suspense } from "react"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropList } from "./drop_list"
import Link from "next/link"

export default function DropPage({searchParams}: {searchParams: Promise<SearchParams>}) {
  return (
    <main className="flex flex-col">
      <header className="flex flex-row items-center justify-between">
        <h1>Drops</h1>
        <Link href="/drops/add" className="border border-white px-3 py-2">
          Créer un drop
        </Link>
      </header>
      <Suspense fallback={null}>
        <SearchBox/>
        <nav className="category-filters" aria-label="Filtrer par catégorie">
          <Categories searchParams={searchParams}/>
        </nav>
      </Suspense>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropList searchParams={searchParams}/>
      </Suspense>
    </main>
  )
}


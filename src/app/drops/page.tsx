import { SearchBox } from "@/app/drops/searchbox"
import { Categories } from "@/app/drops/categories"
import { Suspense } from "react"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropList } from "./drop_list"

export default function DropPage({searchParams}: {searchParams: Promise<SearchParams>}) {
  return (
    <main className="flex flex-col">
      <h1>Drops</h1>
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


import { SearchBox } from "@/app/drops/searchbox"
import { Categories } from "@/app/drops/categories"
import { Suspense } from "react"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropList } from "./drop_list"

export default function DropPage({searchParams}: {searchParams: Promise<SearchParams>}) {
  return (
    <main className="flex flex-col">
      <Suspense fallback={null}>
        <SearchBox/>
        ErrorBoundary
        <div className="flex">
          <Categories searchParams={searchParams}/>
        </div>
      </Suspense>
      <Suspense fallback={<p>Chargement des drops...</p>}>
        <DropList searchParams={searchParams}/>
      </Suspense>
    </main>
  )
}


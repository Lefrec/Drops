import { SearchBox } from "@/components/drops/searchbox"
import { Categories } from "@/components/drops/categories"
import { Suspense } from "react"
import { SearchParams } from "next/dist/server/request/search-params"

export default function DropList({searchParams}: {searchParams: Promise<SearchParams>}) {
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <SearchBox/>
      </Suspense>
      <Suspense fallback={null}>
        <div className="flex">
            <Categories searchParams={searchParams}/>
        </div>
      </Suspense>
    </div>
  )
}
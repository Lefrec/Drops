import { apiGet } from "@/lib/api/client"
import { DropPage } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropCard } from "./drop_card"

export async function DropList({searchParams}: {searchParams: Promise<SearchParams>}) {
  const params = await searchParams
  const apiParams = new URLSearchParams()

  if (typeof params.search === "string" && params.search.trim()) {
    apiParams.set("q", params.search.trim())
  }
  if (typeof params.cat === "string") {
    apiParams.set("category", params.cat)
  }

  const query = apiParams.toString()
  const drops = await apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`)

  if (drops.items.length === 0) {
    return <p>Aucun drop trouvé.</p>
  }

  return (
    <ul>
      {drops.items.map((drop) => (
        <li key={drop.id}>
          <DropCard drop={drop}/>
        </li>
      ))}
    </ul>
  )
}
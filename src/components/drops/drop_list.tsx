import { apiGet } from "@/lib/api/client"
import { DropPage } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropCard } from "./drop_card"
import { requireSession } from "@/lib/session"

export async function DropList({searchParams}: {searchParams: Promise<SearchParams>}) {
  const params = await searchParams
  const apiParams = new URLSearchParams()

  if (typeof params.q === "string" && params.q.trim()) {
    apiParams.set("q", params.q.trim())
  }
  if (typeof params.category === "string") {
    apiParams.set("category", params.category)
  }

  console.log(params)
  console.log(apiParams)

  const query = apiParams.toString()
  const drops = await apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`, await requireSession())

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
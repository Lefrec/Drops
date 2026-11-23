import { apiGet } from "@/lib/api/client"
import { DropPage } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import { DropCard } from "./drop_card"

export async function DropList({
  searchParams,
  token,
}: {
  searchParams: Promise<SearchParams>
  token: string
}) {
  const params = await searchParams
  const apiParams = new URLSearchParams()

  if (typeof params.q === "string" && params.q.trim()) {
    apiParams.set("q", params.q.trim())
  }
  if (typeof params.category === "string") {
    apiParams.set("category", params.category)
  }

  const query = apiParams.toString()
  const drops = await apiGet<DropPage>(`/drops${query ? `?${query}` : ""}`, token)

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
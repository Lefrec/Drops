import { apiGet } from "@/lib/api/client"
import { DropPage } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import { LiveDropList } from "./live_drop_list"

export async function DropList({
  searchParams,
  token,
}: {
  searchParams: Promise<SearchParams>
  token: string
}) {
  const params = await searchParams
  const apiParams = new URLSearchParams()
  const query = typeof params.q === "string" ? params.q.trim() : ""
  const category = typeof params.category === "string" ? params.category : undefined

  if (query) apiParams.set("q", query)
  if (category) apiParams.set("category", category)

  const apiQuery = apiParams.toString()
  const drops = await apiGet<DropPage>(`/drops${apiQuery ? `?${apiQuery}` : ""}`, token)

  return (
    <LiveDropList
      initialDrops={drops.items}
      pageSize={drops.pageSize}
      query={query}
      category={category}
    />
  )
}
import { DropPage } from "@/lib/api/types"
import { LiveDropList } from "./live_drop_list"

interface Props {
    drops: DropPage
    query: string
    category?: string 
}

export function DropList({ drops, query, category }: Props) {
  return (
    <LiveDropList
      initialDrops={drops.items}
      pageSize={drops.pageSize}
      query={query}
      category={category}
    />
  )
}
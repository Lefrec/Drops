import { DropPage } from "@/lib/api/types"
import { LiveDropList } from "./live_drop_list"

interface Props {
    drops: DropPage
    query: string
    category?: string 
    setActive: any
}

export function DropList({ drops, query, category, setActive }: Props) {
  return (
    <LiveDropList
      initialDrops={drops.items}
      pageSize={drops.pageSize}
      query={query}
      category={category}
      setActive={setActive}
    />
  )
}
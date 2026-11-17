'use client'
import type { Drop } from "@/lib/api/types"
import { useEffect, useState } from "react"

export function DropCard({ drop }: { drop: Drop }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article>
      <header>
        <h2>{drop.title}</h2>
        <p>{drop.category}</p>
        <p>Par {drop.author.displayName}</p>
      </header>
      {drop.content && <p>{drop.content}</p>}
      <footer>
        <p>{drop.likesCount} j'aime</p>
        <p>{drop.commentsCount} commentaires</p>
      </footer>
    </article>
  )
}
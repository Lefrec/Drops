"use client"

import { useEffect, useRef, useState } from "react"
import { CommentItem } from "@/components/comments/comment_item"
import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import type { Comment } from "@/lib/api/types"

type CommentsState = {
  items: Comment[]
  total: number
}

interface Props {
  dropId: number
  initialComments: Comment[]
  initialTotal: number
}

export function LiveCommentList({
  dropId,
  initialComments,
  initialTotal,
}: Props) {
  const [comments, setComments] = useState<CommentsState>({
    items: initialComments,
    total: initialTotal,
  })
  const initialStateKey = JSON.stringify({ dropId, initialComments, initialTotal })
  const appliedInitialStateKey = useRef(initialStateKey)
  const deletedCommentIds = useRef(new Set<number>())

  useEffect(() => {
    if (appliedInitialStateKey.current === initialStateKey) return
    appliedInitialStateKey.current = initialStateKey
    setComments({ items: initialComments, total: initialTotal })
  }, [initialComments, initialStateKey, initialTotal])

  useRealtimeEvent<{ comment: Comment }>("comment:created", ({ comment }) => {
    if (comment.dropId !== dropId) return

    setComments((current) => {
      if (current.items.some((item) => item.id === comment.id)) return current
      return {
        items: [...current.items, comment],
        total: current.total + 1,
      }
    })
  })

  useRealtimeEvent<{ dropId: number; commentId: number }>("comment:deleted", (data) => {
    if (data.dropId !== dropId || deletedCommentIds.current.has(data.commentId)) return

    deletedCommentIds.current.add(data.commentId)
    setComments((current) => ({
      items: current.items.filter((comment) => comment.id !== data.commentId),
      total: Math.max(0, current.total - 1),
    }))
  })

  return (
    <section className="flex flex-col gap-4" aria-labelledby="comments-heading">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 id="comments-heading">Commentaires</h2>
        <p className="text-sm text-muted-foreground">{comments.total}</p>
      </div>
      {comments.items.length === 0 ? (
        <p className="text-muted-foreground">Pas encore de commentaires.</p>
      ) : (
        <ul>
          {comments.items.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  )
}

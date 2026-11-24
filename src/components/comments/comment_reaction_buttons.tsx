"use client"

import { useActionState, useEffect, useOptimistic, useState } from "react"
import { toggleCommentDislike, toggleCommentLike } from "@/app/drops/actions"
import { Button } from "@/components/ui/button"
import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import type { ActionState, Comment } from "@/lib/api/types"

interface Props {
  commentId: number
  liked: boolean
  disliked: boolean
  likesCount: number
  dislikesCount: number
}

export function CommentReactionButtons({
  commentId,
  liked,
  disliked,
  likesCount,
  dislikesCount,
}: Props) {
  const [serverState, setServerState] = useState({
    liked,
    disliked,
    likesCount,
    dislikesCount,
  })

  useEffect(() => {
    setServerState({ liked, disliked, likesCount, dislikesCount })
  }, [liked, disliked, likesCount, dislikesCount])

  useRealtimeEvent<{ comment: Comment }>("comment:updated", ({ comment }) => {
    if (comment.id !== commentId) return
    setServerState({
      liked: comment.likedByMe,
      disliked: comment.dislikedByMe,
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
    })
  })

  const [optimisticState, setOptimisticState] = useOptimistic(serverState)

  const [likeState, likeAction, likePending] = useActionState<ActionState, FormData>(async () => {
    const nextLiked = !serverState.liked
    setOptimisticState({
      ...serverState,
      liked: nextLiked,
      disliked: nextLiked ? false : serverState.disliked,
      likesCount: serverState.likesCount + (nextLiked ? 1 : -1),
      dislikesCount: nextLiked && serverState.disliked
        ? serverState.dislikesCount - 1
        : serverState.dislikesCount,
    })
    const result = await toggleCommentLike(commentId, serverState.liked)
    if (!result.error) {
      setServerState((current) => ({
        liked: nextLiked,
        disliked: nextLiked ? false : current.disliked,
        likesCount: current.likesCount + (nextLiked ? 1 : -1),
        dislikesCount: nextLiked && current.disliked ? current.dislikesCount - 1 : current.dislikesCount,
      }))
    }
    return result
  }, {})

  const [dislikeState, dislikeAction, dislikePending] = useActionState<ActionState, FormData>(async () => {
    const nextDisliked = !serverState.disliked
    setOptimisticState({
      ...serverState,
      disliked: nextDisliked,
      liked: nextDisliked ? false : serverState.liked,
      dislikesCount: serverState.dislikesCount + (nextDisliked ? 1 : -1),
      likesCount: nextDisliked && serverState.liked
        ? serverState.likesCount - 1
        : serverState.likesCount,
    })
    const result = await toggleCommentDislike(commentId, serverState.disliked)
    if (!result.error) {
      setServerState((current) => ({
        disliked: nextDisliked,
        liked: nextDisliked ? false : current.liked,
        dislikesCount: current.dislikesCount + (nextDisliked ? 1 : -1),
        likesCount: nextDisliked && current.liked ? current.likesCount - 1 : current.likesCount,
      }))
    }
    return result
  }, {})

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={likeAction}>
        <Button type="submit" variant="outline" size="sm" disabled={likePending} aria-pressed={optimisticState.liked}>
          {optimisticState.liked ? "♥" : "♡"} {optimisticState.likesCount}
        </Button>
      </form>
      <form action={dislikeAction}>
        <Button type="submit" variant="outline" size="sm" disabled={dislikePending} aria-pressed={optimisticState.disliked}>
          {optimisticState.disliked ? "▼" : "▽"} {optimisticState.dislikesCount}
        </Button>
      </form>
      {(likeState.error || dislikeState.error) && (
        <p role="alert" className="text-sm text-destructive">
          {likeState.error || dislikeState.error}
        </p>
      )}
    </div>
  )
}

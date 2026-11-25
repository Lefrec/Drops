"use client"

import { useActionState, useEffect, useOptimistic, useState } from "react"
import {
  toggleCommentDislike,
  toggleCommentLike,
  toggleDislike,
  toggleLike,
} from "@/app/drops/actions"
import { Button } from "@/components/ui/button"
import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import type { ActionState, Comment } from "@/lib/api/types"

type Props = {
  id: number
  liked: boolean
  disliked: boolean
  likesCount: number
  dislikesCount: number
} & (
  | { type: "drop" }
  | { type: "comment" }
)

type ReactionState = Pick<Props, "liked" | "disliked" | "likesCount" | "dislikesCount">

export function ReactionButtons({
  type,
  id,
  liked,
  disliked,
  likesCount,
  dislikesCount,
}: Props) {
  const [serverState, setServerState] = useState<ReactionState>({
    liked,
    disliked,
    likesCount,
    dislikesCount,
  })

  useEffect(() => {
    setServerState({ liked, disliked, likesCount, dislikesCount })
  }, [liked, disliked, likesCount, dislikesCount])

  useRealtimeEvent<{ dropId: number; likesCount: number; dislikesCount: number }>(
    "like:updated",
    (data) => {
      if (type !== "drop" || data.dropId !== id) return
      setServerState((current) => ({
        ...current,
        likesCount: data.likesCount,
        dislikesCount: data.dislikesCount,
      }))
    },
  )

  useRealtimeEvent<{ comment: Comment }>("comment:updated", ({ comment }) => {
    if (type !== "comment" || comment.id !== id) return
    setServerState({
      liked: comment.likedByMe,
      disliked: comment.dislikedByMe,
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
    })
  })

  const [optimisticState, setOptimisticState] = useOptimistic(serverState)

  const [likeResult, likeAction, likePending] = useActionState<ActionState, FormData>(
    async () => {
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
      return type === "drop"
        ? toggleLike(id, serverState.liked)
        : toggleCommentLike(id, serverState.liked)
    },
    {},
  )

  const [dislikeResult, dislikeAction, dislikePending] = useActionState<ActionState, FormData>(
    async () => {
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
      const result = await (type === "drop"
        ? toggleDislike(id, serverState.disliked)
        : toggleCommentDislike(id, serverState.disliked))

      return result
    },
    {},
  )

  const pending = likePending || dislikePending

  return (
    <div className="flex w-fit flex-col items-stretch gap-1">
      <form action={likeAction}>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={pending}
          aria-pressed={optimisticState.liked}
          aria-label={`J’aime (${optimisticState.likesCount})`}
        >
          <span aria-hidden="true">{optimisticState.liked ? "▲" : "△"}</span>
          {optimisticState.likesCount}
        </Button>
      </form>
      <form action={dislikeAction}>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={pending}
          aria-pressed={optimisticState.disliked}
          aria-label={`Je n’aime pas (${optimisticState.dislikesCount})`}
        >
          <span aria-hidden="true">{optimisticState.disliked ? "▼" : "▽"}</span>
          {optimisticState.dislikesCount}
        </Button>
      </form>
      {(likeResult.error || dislikeResult.error) && (
        <p role="alert" className="text-sm text-destructive">
          {likeResult.error || dislikeResult.error}
        </p>
      )}
    </div>
  )
}

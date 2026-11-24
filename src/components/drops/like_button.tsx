'use client'

import { useActionState, useEffect, useOptimistic, useState } from "react";
import { toggleDislike, toggleLike } from "@/app/drops/actions";
import { Button } from "@/components/ui/button"
import { useRealtimeEvent } from "@/hooks/user-realtime-event";
import type { ActionState } from "@/lib/api/types"

export function LikeButton({
    dropId,
    liked,
    disliked,
    likesCount,
    dislikesCount,
}: {
    dropId: number
    liked: boolean
    disliked: boolean
    likesCount: number
    dislikesCount: number
}) {
    const [serverLike, setServerLike] = useState({ liked, disliked, likesCount, dislikesCount })

    useEffect(() => {
        setServerLike({ liked, disliked, likesCount, dislikesCount })
    }, [liked, disliked, likesCount, dislikesCount])

    useRealtimeEvent<{ dropId: number; likesCount: number; dislikesCount: number }>('like:updated', (data) => {
        if (data.dropId !== dropId) return
        setServerLike((current) => ({
            ...current,
            likesCount: data.likesCount,
            dislikesCount: data.dislikesCount,
        }))
    })

    const [optimisticLike, setOptimisticLike] = useOptimistic(serverLike)

    const [likeState, likeAction, likePending] = useActionState<ActionState, FormData>(async () => {
        const nextLiked = !serverLike.liked
        setOptimisticLike({
            ...serverLike,
            liked: nextLiked,
            disliked: nextLiked ? false : serverLike.disliked,
            likesCount: serverLike.likesCount + (nextLiked ? 1 : -1),
            dislikesCount: nextLiked && serverLike.disliked
                ? serverLike.dislikesCount - 1
                : serverLike.dislikesCount,
        })
        const result = await toggleLike(dropId, serverLike.liked)
        return result
    }, {})

    const [dislikeState, dislikeAction, dislikePending] = useActionState<ActionState, FormData>(async () => {
        const nextDisliked = !serverLike.disliked
        setOptimisticLike({
            ...serverLike,
            disliked: nextDisliked,
            liked: nextDisliked ? false : serverLike.liked,
            dislikesCount: serverLike.dislikesCount + (nextDisliked ? 1 : -1),
            likesCount: nextDisliked && serverLike.liked
                ? serverLike.likesCount - 1
                : serverLike.likesCount,
        })
        const result = await toggleDislike(dropId, serverLike.disliked)
        return result
    }, {})

    return (
        <div className="flex items-center gap-2">
            <form action={likeAction} className="w-fit! max-w-none! flex-row! items-center">
                <Button type="submit" variant="outline" disabled={likePending} aria-pressed={optimisticLike.liked}>
                    {optimisticLike.liked ? '♥' : '♡'} {optimisticLike.likesCount}
                </Button>
                {likeState.error && <p role="alert">{likeState.error}</p>}
            </form>
            <form action={dislikeAction} className="w-fit! max-w-none! flex-row! items-center">
                <Button type="submit" variant="outline" disabled={dislikePending} aria-pressed={optimisticLike.disliked}>
                    {optimisticLike.disliked ? '▼' : '▽'} {optimisticLike.dislikesCount}
                </Button>
                {dislikeState.error && <p role="alert">{dislikeState.error}</p>}
            </form>
        </div>
    )
}
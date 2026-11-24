'use client'

import { useActionState, useEffect, useOptimistic, useState } from "react";
import { toggleLike } from "@/app/drops/actions";
import { Button } from "@/components/ui/button"
import { useRealtimeEvent } from "@/hooks/user-realtime-event";
import type { ActionState } from "@/lib/api/types"

export function LikeButton({dropId, liked, likesCount}: {dropId: number, liked: boolean, likesCount: number}) {
    const [serverLike, setServerLike] = useState({ liked, likesCount})

    useEffect(() => {
        setServerLike({ liked, likesCount })
    }, [liked, likesCount])

    useRealtimeEvent<{ dropId: number; likesCount: number }>('like:updated', (data) => {
        if (data.dropId !== dropId) return
        setServerLike((current) => ({...current, likesCount: data.likesCount}))
    })

    const [optimisticLike, setOptimisticLike] = useOptimistic(serverLike)

    const [state, action, pending] = useActionState<ActionState, FormData>(async () => {
        const nextLiked = !serverLike.liked
        setOptimisticLike({
            liked: nextLiked,
            likesCount: serverLike.likesCount + (nextLiked ? 1 : -1),
        })
        const result = await toggleLike(dropId, serverLike.liked)
        if (!result.error) {
            setServerLike((current) => ({...current, liked: nextLiked}))
        }
        return result
    }, {})

    return (
        <form action={action} className="w-fit! max-w-none! flex-row! items-center gap-2">
            <Button type="submit" variant="outline" disabled={pending} aria-pressed={optimisticLike.liked}>
                {optimisticLike.liked ? '♥' : '♡'} {optimisticLike.likesCount}
            </Button>
            {state.error && <p role="alert">{state.error}</p>}
        </form>
    )
}
'use client'

import { useActionState, useOptimistic } from "react";
import { toggleLike } from "@/app/drops/actions";
import { Button } from "@/components/ui/button"

export function LikeButton({dropId, liked, likesCount}: {dropId: number, liked: boolean, likesCount: number}) {
    const [optimisticLike, setOptimisticLike] = useOptimistic(
        { liked, likesCount },
        (current, nextLiked: boolean) => ({
            liked: nextLiked,
            likesCount: current.likesCount + (nextLiked ? 1 : -1),
        })
    )

    const [state, action, pending] = useActionState(async () => {
        setOptimisticLike(!liked)
        return toggleLike(dropId, liked)
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
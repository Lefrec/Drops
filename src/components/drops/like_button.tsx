'use client'

import { useActionState, useOptimistic } from "react";
import { toggleLike } from "@/app/drops/actions";
import { Button } from "@/components/ui/button"

export function LikeButton({dropId, liked, likesCount}: {dropId: number, liked: boolean, likesCount: number}) {
    const [optimisticLike, setOptimisticLike] = useOptimistic(
        { liked, likesCount },
        (s) => ({liked: !s.liked, likesCount: s.likesCount + (s.liked ? -1 : +1)})
    )

    const [state, action, pending] = useActionState(async () => {
        setOptimisticLike
        return toggleLike(dropId, liked)
    }, {})

    return (
        <form action={action}>
            <Button type="submit" disabled={pending} aria-pressed={optimisticLike.liked}>
                {optimisticLike.liked ? '♥' : '♡'} {optimisticLike.likesCount}
            </Button>
            {state.error && <p role="alert">{state.error}</p>}
        </form>
    )
}
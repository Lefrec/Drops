'use client'

import { useActionState, useOptimistic } from "react";
import { toggleLike } from "./actions";

export function LikeButton({dropId, liked, likesCount}: {dropId: number, liked: boolean, likesCount: number}) {
    const [optimistic, toggle] = useOptimistic(
        { liked, likesCount },
        (s) => ({liked: !s.liked, likesCount: s.likesCount + (s.liked ? -1 : +1)})
    )

    const [state, action, pending] = useActionState(async () => {
        toggle
        return toggleLike(dropId, liked)
    }, {})

    return (
        <form action={action}>
            <button disabled={pending} aria-pressed={optimistic.liked}>
                {optimistic.liked ? '♥' : '♡'} {optimistic.likesCount}
            </button>
            {state.error && <p role="alert">{state.error}</p>}
        </form>
    )
}
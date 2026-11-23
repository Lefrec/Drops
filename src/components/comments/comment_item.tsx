import type { Comment } from "@/lib/api/types"
import { UserAvatar } from "@/components/users/user_avatar"
import Link from "next/link"

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li className="min-w-0 border-b border-border py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Link
          href={`/users/${encodeURIComponent(comment.author.username)}`}
          aria-label={`Voir le profil de ${comment.author.displayName}`}
        >
          <UserAvatar
            displayName={comment.author.displayName}
            avatarUrl={comment.author.avatarUrl}
          />
        </Link>
        <div className="flex min-w-0 flex-col gap-1">
          <Link
            className="font-medium underline-offset-4 hover:underline"
            href={`/users/${encodeURIComponent(comment.author.username)}`}
          >
            {comment.isMine ? "Vous" : comment.author.displayName}
          </Link>
          <Link
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            href={`/users/${encodeURIComponent(comment.author.username)}`}
          >
            @{comment.author.username}
          </Link>
          <p className="mt-2 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      </div>
    </li>
  )
}

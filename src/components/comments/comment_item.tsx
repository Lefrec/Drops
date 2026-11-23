import type { Comment } from "@/lib/api/types"
import { UserAvatar } from "@/components/users/user_avatar"

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li className="min-w-0 border-b border-border py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <UserAvatar
          displayName={comment.author.displayName}
          avatarUrl={comment.author.avatarUrl}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-medium">
            {comment.isMine ? "Vous" : comment.author.displayName}
          </p>
          <p className="text-sm text-muted-foreground">@{comment.author.username}</p>
          <p className="mt-2 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      </div>
    </li>
  )
}

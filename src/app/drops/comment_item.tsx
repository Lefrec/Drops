import type { Comment } from "@/lib/api/types"

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li>
      <div className="flex gap-3">
        {comment.author.avatarUrl ? (
          <img
            className="h-9 w-9 rounded-full object-cover"
            src={comment.author.avatarUrl}
            alt=""
            width={36}
            height={36}
          />
        ) : (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm"
            aria-hidden="true"
          >
            {comment.author.displayName.slice(0, 1).toUpperCase() || "?"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {comment.isMine ? "Vous" : comment.author.displayName}
          </p>
          <p className="text-sm text-white/55">@{comment.author.username}</p>
          <p className="mt-2 whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      </div>
    </li>
  )
}

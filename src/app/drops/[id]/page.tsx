import { Suspense } from "react"
import { ApiError, apiGet } from "@/lib/api/client"
import { notFound } from "next/navigation"
import type { Category, CommentPage, Drop } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { LoginRequired } from "@/components/auth/login_required"
import { CommentItem } from "@/components/comments/comment_item"
import { CommentButton } from "@/components/comments/comment_button"
import { LikeButton } from "@/components/drops/like_button"
import { DeleteDropButton } from "@/components/drops/delete_drop_button"
import { DropEditForm } from "@/components/drops/drop_edit_form"
import { UserAvatar } from "@/components/users/user_avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function DropPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<p>Chargement du drop...</p>}>
        <DropContent params={params} />
      </Suspense>
    </main>
  )
} 

async function DropContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await getSessionToken()
  if (!token) return <LoginRequired action="consulter ce drop" />

  let drop: Drop
  let comments: CommentPage
  try {
    [drop, comments] = await Promise.all([
      apiGet<Drop>(`/drops/${id}`, token),
      apiGet<CommentPage>(`/drops/${id}/comments?pageSize=50`, token),
    ])
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
  const categories = drop.isMine
    ? await apiGet<Category[]>("/categories", token)
    : []

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-5 border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground">Drop #{drop.id}</p>
              <Badge className="capitalize" variant="outline">{drop.category}</Badge>
            </div>
            <h1 className="break-words text-3xl font-semibold tracking-tight">
              {drop.title}
            </h1>
          </div>
          {drop.isMine && (
            <div className="flex flex-wrap gap-2">
              <DropEditForm drop={drop} categories={categories} />
              <DeleteDropButton dropId={drop.id} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/users/${encodeURIComponent(drop.author.username)}`}
            aria-label={`Voir le profil de ${drop.author.displayName}`}
          >
            <UserAvatar
              displayName={drop.author.displayName}
              avatarUrl={drop.author.avatarUrl}
              size="lg"
            />
          </Link>
          <div className="min-w-0">
            <Link
              className="block font-medium underline-offset-4 hover:underline"
              href={`/users/${encodeURIComponent(drop.author.username)}`}
            >
              {drop.isMine ? "Vous" : drop.author.displayName}
            </Link>
            <Link
              className="block text-sm text-muted-foreground underline-offset-4 hover:underline"
              href={`/users/${encodeURIComponent(drop.author.username)}`}
            >
              @{drop.author.username}
            </Link>
          </div>
        </div>
      </header>

      {drop.imageUrl && (
        <img
          src={drop.imageUrl}
          alt={`Image du drop ${drop.title}`}
          className="max-h-[32rem] w-full border border-border bg-card object-contain"
        />
      )}

      <Card>
        <CardContent>
          <p className="whitespace-pre-wrap break-words leading-7">
            {drop.content ?? "Aucun texte pour ce drop."}
          </p>
        </CardContent>
      </Card>

      <div
        role="group"
        aria-label="Actions du drop"
        className="flex flex-wrap items-center justify-end gap-3 border-y border-border py-4"
      >
        <LikeButton
          dropId={drop.id}
          liked={drop.likedByMe}
          likesCount={drop.likesCount}
        />
        <CommentButton dropId={drop.id} />
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="comments-heading">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 id="comments-heading">Commentaires</h2>
          <p className="text-sm text-muted-foreground">{comments.total}</p>
        </div>
        {comments.items.length === 0 ? (
          <p className="text-muted-foreground">Pas encore de commentaires.</p>
        ) : (
          <ul>
            {comments.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
        )}
        {comments.total > comments.items.length && (
          <p className="text-sm text-muted-foreground">
            Affichage des {comments.items.length} premiers commentaires sur {comments.total}.
          </p>
        )}
      </section>
    </article>
  )
}
import { Suspense } from "react"
import { ApiError, apiGet } from "@/lib/api/client"
import { notFound } from "next/navigation"
import type { Category, CommentPage, Drop } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { LoginRequired } from "@/components/auth/login_required"
import { LiveCommentList } from "@/components/comments/live_comment_list"
import { CommentButton } from "@/components/comments/comment_button"
import { ReactionButtons } from "@/components/likes/reaction_buttons"
import { DeleteDropButton } from "@/components/drops/delete_drop_button"
import { DropEditForm } from "@/components/drops/drop_edit_form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PresenceWidget } from "@/components/drops/presence_widget"
import { LocationMap } from "@/components/map/location_map"
import { AuthorInfo } from "@/components/users/author_info"

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
        <AuthorInfo author={drop.author} link={true}/>
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

      <section aria-labelledby="drop-location-heading" className="flex flex-col gap-3">
        <h2 id="drop-location-heading" className="text-xl font-semibold">Emplacement</h2>
        <LocationMap
          location={drop.location}
          interactive
          className="h-80 w-full overflow-hidden rounded-md border border-border"
        />
      </section>

      <div
        role="group"
        aria-label="Actions du drop"
        className="flex flex-wrap items-center justify-end gap-3 border-y border-border py-4"
      >
        <PresenceWidget dropId={Number(id)}/>
        <ReactionButtons
          type="drop"
          id={drop.id}
          liked={drop.likedByMe}
          disliked={drop.dislikedByMe}
          likesCount={drop.likesCount}
          dislikesCount={drop.dislikesCount}
        />
        <CommentButton dropId={drop.id} />
      </div>

      <LiveCommentList
        dropId={drop.id}
        initialComments={comments.items}
        initialTotal={comments.total}
      />
    </article>
  )
}
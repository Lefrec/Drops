import { Suspense } from "react"
import Link from "next/link"
import { apiGet } from "@/lib/api/client"
import type { CommentPage, Drop } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { CommentItem } from "../comment_item"
import { CommentButton } from "../comment_button"
import { LikeButton } from "../like_button"
import { DeleteDropButton } from "../delete_drop_button"

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
  const token = await requireSession()
  const [drop, comments] = await Promise.all([
    apiGet<Drop>(`/drops/${id}`, token),
    apiGet<CommentPage>(`/drops/${id}/comments?pageSize=50`, token),
  ])

  return (
    <article>
      <header>
        <p>Drop #{drop.id} · {drop.category}</p>
        <h1>{drop.title}</h1>
        <p>
          Par {drop.isMine ? "moi" : drop.author.displayName} (@{drop.author.username})
        </p>
        {drop.isMine && (
          <div className="flex flex-wrap gap-2">
            <Link href={`/drops/${drop.id}/edit`}>Modifier mon drop</Link>
            <DeleteDropButton dropId={drop.id} />
          </div>
        )}
        {drop.author.avatarUrl && (
          <img
            src={drop.author.avatarUrl}
            alt={`Avatar de ${drop.author.displayName}`}
            width={64}
            height={64}
          />
        )}
      </header>

      {drop.imageUrl && (
        <img
          src={drop.imageUrl}
          alt={`Image du drop ${drop.title}`}
          className="w-full max-h-128 object-contain"
        />
      )}

      <p>{drop.content ?? "Aucun texte pour ce drop."}</p>

      <footer>
        <LikeButton
          dropId={drop.id}
          liked={drop.likedByMe}
          likesCount={drop.likesCount}
        />
        <CommentButton dropId={drop.id} />
      </footer>

      <section aria-labelledby="comments-heading">
        <h2 id="comments-heading">Commentaires ({comments.total})</h2>
        {comments.items.length === 0 ? (
          <p className="mt-4 text-white/60">
            Pas encore de commentaires.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col">
            {comments.items.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </ul>
        )}
        {comments.total > comments.items.length && (
          <p className="mt-3 text-sm text-white/60">
            Affichage des {comments.items.length} premiers commentaires sur {comments.total}.
          </p>
        )}
      </section>
    </article>
  )
}
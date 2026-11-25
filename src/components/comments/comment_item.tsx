"use client"

import { useActionState, useEffect, useState } from "react"
import type { ActionState, Comment } from "@/lib/api/types"
import { UserAvatar } from "@/components/users/user_avatar"
import { DeleteCommentButton } from "@/components/comments/delete_comment_button"
import { ReactionButtons } from "@/components/likes/reaction_buttons"
import { addComment, getCommentReplies } from "@/app/drops/actions"
import { useRealtimeEvent } from "@/hooks/user-realtime-event"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import Link from "next/link"
import { AuthorInfo } from "../users/author_info"

interface Props {
  comment: Comment
  isReply?: boolean
}

export function CommentItem({ comment, isReply = false }: Props) {
  const [localComment, setLocalComment] = useState(comment)
  const [removed, setRemoved] = useState(false)
  const [replies, setReplies] = useState<Comment[]>([])
  const [repliesLoaded, setRepliesLoaded] = useState(false)
  const [repliesLoading, setRepliesLoading] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)

  useEffect(() => {
    setLocalComment(comment)
  }, [comment])

  useRealtimeEvent<{ comment: Comment }>("comment:updated", ({ comment: updated }) => {
    if (updated.id === localComment.id) setLocalComment(updated)
  })

  useRealtimeEvent<{ comment: Comment }>("comment:created", ({ comment: created }) => {
    if (isReply || created.parentId !== localComment.id) return
    setReplies((current) => (
      current.some((reply) => reply.id === created.id)
        ? current
        : [...current, created]
    ))
    setLocalComment((current) => ({
      ...current,
      repliesCount: current.repliesCount + 1,
    }))
  })

  useRealtimeEvent<{ dropId: number; commentId: number }>("comment:deleted", (data) => {
    if (data.commentId === localComment.id) {
      if (localComment.repliesCount > 0) {
        setLocalComment((current) => ({
          ...current,
          deleted: true,
          content: "",
          isMine: false,
          author: { id: 0, username: "deleted", displayName: "Commentaire supprimé", avatarUrl: null },
        }))
      } else {
        setRemoved(true)
      }
      return
    }
    setReplies((current) => {
      if (!current.some((reply) => reply.id === data.commentId)) return current
      setLocalComment((root) => ({
        ...root,
        repliesCount: Math.max(0, root.repliesCount - 1),
      }))
      return current.filter((reply) => reply.id !== data.commentId)
    })
  })

  const [replyState, replyAction, replyPending] = useActionState<ActionState | null, FormData>(
    async (_previousState, formData) => {
      const result = await addComment(localComment.dropId, formData, localComment.id)
      if (result.success) setReplyOpen(false)
      return result
    },
    null,
  )

  async function loadReplies() {
    if (repliesLoaded || repliesLoading) return
    setRepliesLoading(true)
    const result = await getCommentReplies(localComment.id)
    if (result.page) {
      setReplies(result.page.items)
      setRepliesLoaded(true)
    }
    setRepliesLoading(false)
  }

  if (removed) return null

  return (
    <li className="min-w-0 border-b border-border py-4 last:border-b-0">
      <div className="flex flex-col items-start gap-3">
        <AuthorInfo author={localComment.author} link={localComment.deleted ? false : true}/>
          <p className="mt-2 whitespace-pre-wrap break-words">
            {localComment.deleted ? "" : localComment.content}
          </p>

          {!localComment.deleted && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ReactionButtons
                type="comment"
                id={localComment.id}
                liked={localComment.likedByMe}
                disliked={localComment.dislikedByMe}
                likesCount={localComment.likesCount}
                dislikesCount={localComment.dislikesCount}
              />
              {!isReply && (
                <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                  <DialogTrigger render={<Button type="button" variant="ghost" size="sm" />}>
                    Répondre
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Répondre au commentaire</DialogTitle>
                      <DialogDescription>
                        Votre réponse sera liée à ce commentaire.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={replyAction}>
                      <FieldGroup>
                        {replyState?.fields && <FieldError>{replyState.error}</FieldError>}
                        <Field>
                          <FieldLabel htmlFor={`reply-${localComment.id}`}>Votre réponse</FieldLabel>
                          <textarea
                            id={`reply-${localComment.id}`}
                            name="content"
                            placeholder="Écrire une réponse..."
                            required
                            autoFocus
                            aria-invalid={Boolean(replyState?.fields?.content)}
                          />
                          <FieldError>{replyState?.fields?.content?.join(" ")}</FieldError>
                        </Field>
                        <DialogFooter>
                          <DialogClose render={<Button type="button" variant="outline" disabled={replyPending} />}>
                            Annuler
                          </DialogClose>
                          <Button type="submit" disabled={replyPending}>
                            {replyPending ? "Envoi..." : "Envoyer"}
                          </Button>
                        </DialogFooter>
                      </FieldGroup>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              {localComment.isMine && <DeleteCommentButton commentId={localComment.id} />}
            </div>
          )}

          {!isReply && localComment.repliesCount > 0 && (
            <div className="mt-3 border-l border-border pl-4">
              {!repliesLoaded ? (
                <Button type="button" variant="ghost" size="sm" onClick={loadReplies} disabled={repliesLoading}>
                  {repliesLoading ? "Chargement..." : `Voir ${localComment.repliesCount} réponse${localComment.repliesCount > 1 ? "s" : ""}`}
                </Button>
              ) : (
                <ul>
                  {replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
    </li>
  )
}

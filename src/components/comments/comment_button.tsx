'use client'

import { useActionState, useEffect, useState } from "react"
import { addComment } from "@/app/drops/actions";

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"

type CommentState = { error?: string; success?: boolean }

export function CommentButton({ dropId }: { dropId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, pending] = useActionState<CommentState | null, FormData>(
  (_previousState, formData) => addComment(dropId, formData),
  null
  )

  useEffect(() => {
    if (state?.error) {
      toast.add({
        title: "Erreur lors de l’ajout du commentaire",
        description: state.error,
        type: "error",
      })
    } else if (state?.success) {
      toast.add({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié.",
        type: "success",
      })
    }
  }, [state])

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "Fermer" : "Commenter"}
      </Button>
      {isOpen && (
        <form action={action} className="flex-row! items-end">
          <Field className="min-w-0 flex-1">
            <FieldLabel className="sr-only" htmlFor={`comment-${dropId}`}>
              Votre commentaire
            </FieldLabel>
            <input
              id={`comment-${dropId}`}
              name="content"
              type="text"
              placeholder="Écrire un commentaire..."
              required
            />
          </Field>
          <Button type="submit" disabled={pending}>{pending ? "Envoi..." : "Envoyer"}</Button>
        </form>
      )}
    </div>
  )
}
'use client'

import { useActionState, useState } from "react"
import { addComment } from "@/app/drops/actions";

type CommentState = { error?: string }

export function CommentButton({ dropId }: { dropId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, pending] = useActionState<CommentState, FormData>(
  (_previousState, formData) => addComment(dropId, formData),
  {}
  )

  return (
    <div className="flex gap-2">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "Fermer" : "Commenter"}
      </button>
      {isOpen && (
        <form action={action} className="flex-row!">
          <label className="sr-only" htmlFor={`comment-${dropId}`}>
            Votre commentaire
          </label>
          <input
            id={`comment-${dropId}`}
            name="content"
            type="text"
            placeholder="Écrire un commentaire..."
            required
          />
          <button type="submit" disabled={pending}>
            {pending ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      )}
      {isOpen && state.error && <p role="alert">{state.error}</p>}
    </div>
  )
}
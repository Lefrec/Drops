'use client'

import { useActionState, useRef } from "react"
import { deleteDrop } from "@/app/drops/actions";

type FormState = { error?: string }

export function DeleteDropButton({ dropId }: { dropId: number }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState<FormState, FormData>(
    () => deleteDrop(dropId),
    {},
  )

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>
        Supprimer mon drop
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-drop-title"
        className="max-w-md border border-(--border) bg-(--surface) p-6 text-foreground) backdrop:bg-black/70"
      >
        <h2 id="delete-drop-title">Supprimer ce drop ?</h2>
        <p className="my-4">Cette action est définitive.</p>
        {state.error && <p role="alert">{state.error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <form action={action}>
            <button type="submit" disabled={pending}>
              {pending ? "Suppression..." : "Oui, supprimer"}
            </button>
          </form>
          <button
            type="button"
            disabled={pending}
            onClick={() => dialogRef.current?.close()}
          >
            Annuler
          </button>
        </div>
      </dialog>
    </>
  )
}

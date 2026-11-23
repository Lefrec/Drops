'use client'

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { deleteDrop } from "@/app/drops/actions";
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

type FormState = { error?: string; success?: boolean }

export function DeleteDropButton({ dropId }: { dropId: number }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [state, action, pending] = useActionState<FormState | null, FormData>(
    () => deleteDrop(dropId),
    null,
  )

  useEffect(() => {
    if (state?.error) {
      toast.add({
        title: "Erreur lors de la suppression du drop",
        description: state.error,
        type: "error",
      })
    } else if (state?.success) {
      toast.add({
        title: "Drop supprimé",
        description: "Le drop a été supprimé.",
        type: "success",
      })
      router.push("/drops")
    }
  }, [router, state])

  return (
    <>
      <Button type="button" onClick={() => dialogRef.current?.showModal()}>
        Supprimer mon drop
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-drop-title"
        className="max-w-md border border-(--border) bg-(--surface) p-6 text-foreground) backdrop:bg-black/70"
      >
        <h2 id="delete-drop-title">Supprimer ce drop ?</h2>
        <p className="my-4">Cette action est définitive.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <form action={action}>
            <Button type="submit" disabled={pending}>
              {pending ? "Suppression..." : "Oui, supprimer"}
            </Button>
          </form>
          <Button
            type="button"
            disabled={pending}
            onClick={() => dialogRef.current?.close()}
          >
            Annuler
          </Button>
        </div>
      </dialog>
    </>
  )
}

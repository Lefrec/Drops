'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { deleteDrop } from "@/app/drops/actions";
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
import { toast } from "@/components/ui/toast"

type FormState = { error?: string; success?: boolean }

export function DeleteDropButton({ dropId }: { dropId: number }) {
  const router = useRouter()
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
    <Dialog>
      <DialogTrigger render={<Button type="button" />}>
        Supprimer mon drop
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce drop ?</DialogTitle>
          <DialogDescription>Cette action est définitive.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={action}>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Suppression..." : "Oui, supprimer"}
            </Button>
          </form>
          <DialogClose render={<Button type="button" variant="outline" disabled={pending} />}>
            Annuler
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

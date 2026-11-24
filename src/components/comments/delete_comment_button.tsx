"use client"

import { useActionState } from "react"
import { deleteComment } from "@/app/drops/actions"
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

export function DeleteCommentButton({ commentId }: { commentId: number }) {
  const [, action, pending] = useActionState<FormState | null, FormData>(
    async () => {
      const result = await deleteComment(commentId)
      if (result.error) {
        toast.add({
          title: "Erreur lors de la suppression du commentaire",
          description: result.error,
          type: "error",
        })
      } else if (result.success) {
        toast.add({
          title: "Commentaire supprimé",
          description: "Le commentaire a été supprimé.",
          type: "success",
        })
      }
      return result
    },
    null,
  )

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        Supprimer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce commentaire ?</DialogTitle>
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

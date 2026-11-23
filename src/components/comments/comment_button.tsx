'use client'

import { useActionState, useState } from "react"
import { addComment } from "@/app/drops/actions"

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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"

export function CommentButton({ dropId }: { dropId: number }) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [, action, pending] = useActionState<null, FormData>(
    async (_previousState, formData) => {
      const result = await addComment(dropId, formData)
      if (result.error) {
        toast.add({
          title: "Erreur lors de l’ajout du commentaire",
          description: result.error,
          type: "error",
        })
      } else {
        toast.add({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été publié.",
          type: "success",
        })
        setFormKey((key) => key + 1)
        setOpen(false)
      }
      return null
    },
    null,
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && pending) return
        if (!nextOpen) setFormKey((key) => key + 1)
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button type="button" variant="outline" />}>
        Commenter
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogDescription>
            Partagez votre réponse ou votre avis sur ce drop.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`comment-${dropId}`}>Votre commentaire</FieldLabel>
              <textarea
                id={`comment-${dropId}`}
                name="content"
                placeholder="Écrire un commentaire..."
                required
                autoFocus
              />
            </Field>
            <DialogFooter>
              <DialogClose
                render={<Button type="button" variant="outline" disabled={pending} />}
              >
                Annuler
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Envoi..." : "Envoyer"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
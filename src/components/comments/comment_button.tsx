'use client'

import { useActionState, useEffect, useState } from "react"
import type { ActionState } from "@/lib/api/types"
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"

export function CommentButton({ dropId }: { dropId: number }) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [resultFormKey, setResultFormKey] = useState(0)
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    async (_previousState, formData) => {
      const result = await addComment(dropId, formData)
      setResultFormKey(formKey)
      return result
    },
    null,
  )
  const currentState = resultFormKey === formKey ? state : null

  useEffect(() => {
    if (currentState?.error && !currentState.fields) {
      toast.add({
        title: "Erreur lors de l’ajout du commentaire",
        description: currentState.error,
        type: "error",
      })
    } else if (currentState?.success) {
      toast.add({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié.",
        type: "success",
      })
      setFormKey((key) => key + 1)
      setOpen(false)
    }
  }, [currentState])

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
            {currentState?.fields && <FieldError>{currentState.error}</FieldError>}
            <Field>
              <FieldLabel htmlFor={`comment-${dropId}`}>Votre commentaire</FieldLabel>
              <textarea
                id={`comment-${dropId}`}
                name="content"
                placeholder="Écrire un commentaire..."
                required
                autoFocus
                aria-invalid={Boolean(currentState?.fields?.content)}
              />
              <FieldError>{currentState?.fields?.content?.join(" ")}</FieldError>
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
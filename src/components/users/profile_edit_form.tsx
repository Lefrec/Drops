'use client'

import { useActionState, useEffect, useState } from "react"
import type { ActionState, Profile } from "@/lib/api/types"
import { updateProfile } from "@/app/users/actions"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
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

export function ProfileEditForm({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [resultFormKey, setResultFormKey] = useState(0)
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    async (_previousState, formData) => {
      const result = await updateProfile(formData)
      setResultFormKey(formKey)
      return result
    },
    null,
  )
  const currentState = resultFormKey === formKey ? state : null

  useEffect(() => {
    if (currentState?.error && !currentState.fields) {
      toast.add({
        title: "Erreur lors de la modification du profil",
        description: currentState.error,
        type: "error",
      })
    } else if (currentState?.success) {
      toast.add({
        title: "Profil modifié",
        description: "Les modifications ont été enregistrées.",
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
      <DialogTrigger render={<Button type="button" />}>
        Modifier mon profil
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
          <DialogDescription>
            Modifiez vos informations publiques.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={action}>
          <FieldGroup>
            {currentState?.fields && <FieldError>{currentState.error}</FieldError>}
            <Field>
              <FieldLabel htmlFor="profile-display-name">Nom affiché</FieldLabel>
              <input
                id="profile-display-name"
                name="displayName"
                autoComplete="name"
                defaultValue={profile.displayName}
                required
                aria-invalid={Boolean(currentState?.fields?.displayName)}
              />
              <FieldError>{currentState?.fields?.displayName?.join(" ")}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
              <textarea
                id="profile-bio"
                name="bio"
                defaultValue={profile.bio ?? ""}
                aria-invalid={Boolean(currentState?.fields?.bio)}
              />
              <FieldError>{currentState?.fields?.bio?.join(" ")}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-avatar-url">URL de l’avatar</FieldLabel>
              <input
                id="profile-avatar-url"
                name="avatarUrl"
                type="url"
                defaultValue={profile.avatarUrl ?? ""}
                placeholder="https://..."
                aria-invalid={Boolean(currentState?.fields?.avatarUrl)}
              />
              <FieldError>{currentState?.fields?.avatarUrl?.join(" ")}</FieldError>
            </Field>
            <DialogFooter>
              <DialogClose
                render={<Button type="button" variant="outline" disabled={pending} />}
              >
                Annuler
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

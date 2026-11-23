'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Category, Drop } from "@/lib/api/types"
import { updateDrop } from "@/app/drops/actions"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"

type FormState = { error?: string; success?: boolean }

export function DropEditForm({ drop, categories }: { drop: Drop; categories: Category[] }) {
  const router = useRouter()
  const [state, action, pending] = useActionState<FormState | null, FormData>(
    (_previousState, formData) => updateDrop(drop.id, formData),
    null,
  )

  useEffect(() => {
    if (state?.error) {
      toast.add({
        title: "Erreur lors de la modification du drop",
        description: state.error,
        type: "error",
      })
    } else if (state?.success) {
      toast.add({
        title: "Drop modifié",
        description: "Les modifications ont été enregistrées.",
        type: "success",
      })
      router.push(`/drops/${drop.id}`)
    }
  }, [drop.id, router, state])

  return (
    <form action={action}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="edit-drop-title">Titre</FieldLabel>
          <input
            id="edit-drop-title"
            name="title"
            type="text"
            defaultValue={drop.title}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="edit-drop-content">Texte</FieldLabel>
          <textarea
            id="edit-drop-content"
            name="content"
            defaultValue={drop.content ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="edit-drop-category">Catégorie</FieldLabel>
          <select id="edit-drop-category" name="category" defaultValue={drop.category}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="edit-drop-image-url">URL de l’image</FieldLabel>
          <input
            id="edit-drop-image-url"
            name="imageUrl"
            type="url"
            defaultValue={drop.imageUrl ?? ""}
            placeholder="https://..."
          />
          <FieldDescription>Obligatoire pour la catégorie photo.</FieldDescription>
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </FieldGroup>
    </form>
  )
}

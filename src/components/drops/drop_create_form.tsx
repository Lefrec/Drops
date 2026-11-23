'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Category } from "@/lib/api/types"
import { createDrop } from "@/app/drops/actions"
import { LocationField } from "./location_field"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "@/components/ui/toast"

type FormState = { error?: string; success?: boolean }

export function DropCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [state, action, pending] = useActionState<FormState | null, FormData>(
    (_previousState, formData) => createDrop(formData),
    null,
  )

  useEffect(() => {
    if (state?.error) {
      toast.add({
        title: "Erreur lors de la création du drop",
        description: state.error,
        type: "error",
      })
    } else if (state?.success) {
      toast.add({
        title: "Drop créé",
        description: "Votre drop a été publié.",
        type: "success",
      })
      router.push("/drops")
    }
  }, [router, state])

  return (
    <form action={action}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="drop-title">Titre</FieldLabel>
          <input id="drop-title" name="title" type="text" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-content">Texte</FieldLabel>
          <textarea id="drop-content" name="content" />
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-category">Catégorie</FieldLabel>
          <select id="drop-category" name="category" defaultValue={categories[0]?.id} required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-image-url">URL de l’image</FieldLabel>
          <input id="drop-image-url" name="imageUrl" type="url" placeholder="https://..." />
          <FieldDescription>Obligatoire pour la catégorie photo.</FieldDescription>
        </Field>
        <LocationField />
        <Button type="submit" disabled={pending}>
          {pending ? "Création..." : "Créer le drop"}
        </Button>
      </FieldGroup>
    </form>
  )
}

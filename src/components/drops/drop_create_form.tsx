'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ActionState, Category } from "@/lib/api/types"
import { createDrop } from "@/app/drops/actions"
import { LocationField } from "./location_field"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"

export function DropCreateForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    (_previousState, formData) => createDrop(formData),
    null,
  )

  useEffect(() => {
    if (state?.error && !state.fields) {
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
        {state?.fields && <FieldError>{state.error}</FieldError>}
        <Field>
          <FieldLabel htmlFor="drop-title">Titre</FieldLabel>
          <input id="drop-title" name="title" type="text" required aria-invalid={Boolean(state?.fields?.title)} />
          <FieldError>{state?.fields?.title?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-content">Texte</FieldLabel>
          <textarea id="drop-content" name="content" aria-invalid={Boolean(state?.fields?.content)} />
          <FieldError>{state?.fields?.content?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-category">Catégorie</FieldLabel>
          <Select
            name="category"
            defaultValue={categories[0]?.id}
            required
            items={categories.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
          >
            <SelectTrigger id="drop-category" aria-invalid={Boolean(state?.fields?.category)}>
              <SelectValue placeholder="Choisir une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError>{state?.fields?.category?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="drop-image-url">URL de l’image</FieldLabel>
          <input id="drop-image-url" name="imageUrl" type="url" placeholder="https://..." aria-invalid={Boolean(state?.fields?.imageUrl)} />
          <FieldDescription>Obligatoire pour la catégorie photo.</FieldDescription>
          <FieldError>{state?.fields?.imageUrl?.join(" ")}</FieldError>
        </Field>
        <LocationField errors={state?.fields} />
        <Button type="submit" disabled={pending}>
          {pending ? "Création..." : "Créer le drop"}
        </Button>
      </FieldGroup>
    </form>
  )
}

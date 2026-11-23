'use client'

import { useActionState } from "react"
import type { Category } from "@/lib/api/types"
import { createDrop } from "@/app/drops/actions"
import { LocationField } from "./location_field"

import { Button } from "@/components/ui/button"

type FormState = { error?: string }

export function DropCreateForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    (_previousState, formData) => createDrop(formData),
    {},
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <label>
        Titre
        <input name="title" type="text" required />
      </label>
      <label>
        Texte
        <textarea name="content" />
      </label>
      <label>
        Catégorie
        <select name="category" defaultValue={categories[0]?.id} required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        URL de l’image
        <input name="imageUrl" type="url" placeholder="https://..." />
      </label>
      <LocationField />
      {state.error && <p role="alert">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Création..." : "Créer le drop"}</Button>
    </form>
  )
}

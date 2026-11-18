'use client'

import { useActionState } from "react"
import type { Category } from "@/lib/api/types"
import { createDrop } from "../actions"

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
      <label>
        Latitude
        <input name="lat" type="number" step="any" required />
      </label>
      <label>
        Longitude
        <input name="lng" type="number" step="any" required />
      </label>
      <label>
        Précision de la position
        <select name="precision" defaultValue="exact" required>
          <option value="exact">Exacte</option>
          <option value="approx">Approximative</option>
        </select>
      </label>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Création..." : "Créer le drop"}
      </button>
    </form>
  )
}

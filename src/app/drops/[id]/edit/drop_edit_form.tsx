'use client'

import { useActionState } from "react"
import type { Category, Drop } from "@/lib/api/types"
import { updateDrop } from "../../actions"

type FormState = { error?: string }

export function DropEditForm({ drop, categories }: { drop: Drop; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    (_previousState, formData) => updateDrop(drop.id, formData),
    {},
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <label>
        Titre
        <input name="title" type="text" defaultValue={drop.title} required />
      </label>
      <label>
        Texte
        <textarea name="content" defaultValue={drop.content ?? ""} />
      </label>
      <label>
        Catégorie
        <select name="category" defaultValue={drop.category}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        URL de l’image
        <input
          name="imageUrl"
          type="url"
          defaultValue={drop.imageUrl ?? ""}
          placeholder="https://..."
        />
      </label>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  )
}

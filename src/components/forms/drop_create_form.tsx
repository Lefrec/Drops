'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Category } from "@/lib/api/types"
import { createDrop } from "@/app/drops/actions"
import { LocationField } from "./location_field"

import { Button } from "@/components/ui/button"
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
      <Button type="submit" disabled={pending}>{pending ? "Création..." : "Créer le drop"}</Button>
    </form>
  )
}

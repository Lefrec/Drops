'use client'

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Category, Drop } from "@/lib/api/types"
import { updateDrop } from "@/app/drops/actions"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

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
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  )
}

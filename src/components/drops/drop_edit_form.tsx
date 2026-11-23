'use client'

import { useActionState, useState } from "react"
import type { Category, Drop } from "@/lib/api/types"
import { updateDrop } from "@/app/drops/actions"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DropEditForm({ drop, categories }: { drop: Drop; categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [category, setCategory] = useState<Category>(drop.category)
  const [, action, pending] = useActionState<null, FormData>(
    async (_previousState, formData) => {
      const result = await updateDrop(drop.id, formData)
      if (result.error) {
        toast.add({
          title: "Erreur lors de la modification du drop",
          description: result.error,
          type: "error",
        })
      } else {
        toast.add({
          title: "Drop modifié",
          description: "Les modifications ont été enregistrées.",
          type: "success",
        })
        setFormKey((key) => key + 1)
        setOpen(false)
      }
      return null
    },
    null,
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && pending) return
        if (!nextOpen) setFormKey((key) => key + 1)
        if (nextOpen) setCategory(drop.category)
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button type="button" />}>
        Modifier mon drop
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier mon drop</DialogTitle>
          <DialogDescription>
            Modifiez les informations du drop ou annulez pour ignorer les changements.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`edit-drop-title-${drop.id}`}>Titre</FieldLabel>
              <input
                id={`edit-drop-title-${drop.id}`}
                name="title"
                type="text"
                defaultValue={drop.title}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-content-${drop.id}`}>Texte</FieldLabel>
              <textarea
                id={`edit-drop-content-${drop.id}`}
                name="content"
                defaultValue={drop.content ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-category-${drop.id}`}>Catégorie</FieldLabel>
              <Select
                name="category"
                value={category}
                onValueChange={(value) => {
                  if (value !== null) setCategory(value)
                }}
                items={categories.map((category) => ({
                  value: category.id,
                  label: category.label,
                }))}
              >
                <SelectTrigger id={`edit-drop-category-${drop.id}`}>
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
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-image-url-${drop.id}`}>URL de l’image</FieldLabel>
              <input
                id={`edit-drop-image-url-${drop.id}`}
                name="imageUrl"
                type="url"
                defaultValue={drop.imageUrl ?? ""}
                placeholder="https://..."
              />
              <FieldDescription>Obligatoire pour la catégorie photo.</FieldDescription>
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

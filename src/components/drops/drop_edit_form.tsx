'use client'

import { useActionState, useEffect, useState } from "react"
import type { ActionState, Category, Drop } from "@/lib/api/types"
import { updateDrop } from "@/app/drops/actions"
import { toast } from "@/components/ui/toast"
import { LocationField } from "./location_field"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
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
  const [resultFormKey, setResultFormKey] = useState(0)
  const [category, setCategory] = useState<Drop["category"]>(drop.category)
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    async (_previousState, formData) => {
      const result = await updateDrop(drop.id, formData)
      setResultFormKey(formKey)
      return result
    },
    null,
  )
  const currentState = resultFormKey === formKey ? state : null

  useEffect(() => {
    if (currentState?.error && !currentState.fields) {
      toast.add({
        title: "Erreur lors de la modification du drop",
        description: currentState.error,
        type: "error",
      })
    } else if (currentState?.success) {
      toast.add({
        title: "Drop modifié",
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
        if (nextOpen) setCategory(drop.category)
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button type="button" />}>
        Modifier mon drop
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mon drop</DialogTitle>
          <DialogDescription>
            Modifiez les informations du drop ou annulez pour ignorer les changements.
          </DialogDescription>
        </DialogHeader>
        <form key={formKey} action={action}>
          <FieldGroup>
            {currentState?.fields && <FieldError>{currentState.error}</FieldError>}
            <Field>
              <FieldLabel htmlFor={`edit-drop-title-${drop.id}`}>Titre</FieldLabel>
              <input
                id={`edit-drop-title-${drop.id}`}
                name="title"
                type="text"
                defaultValue={drop.title}
                required
                aria-invalid={Boolean(currentState?.fields?.title)}
              />
              <FieldError>{currentState?.fields?.title?.join(" ")}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-content-${drop.id}`}>Texte</FieldLabel>
              <textarea
                id={`edit-drop-content-${drop.id}`}
                name="content"
                defaultValue={drop.content ?? ""}
                aria-invalid={Boolean(currentState?.fields?.content)}
              />
              <FieldError>{currentState?.fields?.content?.join(" ")}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-category-${drop.id}`}>Catégorie</FieldLabel>
              <Select<Drop["category"]>
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
                <SelectTrigger id={`edit-drop-category-${drop.id}`} aria-invalid={Boolean(currentState?.fields?.category)}>
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
              <FieldError>{currentState?.fields?.category?.join(" ")}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor={`edit-drop-image-url-${drop.id}`}>URL de l’image</FieldLabel>
              <input
                id={`edit-drop-image-url-${drop.id}`}
                name="imageUrl"
                type="url"
                defaultValue={drop.imageUrl ?? ""}
                placeholder="https://..."
                aria-invalid={Boolean(currentState?.fields?.imageUrl)}
              />
              <FieldDescription>Obligatoire pour la catégorie photo.</FieldDescription>
              <FieldError>{currentState?.fields?.imageUrl?.join(" ")}</FieldError>
            </Field>
            <LocationField
              key={formKey}
              initialLocation={drop.location}
              idPrefix={`edit-drop-${drop.id}`}
              mapClassName="h-36 w-full overflow-hidden rounded-md border border-border"
              showLocateButton={false}
              errors={currentState?.fields}
            />
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

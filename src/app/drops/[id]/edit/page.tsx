import Link from "next/link"
import { notFound } from "next/navigation"
import { apiGet } from "@/lib/api/client"
import type { Category, Drop } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { DropEditForm } from "./drop_edit_form"

export default async function EditDropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = await requireSession()
  const [drop, categories] = await Promise.all([
    apiGet<Drop>(`/drops/${id}`, token),
    apiGet<Category[]>("/categories", token),
  ])

  if (!drop.isMine) notFound()

  return (
    <main>
      <h1>Modifier le drop</h1>
      <DropEditForm drop={drop} categories={categories} />
      <Link href={`/drops/${drop.id}`}>Annuler</Link>
    </main>
  )
}

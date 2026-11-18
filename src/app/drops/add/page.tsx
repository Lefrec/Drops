import { Suspense } from "react"
import Link from "next/link"
import { apiGet } from "@/lib/api/client"
import type { Category } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { DropCreateForm } from "./drop_create_form"

export default function NewDropPage() {
  return (
    <main>
      <h1>Créer un drop</h1>
      <Suspense fallback={<p>Chargement du formulaire...</p>}>
        <DropCreateContent />
      </Suspense>
    </main>
  )
}

async function DropCreateContent() {
  const categories = await apiGet<Category[]>("/categories", await requireSession())

  return (
    <>
      <DropCreateForm categories={categories} />
      <Link href="/drops">Annuler</Link>
    </>
  )
}

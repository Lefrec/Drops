import { Suspense } from "react"
import Link from "next/link"
import { apiGet } from "@/lib/api/client"
import type { Category } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { DropCreateForm } from "@/components/drops/drop_create_form"
import { LoginRequired } from "@/components/auth/login_required"

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
  const token = await getSessionToken()
  if (!token) return <LoginRequired action="créer un drop" />

  const categories = await apiGet<Category[]>("/categories", token)

  return (
    <>
      <DropCreateForm categories={categories} />
      <Link href="/drops">Annuler</Link>
    </>
  )
}

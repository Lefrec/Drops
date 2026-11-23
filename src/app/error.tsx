"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main>
      <h1>Une erreur est survenue</h1>
      <p>Cette page n’a pas pu être chargée. Réessayez dans quelques instants.</p>
      <Button type="button" onClick={retry}>Réessayer</Button>
      <p><Link href="/auth/login">Se reconnecter</Link> si votre session a expiré.</p>
    </main>
  )
}

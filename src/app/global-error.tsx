"use client"

import { useEffect } from "react"

export default function GlobalError({
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
    <html lang="fr">
      <body>
        <main>
          <h1>Une erreur est survenue</h1>
          <p>L’application n’a pas pu être chargée. Réessayez dans quelques instants.</p>
          <button type="button" onClick={retry}>Réessayer</button>
        </main>
      </body>
    </html>
  )
}

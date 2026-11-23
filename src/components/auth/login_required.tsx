import Link from "next/link"

export function LoginRequired({ action }: { action: string }) {
  return (
    <section role="status" className="flex flex-col gap-2">
      <p>Vous devez vous connecter pour {action}.</p>
      <Link href="/auth/login" className="underline underline-offset-4">
        Se connecter
      </Link>
    </section>
  )
}

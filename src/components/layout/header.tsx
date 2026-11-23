import Link from "next/link"
import { ApiError, apiGet } from "@/lib/api/client"
import type { PrivateUser } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { AccountMenu } from "./account_menu"
import { LogoutButton } from "./logout_button"
import { OnlineIndicator } from "./user_count"

export async function Header() {
  const token = await getSessionToken()
  let user: PrivateUser | null = null
  let sessionInvalid = false

  if (token) {
    try {
      user = await apiGet<PrivateUser>("/auth/me", token)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        sessionInvalid = true
      } else {
        throw error
      }
    }
  }

  return (
    <header className="site-header">
      <Link className="site-header-brand" href="/drops">
        Drops
      </Link>
      <OnlineIndicator userId={user?.id}/>
      <nav className="site-header-nav" aria-label="Navigation principale">
        <Link href="/status">Status</Link>
        {user ? (
          <AccountMenu user={user} />
        ) : (
          <div className="flex items-center gap-2">
            {sessionInvalid && <LogoutButton />}
            <Button
              nativeButton={false}
              render={<Link href="/auth/login" />}
              variant="ghost"
            >
              Connexion
            </Button>
            <Button nativeButton={false} render={<Link href="/auth/register" />} variant="ghost">
              Créer un compte
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}

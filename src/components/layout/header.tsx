import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { ApiError, apiGet } from "@/lib/api/client"
import type { PrivateUser } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { UserAvatar } from "@/components/users/user_avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout_button"

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
      <nav className="site-header-nav" aria-label="Navigation principale">
        <Link href="/status">Status</Link>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button type="button" variant="outline" aria-label="Menu du profil" />}
            >
              <UserAvatar
                displayName={user.displayName}
                avatarUrl={user.avatarUrl}
                size="sm"
              />
              <span className="max-w-32 truncate">{user.displayName}</span>
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <span className="block truncate">{user.displayName}</span>
                  <span className="block truncate font-normal text-muted-foreground">
                    @{user.username}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/users/me" />}>
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/drops/add" />}>
                Créer un drop
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton menuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            {sessionInvalid && <LogoutButton />}
            <Button render={<Link href="/auth/login" />} variant="ghost">
              Connexion
            </Button>
            <Button render={<Link href="/auth/register" />}>
              Créer un compte
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}

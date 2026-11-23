"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { PrivateUser } from "@/lib/api/types"
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
import { LogoutConfirmationDialog } from "./logout_button"

export function AccountMenu({ user }: { user: PrivateUser }) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  return (
    <>
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
          <DropdownMenuItem
            nativeButton={false}
            render={<Link href="/users/me" />}
          >
            Mon profil
          </DropdownMenuItem>
          <DropdownMenuItem
            nativeButton={false}
            render={<Link href="/drops/add" />}
          >
            Créer un drop
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="w-full"
            onClick={() => setLogoutDialogOpen(true)}
          >
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      />
    </>
  )
}

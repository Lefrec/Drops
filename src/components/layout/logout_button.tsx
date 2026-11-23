"use client"

import { useState } from "react"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
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

export function LogoutButton({ menuItem = false }: { menuItem?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {menuItem ? (
        <DropdownMenuItem className="w-full" onClick={() => setOpen(true)}>
          Déconnexion
        </DropdownMenuItem>
      ) : (
        <DialogTrigger render={<Button type="button" />}>
          Déconnexion
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Se déconnecter ?</DialogTitle>
          <DialogDescription>
            Vous devrez vous reconnecter pour accéder à votre compte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={logout}>
            <Button type="submit">Oui, me déconnecter</Button>
          </form>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Annuler
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

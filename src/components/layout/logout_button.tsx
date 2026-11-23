"use client"

import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
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

export function LogoutButton() {
  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" />}>
        Déconnexion
      </DialogTrigger>
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

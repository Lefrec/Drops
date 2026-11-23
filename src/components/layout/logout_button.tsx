"use client"

import { useState } from "react"
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
} from "@/components/ui/dialog"

export function LogoutButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Déconnexion
      </Button>
      <LogoutConfirmationDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export function LogoutConfirmationDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

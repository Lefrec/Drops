'use client'

import { useActionState } from "react"
import { register } from "@/lib/actions/auth"

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, {})

  return (
    <form action={action} className="flex flex-col">
      <label htmlFor="username">Nom d’utilisateur</label>
      <input id="username" name="username" autoComplete="username" required />

      <label htmlFor="displayName">Nom affiché</label>
      <input id="displayName" name="displayName" autoComplete="name" required />

      <label htmlFor="email">Adresse e-mail</label>
      <input id="email" name="email" type="email" autoComplete="email" required />

      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />

      <label htmlFor="bio">Bio (facultatif)</label>
      <textarea id="bio" name="bio" />

      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Création du compte..." : "Créer mon compte"}
      </button>
    </form>
  )
}

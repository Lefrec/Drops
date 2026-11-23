'use client'

import { useActionState } from "react"
import { register, type AuthState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: AuthState = {}

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    initialState,
  )

  return (
    <form action={action}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Nom d’utilisateur</FieldLabel>
          <input id="username" name="username" autoComplete="username" required aria-invalid={Boolean(state.fields?.username)} />
          <FieldError>{state.fields?.username?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="displayName">Nom affiché</FieldLabel>
          <input id="displayName" name="displayName" autoComplete="name" required aria-invalid={Boolean(state.fields?.displayName)} />
          <FieldError>{state.fields?.displayName?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Adresse e-mail</FieldLabel>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.fields?.email)} />
          <FieldError>{state.fields?.email?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(state.fields?.password)}
          />
          <FieldError>{state.fields?.password?.join(" ")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="bio">Bio (facultatif)</FieldLabel>
          <textarea id="bio" name="bio" aria-invalid={Boolean(state.fields?.bio)} />
          <FieldError>{state.fields?.bio?.join(" ")}</FieldError>
        </Field>
        <FieldError>{state.error}</FieldError>
        <Button type="submit" disabled={pending}>
          {pending ? "Création du compte..." : "Créer mon compte"}
        </Button>
      </FieldGroup>
    </form>
  )
}

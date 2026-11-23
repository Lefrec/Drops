'use client'
import { useActionState } from "react"
import { login, type AuthState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const initialState: AuthState = {}

export function LoginForm() {
    const [state, action, pending] = useActionState<AuthState, FormData>(login, initialState)

    return (
        <form action={action}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="login">Login</FieldLabel>
                    <input
                        id="login"
                        name="login"
                        autoComplete="username"
                        required
                        aria-invalid={Boolean(state.fields?.login)}
                    />
                    <FieldError>{state.fields?.login?.join(" ")}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        aria-invalid={Boolean(state.fields?.password)}
                    />
                    <FieldError>{state.fields?.password?.join(" ")}</FieldError>
                </Field>
                <FieldError>{state.error}</FieldError>
                <Button type="submit" disabled={pending}>Se connecter</Button>
            </FieldGroup>
        </form>
    )
}
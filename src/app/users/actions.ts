'use server'

import { apiPatch, toActionError } from "@/lib/api/client"
import type { ActionState } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { refresh } from "next/cache"

export async function updateProfile(formData: FormData): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: "Connectez-vous pour modifier votre profil." }

    const displayName = formData.get("displayName")
    const bio = formData.get("bio")
    const avatarUrl = formData.get("avatarUrl")

    if (typeof displayName !== "string" || !displayName.trim()) {
        return {
            error: "Le nom affiché est obligatoire.",
            fields: { displayName: ["Ce champ est obligatoire."] },
        }
    }
    if (typeof bio !== "string") {
        return { error: "La bio est invalide.", fields: { bio: ["La bio est invalide."] } }
    }
    if (typeof avatarUrl !== "string") {
        return {
            error: "L’URL de l’avatar est invalide.",
            fields: { avatarUrl: ["L’URL de l’avatar est invalide."] },
        }
    }

    const trimmedAvatarUrl = avatarUrl.trim()
    if (trimmedAvatarUrl) {
        try {
            const parsedUrl = new URL(trimmedAvatarUrl)
            if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
                throw new Error("Unsupported protocol")
            }
        } catch {
            return {
                error: "Saisissez une URL d’avatar valide.",
                fields: { avatarUrl: ["Saisissez une URL HTTP ou HTTPS valide."] },
            }
        }
    }

    try {
        await apiPatch("/auth/me", token, {
            displayName: displayName.trim(),
            bio: bio.trim() || null,
            avatarUrl: trimmedAvatarUrl || null,
        })
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    refresh()
    return { success: true }
}

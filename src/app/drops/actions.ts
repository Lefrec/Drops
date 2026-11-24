'use server'

import { apiDelete, apiPatch, apiPost, toActionError } from "@/lib/api/client"
import type { ActionState } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { refresh } from "next/cache"

const loginRequiredError = "Connectez-vous pour effectuer cette action."

export async function toggleLike(dropId: number, liked: boolean): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }

    try {
        if (liked) await apiDelete(`/drops/${dropId}/like`, token)
        else await apiPost(`/drops/${dropId}/like`, token)
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    refresh()
    return {}
}

export async function addComment(dropId: number, formData: FormData): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }

    const content = formData.get("content")
    if (typeof content !== "string" || !content.trim()) {
        return {
            error: "Écrivez un commentaire avant de l’envoyer.",
            fields: { content: ["Ce champ est obligatoire."] },
        }
    }

    try {
        await apiPost(`/drops/${dropId}/comments`, token, { content: content.trim() })
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    refresh()
    return { success: true }
}

export async function deleteComment(commentId: number): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }
    if (!Number.isSafeInteger(commentId) || commentId < 1) {
        return { error: "L’identifiant du commentaire est invalide." }
    }

    try {
        await apiDelete(`/comments/${commentId}`, token)
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    refresh()
    return { success: true }
}

export async function updateDrop(dropId: number, formData: FormData): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }

    const title = formData.get("title")
    const content = formData.get("content")
    const category = formData.get("category")
    const imageUrl = formData.get("imageUrl")

    if (typeof title !== "string" || !title.trim()) {
        return { error: "Le titre est obligatoire.", fields: { title: ["Ce champ est obligatoire."] } }
    }
    if (typeof content !== "string") {
        return { error: "Le texte est invalide.", fields: { content: ["Le texte est invalide."] } }
    }
    if (typeof category !== "string" || !["note", "photo", "tip", "riddle"].includes(category)) {
        return { error: "La catégorie sélectionnée est invalide.", fields: { category: ["Choisissez une catégorie valide."] } }
    }
    if (typeof imageUrl !== "string") {
        return { error: "L’URL de l’image est invalide.", fields: { imageUrl: ["L’URL de l’image est invalide."] } }
    }
    if (category === "photo" && !imageUrl.trim()) {
        return { error: "Une URL d’image est obligatoire pour la catégorie photo.", fields: { imageUrl: ["Ce champ est obligatoire pour la catégorie photo."] } }
    }

    try {
        await apiPatch(`/drops/${dropId}`, token, {
            title: title.trim(),
            content: content.trim(),
            category,
            imageUrl: imageUrl.trim() || null,
        })
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    refresh()
    return { success: true }
}

export async function createDrop(formData: FormData): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }

    const title = formData.get("title")
    const content = formData.get("content")
    const category = formData.get("category")
    const imageUrl = formData.get("imageUrl")
    const lat = formData.get("lat")
    const lng = formData.get("lng")

    if (typeof title !== "string" || !title.trim()) {
        return { error: "Le titre est obligatoire.", fields: { title: ["Ce champ est obligatoire."] } }
    }
    if (typeof content !== "string") {
        return { error: "Le texte est invalide.", fields: { content: ["Le texte est invalide."] } }
    }
    if (typeof category !== "string" || !["note", "photo", "tip", "riddle"].includes(category)) {
        return { error: "La catégorie sélectionnée est invalide.", fields: { category: ["Choisissez une catégorie valide."] } }
    }
    if (typeof imageUrl !== "string") {
        return { error: "L’URL de l’image est invalide.", fields: { imageUrl: ["L’URL de l’image est invalide."] } }
    }
    if (category === "photo" && !imageUrl.trim()) {
        return { error: "Une URL d’image est obligatoire pour la catégorie photo.", fields: { imageUrl: ["Ce champ est obligatoire pour la catégorie photo."] } }
    }
    if (typeof lat !== "string" || !lat.trim() || !Number.isFinite(Number(lat))) {
        return { error: "La latitude est invalide.", fields: { lat: ["Saisissez une latitude valide."] } }
    }
    if (typeof lng !== "string" || !lng.trim() || !Number.isFinite(Number(lng))) {
        return { error: "La longitude est invalide.", fields: { lng: ["Saisissez une longitude valide."] } }
    }
    
    try {
        await apiPost("/drops", token, {
            title: title.trim(),
            content: content.trim() || null,
            category: category,
            imageUrl: imageUrl.trim() || null,
            lat: Number(lat),
            lng: Number(lng)
        })
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    return { success: true }
}

export async function deleteDrop(dropId: number): Promise<ActionState> {
    const token = await getSessionToken()
    if (!token) return { error: loginRequiredError }

    if (!Number.isSafeInteger(dropId) || dropId < 1) {
        return { error: "L’identifiant du drop est invalide." }
    }

    try {
        await apiDelete(`/drops/${dropId}`, token)
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    return { success: true }
}

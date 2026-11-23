'use server'

import { apiDelete, apiPatch, apiPost } from "@/lib/api/client"
import { requireSession } from "@/lib/session"
import { refresh } from "next/cache"
import { ApiError } from "next/dist/server/api-utils"

export async function toggleLike(dropId: number, liked: boolean) {
    await requireSession()

    try {
        if (liked) await apiDelete(`/drops/${dropId}/like`, await requireSession())
        else await apiPost(`/drops/${dropId}/like`, await requireSession())
    } catch (e) {
        if (e instanceof ApiError) return {error: e.message}
        throw e
    }

    refresh()
    return {}
}

export async function addComment(dropId: number, formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const content = formData.get("content")
    if (typeof content !== "string" || !content.trim()) {
        return { error: "Écrivez un commentaire avant de l’envoyer." }
    }

    try {
        await apiPost(`/drops/${dropId}/comments`, await requireSession(), { content: content.trim() })
    } catch (e) {
        if (e instanceof ApiError) return { error: e.message }
        throw e
    }

    refresh()
    return { success: true }
}

export async function updateDrop(dropId: number, formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const title = formData.get("title")
    const content = formData.get("content")
    const category = formData.get("category")
    const imageUrl = formData.get("imageUrl")

    if (typeof title !== "string" || !title.trim()) {
        return { error: "Le titre est obligatoire." }
    }
    if (typeof content !== "string") {
        return { error: "Le texte est invalide." }
    }
    if (typeof category !== "string") {
        return { error: "La catégorie sélectionnée est invalide." }
    }
    if (typeof imageUrl !== "string") {
        return { error: "L’URL de l’image est invalide." }
    }
    if (category === "photo" && !imageUrl.trim()) {
        return { error: "Une URL d’image est obligatoire pour la catégorie photo." }
    }

    try {
        await apiPatch(`/drops/${dropId}`, await requireSession(), {
            title: title.trim(),
            content: content.trim(),
            category,
            imageUrl: imageUrl.trim() || null,
        })
    } catch (error) {
        if (error instanceof Error) return { error: error.message }
        throw error
    }

    refresh()
    return { success: true }
}

export async function createDrop(formData: FormData): Promise<{ error?: string; success?: boolean }> {
    const title = formData.get("title")
    const content = formData.get("content")
    const category = formData.get("category")
    const imageUrl = formData.get("imageUrl")
    const lat = formData.get("lat")
    const lng = formData.get("lng")

    if (typeof title !== "string" || !title.trim()) {
        return { error: "Le titre est obligatoire." }
    }
    if (typeof content !== "string") {
        return { error: "Le texte est invalide." }
    }
    if (typeof category !== "string" || !["note", "photo", "tip", "riddle"].includes(category)) {
        return { error: "La catégorie sélectionnée est invalide." }
    }
    if (typeof imageUrl !== "string") {
        return { error: "L’URL de l’image est invalide." }
    }
    if (category === "photo" && !imageUrl.trim()) {
        return { error: "Une URL d’image est obligatoire pour la catégorie photo." }
    }
    if (typeof lat !== "string" || !lat.trim() || !Number.isFinite(Number(lat))) {
        return { error: "La latitude est invalide." }
    }
    if (typeof lng !== "string" || !lng.trim() || !Number.isFinite(Number(lng))) {
        return { error: "La longitude est invalide." }
    }
    
    try {
        await apiPost("/drops", await requireSession(), {
            title: title.trim(),
            content: content.trim() || null,
            category: category,
            imageUrl: imageUrl.trim() || null,
            lat: Number(lat),
            lng: Number(lng)
        })
    } catch (error) {
        if (error instanceof ApiError) return { error: error.message }
        throw error
    }

    refresh()
    return { success: true }
}

export async function deleteDrop(dropId: number): Promise<{ error?: string; success?: boolean }> {
    if (!Number.isSafeInteger(dropId) || dropId < 1) {
        return { error: "L’identifiant du drop est invalide." }
    }

    try {
        await apiDelete(`/drops/${dropId}`, await requireSession())
    } catch (error) {
        if (error instanceof Error && !("digest" in error)) {
            return { error: error.message }
        }
        throw error
    }

    refresh()
    return { success: true }
}

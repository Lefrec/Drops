import 'server-only'

import type { components } from './schema'

type ApiErrorResponse = components['schemas']['ErrorResponse']
export type FieldErrors = ApiErrorResponse['error']['fields']

const errorMessages: Record<number, string> = {
    400: 'La requête n’a pas pu être traitée.',
    401: 'Votre session a expiré. Reconnectez-vous.',
    403: 'Vous n’avez pas l’autorisation d’effectuer cette action.',
    404: 'La ressource demandée est introuvable.',
    409: 'Cette opération entre en conflit avec des données existantes.',
    422: 'Vérifiez les informations saisies.',
    429: 'Trop de requêtes. Réessayez dans quelques instants.',
    500: 'Une erreur est survenue. Réessayez plus tard.',
    503: 'Le service est temporairement indisponible.',
}

export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string,
        readonly code: string,
        readonly fields: FieldErrors,
        readonly requestId?: string,
        readonly retryAfter?: string,
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export class ApiNetworkError extends Error {
    constructor() {
        super('Impossible de joindre le service. Vérifiez votre connexion puis réessayez.')
        this.name = 'ApiNetworkError'
    }
}

export type ActionError = {
    error: string
    fields?: FieldErrors
}

export function toActionError(reason: unknown): ActionError | null {
    if (reason instanceof ApiError) {
        const hasValidationFields = reason.status === 422 && Object.keys(reason.fields).length > 0
        return {
            error: hasValidationFields ? 'Vérifiez les informations signalées.' : reason.message,
            ...(hasValidationFields ? { fields: reason.fields } : {}),
        }
    }

    if (reason instanceof ApiNetworkError) {
        return { error: reason.message }
    }

    return null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
    const payload = value as Record<string, unknown>
    const error = payload.error
    if (typeof error !== 'object' || error === null || Array.isArray(error)) return false

    const apiError = error as Record<string, unknown>
    const fields = apiError.fields
    if (
        typeof apiError.message !== 'string' ||
        typeof apiError.code !== 'string' ||
        typeof apiError.status !== 'number' ||
        typeof apiError.requestId !== 'string' ||
        typeof apiError.simulated !== 'boolean' ||
        typeof fields !== 'object' ||
        fields === null ||
        Array.isArray(fields)
    ) return false

    return Object.values(fields as Record<string, unknown>).every(
        (messages) => Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
    )
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
    const apiUrl = process.env.API_URL
    if (!apiUrl) throw new Error('La variable API_URL n’est pas configurée.')

    let response: Response
    try {
        response = await fetch(`${apiUrl}${path}`, {
            ...init,
            cache: 'no-store',
        })
    } catch (error) {
        if (error instanceof TypeError) throw new ApiNetworkError()
        throw error
    }

    if (!response.ok) {
        let payload: unknown
        try {
            payload = await response.json()
        } catch {
            payload = undefined
        }
        const apiError = isApiErrorResponse(payload) ? payload.error : undefined

        throw new ApiError(
            response.status,
            apiError?.message || errorMessages[response.status] || 'Une erreur inattendue est survenue.',
            apiError?.code || 'request_failed',
            apiError?.fields || {},
            apiError?.requestId,
            response.headers.get('Retry-After') || undefined,
        )
    }

    return response
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
    const headers = new Headers()
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const response = await request(path, { headers })
    return (await response.json()) as T
}

export async function apiPost(path: string, token?: string, data?: unknown): Promise<Response> {
    const headers = new Headers()
    if (data !== undefined) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    return request(path, {
        method: 'POST',
        body: data === undefined ? undefined : JSON.stringify(data),
        headers,
    })
}

export async function apiPatch(path: string, token: string, data: unknown): Promise<Response> {
    return request(path, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
}

export async function apiDelete(path: string, token: string): Promise<Response> {
    return request(path, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    })
}

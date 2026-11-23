import type { components } from "./schema";

type S = components['schemas']

export type Drop = S['Drop']
export type DropPage = S['DropPage']
export type Comment = S['Comment']
export type CommentPage = S['CommentPage']
export type Category = S['Category']
export type Profile = S['Profile']
export type PrivateUser = S['PrivateUser']
export type AuthResponse = S['AuthResponse']
export type ActionState = {
  error?: string
  fields?: Record<string, string[]>
  success?: boolean
}

export type Viewer = { id: number; username: string; displayName: string; avatarUrl: string | null };
export type PublicUser = S["PublicUser"];
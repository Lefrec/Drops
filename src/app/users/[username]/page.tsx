import { ApiError, apiGet } from "@/lib/api/client"
import type { DropPage, PrivateUser, Profile } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { UserAvatar } from "@/components/users/user_avatar"
import { ProfileEditForm } from "@/components/users/profile_edit_form"
import { DropCard } from "@/components/drops/drop_card"
import { LoginRequired } from "@/components/auth/login_required"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ page?: string }>
}

export default function UserProfilePage({ params, searchParams }: Props) {
  return (
    <Suspense fallback={<main><p>Chargement du profil...</p></main>}>
      <UserProfileContent params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function UserProfileContent({ params, searchParams }: Props) {
  const [{ username }, query] = await Promise.all([params, searchParams])
  const token = await getSessionToken()

  if (!token) {
    return <LoginRequired action="consulter un profil" />
  }

  const self = await apiGet<PrivateUser>("/auth/me", token)


  try {
    const profile = await apiGet<Profile>(`/users/${encodeURIComponent(username)}`, token)
    const isSelf = self.username === profile.username

    return (
      <main>
        <section className="flex flex-col gap-6">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href={`/users/${encodeURIComponent(profile.username)}`}
                aria-label={`Voir le profil de ${profile.displayName}`}
              >
                <UserAvatar
                  displayName={profile.displayName}
                  avatarUrl={profile.avatarUrl}
                  size="lg"
                />
              </Link>
              <div className="min-w-0">
                <h1 className="break-words">{profile.displayName}</h1>
                <Link
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  href={`/users/${encodeURIComponent(profile.username)}`}
                >
                  @{profile.username}
                </Link>
              </div>
            </div>
            {isSelf && <ProfileEditForm profile={profile} />}
          </header>

          {profile.bio && (
            <p className="whitespace-pre-wrap break-words">{profile.bio}</p>
          )}

          <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-muted-foreground">Drops</dt>
              <dd className="font-medium">{profile.stats.dropsCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">J’aime reçus</dt>
              <dd className="font-medium">{profile.stats.likesReceived}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Commentaires</dt>
              <dd className="font-medium">{profile.stats.commentsCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Membre depuis</dt>
              <dd className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
              </dd>
            </div>
          </dl>
        </section>
      </main>
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
}

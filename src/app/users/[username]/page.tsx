import { apiGet } from "@/lib/api/client"
import type { DropPage, PrivateUser, Profile } from "@/lib/api/types"
import { getSessionToken } from "@/lib/session"
import { UserAvatar } from "@/components/users/user_avatar"
import { ProfileEditForm } from "@/components/users/profile_edit_form"
import { LoginRequired } from "@/components/auth/login_required"
import Link from "next/link"
import { Suspense } from "react"
import { UserDrops } from "./user_drops"

interface Props {
  params: Promise<{ username: string }>
}

export default function UserProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<main><p>Chargement du profil...</p></main>}>
      <UserProfileContent params={params}/>
    </Suspense>
  )
}

async function UserProfileContent({ params }: Props) {
  const { username } = await params
  const token = await getSessionToken()

  if (!token) {
    return <LoginRequired action="consulter un profil" />
  }

  const self = await apiGet<PrivateUser>("/auth/me", token)

  const profile = await apiGet<Profile>(`/users/${encodeURIComponent(username)}`, token)
  const isSelf = self.username === profile.username

  const drops = await apiGet<DropPage>(`/drops?author=${username}`, token)
  console.log(drops)

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
                <h1 className="wrap-break-words">{profile.displayName}</h1>
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
            <p className="whitespace-pre-wrap wrap-break-words">{profile.bio}</p>
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
        <section>
          <h2>Drops de {username}</h2>
          <UserDrops drops={drops}/>
        </section>
      </main>
    )
}

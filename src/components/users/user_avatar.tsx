import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type UserAvatarProps = {
  displayName: string
  avatarUrl: string | null
  size?: "default" | "sm" | "lg"
}

function getInitials(displayName: string) {
  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0]?.toLocaleUpperCase() ?? "")
    .join("")

  return initials || "?"
}

export function UserAvatar({
  displayName,
  avatarUrl,
  size = "default",
}: UserAvatarProps) {
  return (
    <Avatar aria-hidden="true" size={size}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
    </Avatar>
  )
}

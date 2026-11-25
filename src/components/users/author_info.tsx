import { PublicUser } from "@/lib/api/types";
import { UserAvatar } from "./user_avatar";
import Link from "next/link";

export function AuthorInfo({author, link} : {author: PublicUser, link: boolean}) {

    if (link) return (
    <Link className="flex gap-2 items-center"
    href={`/users/${author.username}`}>
        <UserAvatar
            displayName={author.displayName || "user"}
            avatarUrl={author.avatarUrl || null}
        />
        <span className="flex flex-col">
        <span className="font-medium">{author.displayName || "user"}</span>
        <span className="text-sm text-muted-foreground">@{author.username || "user"}</span>
        </span>
    </Link>
    )

    if (!link) return (
    <div className="flex gap-2 items-center">
        <UserAvatar
            displayName={author.displayName}
            avatarUrl={author.avatarUrl}
        />
        <span className="flex flex-col">
        <span className="font-medium">{author.displayName}</span>
        <span className="text-sm text-muted-foreground">@{author.username}</span>
        </span>
    </div>
    )
}

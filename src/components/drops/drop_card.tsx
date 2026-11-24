import type { Drop } from "@/lib/api/types"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserAvatar } from "@/components/users/user_avatar"

export function DropCard({ drop }: { drop: Drop }) {
  return (
    <article id={`drop-${drop.id}`} className="flex flex-col gap-3">
      <Link className="block" href={`/drops/${drop.id}`}>
        <Card>              
          
          <CardHeader>
        <UserAvatar
          displayName={drop.author.displayName}
          avatarUrl={drop.author.avatarUrl}
        />
        <span className="flex flex-col">
          <span className="font-medium">{drop.author.displayName}</span>
          <span className="text-sm text-muted-foreground">@{drop.author.username}</span>
        </span>
            <CardTitle>{drop.title}</CardTitle>
            <CardDescription>{drop.category}</CardDescription>
          </CardHeader>
          {drop.content && (
            <CardContent>
              <p>{drop.content}</p>
            </CardContent>
          )}
          {drop.imageUrl && (
            <img
              src={drop.imageUrl}
              alt={`Image du drop ${drop.title}`}
              className="aspect-video w-full object-cover"
            />
          )}
          <CardFooter className="justify-between">
            <p>{drop.likesCount} j'aime</p>
            <p>{drop.commentsCount} commentaires</p>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}
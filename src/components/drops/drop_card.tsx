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

export function DropCard({ drop }: { drop: Drop }) {
  return (
    <article>
      <Link className="block" href={`/drops/${drop.id}`}>
        <Card>
          {drop.imageUrl && (
            <img
              src={drop.imageUrl}
              alt={`Image du drop ${drop.title}`}
              className="aspect-video w-full object-cover"
            />
          )}
          <CardHeader>
            <CardTitle>{drop.title}</CardTitle>
            <CardDescription>{drop.category}</CardDescription>
            <CardDescription>Par {drop.author.displayName}</CardDescription>
          </CardHeader>
          {drop.content && (
            <CardContent>
              <p>{drop.content}</p>
            </CardContent>
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
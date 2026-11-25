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

import { AuthorInfo } from "../users/author_info"

export function DropCard({ drop }: { drop: Drop }) {
  return (
    <article id={`drop-${drop.id}`} className="flex w-full min-w-0 flex-col gap-3 hover:outline-1">
      <Link className="block w-full min-w-0" href={`/drops/${drop.id}`}>
        <Card className="w-full min-w-0">
          <CardHeader>
            <AuthorInfo author={drop.author} link={false}/>
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
            <p>{drop.likesCount} j'aime · {drop.dislikesCount} je n'aime pas</p>
            <p>{drop.commentsCount} commentaires</p>
          </CardFooter>
        </Card>
      </Link>
    </article>
  )
}
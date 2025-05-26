
import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AuthorAvatar from "./AuthorAvatar"
import LikeComment from "./LikeComment"
import { fetchPost } from "@/actions/post.action"
import DeleteButton from "./DeleteButton"
import { formatDistanceToNow } from "date-fns"

// ReturnType<typeof fetchPost> will give return typeof fetch post function
// Awaited<> removes the Promise from the type
// ['posts'] gives the type of posts in return type neglating all other fields
// NonNullable removes undefined or null form type
// [number] gives type of a single item rather than the array
type Post = NonNullable<Awaited<ReturnType<typeof fetchPost>>['posts']>[number]

type PropType = {
    post: Post,
    currentUserId: string
}



export default function PostCard({ post, currentUserId }: PropType) {

    return (
        <Card className="w-full gap-0">

            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <AuthorAvatar avatarURL={post.author.image || "/placeholder.svg"} name={post.author.name || "user"} username={post.author.username} />
                        <div>
                            <div className="font-semibold">{post.author.name}</div>
                            <div className="text-sm text-muted-foreground">@{post.author.username}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </span>
                        {post.authorId == currentUserId && (
                            <DeleteButton postId={post.id} />
                        )}
                    </div>

                </div>
            </CardHeader>

            <CardContent className="pb-3">
                {post.content && <p className="mb-3">{post.content}</p>}
                {post.image && (
                    <div className="rounded-md overflow-hidden mt-2">
                        <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full h-auto object-cover" />
                    </div>
                )}
            </CardContent>

            <LikeComment likes={post.likes} comments={post.comments} postId={post.id} userId={currentUserId || ''} likesCount={post._count.likes} commentsCount={post._count.comments} />
        </Card>
    )
}

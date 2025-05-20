'use client'
import { Heart, Loader2, MessageCircle, Send } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import { Input } from '../ui/input'
import { CardFooter } from '../ui/card'
import { toggleLike } from '@/actions/post.action'
import { addComment } from '@/actions/comment.action'
import toast from 'react-hot-toast'
import { toastOptions } from '@/utils/utils'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'

type LikeCommentPropType = {
    likes: {
        id: string
        postId: string
        authorId: string,
        createdAt: Date,
        author: {
            name: string | null,
            image: string | null
        }
    }[],
    comments: {
        id: string
        content: string
        authorId: string
        postId: string
        author: {
            id: string
            name: string | null
            username: string
            image: string | null
        }
        createdAt: Date
    }[]
    likesCount: number
    commentsCount: number
    postId: string
    userId: string
}

const LikeComment = ({ likes, comments, postId, userId, likesCount, commentsCount }: LikeCommentPropType) => {
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [likesDialogOpen, setLikesDialogOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [isLiking, setIsLiking] = useState(false)
    const [hasLiked, setHasLiked] = useState(likes.some(like => like.authorId === userId))
    const [isCommenting, setIsCommenting] = useState(false)
    const [optimisticLikes, setOptimisticLikes] = useState(likesCount)
    const user = useUser()

    const handleLike = async () => {
        if (isLiking)
            return

        try {
            setIsLiking(true)
            setHasLiked(prev => !prev)
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1))
            await toggleLike(postId)
        } catch (error) {
            setOptimisticLikes(likesCount)
            setHasLiked(likes.some(like => like.authorId === userId))
        } finally {
            setIsLiking(false)
        }
    }

    const handleComment = async () => {
        if (isCommenting)
            return

        if (!newComment.trim())
            return

        try {
            setIsCommenting(true)
            const result = await addComment(newComment, postId)

            if (result.success) {
                setNewComment("")
                toast.success("comment added", toastOptions)
            } else {
                throw new Error("Comment not added")
            }

        } catch (error) {
            toast.error("Comment not added")
        } finally {
            setIsCommenting(false)
        }
    }
    return (
        <>
            <CardFooter>
                <div className="flex items-center gap-4 mt-4 pb-4">
                    <button className="flex items-center gap-1 text-sm">
                        <Heart onClick={handleLike} className={`h-5 w-5 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span
                            className="hover:underline cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                setLikesDialogOpen(true)
                            }}
                        >
                            {optimisticLikes} {optimisticLikes === 1 ? "like" : "likes"}
                        </span>
                    </button>
                    <button
                        className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                        onClick={() => setCommentsOpen(!commentsOpen)}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span>
                            {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
                        </span>
                    </button>
                </div>
            </CardFooter>
            <Dialog open={likesDialogOpen} onOpenChange={setLikesDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Likes</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-y-auto">
                        {likes.length > 0 ? (
                            <div className="space-y-4 py-2">
                                {likes.map(like => (
                                    <div key={like.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={like.author.image || "/placeholder.svg"} alt="User" />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">{like.author.name}</div>
                                                {/* <div className="text-sm text-muted-foreground">@user{index + 1}</div> */}
                                            </div>
                                        </div>
                                        {true && (
                                            <Button variant="outline" size="sm">
                                                Follow
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-4 text-muted-foreground">No likes yet</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Collapsible open={commentsOpen}>
                <CollapsibleContent>
                    <div className="px-6 py-2 border-t">
                        {comments.length > 0 ? (
                            <div className="space-y-4 mb-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={comment.author.image || "/placeholder.svg"} alt={comment.author.name || "commenter avatar"} />
                                            <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="bg-muted p-2 rounded-md">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-sm">{comment.author.name}</span>
                                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                                                </div>
                                                <p className="text-sm mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-2">No comments yet</p>
                        )}

                        <div className="flex gap-2 mt-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.user?.imageUrl || "/placeholder.svg?height=32&width=32"} alt="Your avatar" />
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                                <Input
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleComment} size="icon" disabled={!newComment.trim() || isCommenting}>
                                    {isCommenting ?
                                        <Loader2 className='animate-spin' />
                                        : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    )
}

export default LikeComment
'use server'

import prisma from "@/lib/prisma"
import { getCurrentUserId } from "./user.action"
import { revalidatePath } from "next/cache"

export async function addComment(content: string, postId: string){
    try {
        const userId = await getCurrentUserId()

        if(!userId) throw new Error("Please log in first")

        const newComment = await prisma.comment.create({
            data:{
                content,
                authorId: userId,
                postId
            }
        })

        const post = await prisma.post.findUnique({
            where:{
                id: postId
            }
        })

        if(!post || !newComment)
            throw new Error("Something went wrong")

        if(post.authorId != userId){
            await prisma.notification.create({
                data:{
                    type: "Comment",
                    creatorId: userId,
                    commentId: newComment.id,
                    receiverId: post.authorId,
                    postId
                }
            })
        }

        revalidatePath("/")
        return {success: true}
    } catch (error) {
        console.error("Error while adding a comment,", error)
        return {success: false, message:"Error occured"}
    }
}
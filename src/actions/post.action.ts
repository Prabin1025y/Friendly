'use server';

import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "./user.action";
import prisma from "@/lib/prisma";

//Create a new post author being currently authenticated user
export async function createPost(content?: string, imageURL?: string) {

    //DO nothing if content and image both are absent
    if (!content?.trim() && !imageURL)
        return

    try {

        const currentUserId = await getCurrentUserId()

        //Return if user is not authenticated
        if (!currentUserId) return

        //create a post with following data
        const post = await prisma.post.create({
            data: {
                authorId: currentUserId,
                content: content,
                image: imageURL
            }
        })

        //rerender the page with fresh data rather than outdated cached data in "/" path
        revalidatePath("/")
        return { success: true, post }
    } catch (error) {
        console.error("Error while creating post", error)
        return { success: false, error: "Failed to create post" }
    }
}

//Fetch all the posts in descending order along with comments
export async function fetchPost() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: "desc" //Sort the posts so newest comes first
            },
            include: {
                //include author info
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                //include comments along with its author and sort them so that newest comes last
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                //includ liker userId to check if current user has already liked the post
                likes: {
                    include: {
                        author: {
                            select: {
                                id:true,
                                image: true,
                                name: true, 
                                username: true
                            }
                        }
                    }
                },
                //include count of comments and likes
                _count: {
                    select: {
                        comments: true,
                        likes: true
                    }
                }
            }
        })

        return { success: true, posts }
    } catch (error) {
        console.error("Error while fetching post", error)

        return { success: false, message: "Error occured, please check console" }
    }
}

export async function toggleLike(postId: string) {
    try {
        const userId = await getCurrentUserId()
        if (!userId)
            throw new Error("Unauthenticated!!")

        const alreadyLiked = await prisma.like.findUnique({
            where: {
                authorId_postId: {
                    authorId: userId,
                    postId
                }
            }
        })

        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post)
            throw new Error("Post doesnot exists")

        if (alreadyLiked) {
            await prisma.like.delete({
                where: {
                    authorId_postId: {
                        authorId: userId,
                        postId
                    }
                }
            })
        } else {
            await prisma.$transaction([
                prisma.like.create({
                    data: {
                        authorId: userId,
                        postId
                    }
                }),
                prisma.notification.create({
                    data: {
                        type: "LIKE",
                        creatorId: userId,
                        receiverId: post.authorId,
                        postId
                    }
                })
            ])
        }
        revalidatePath("/")

    } catch (error) {
        console.error("Error while liking post", error)
    }
}

export async function deletePost(postId: string) {
    try {
        const userId = await getCurrentUserId()
        if (!userId)
            throw new Error("Unauthenticated")

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if (!post)
            throw new Error("Post does not exists")

        if (userId !== post.authorId)
            throw new Error("Unauthenticated to delete this post")

        await prisma.post.delete({
            where: {
                id: postId
            }
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error occured while deletin post", error)
        return { success: false, message: "Error occured" }
    }
}
"use server"

import prisma from "@/lib/prisma"
import { getCurrentUserId, getUserById } from "./user.action"
import { revalidatePath } from "next/cache"

export async function toggleFollow(targetUserId: string) {
    try {
        const userId = await getCurrentUserId()

        if (!userId) throw new Error("Please log in first, toggleFollow")

        const targetUser = await getUserById(targetUserId)
        if (!targetUser) throw new Error("Target user does not exists")

        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: { //Using index created to fetch data gracefully
                    followerId: userId,
                    followingId: targetUserId
                }
            }
        })

        if (existingFollow) {
            //unfollow
            await prisma.follows.delete({
                where:{
                    followerId_followingId:{
                        followerId: userId,
                        followingId: targetUserId
                    }
                }
            })
        } else {
            //Transaction is used when both action are required to be success. if one is failed, other will fail as well. It doesnt make sense if follow cannot be done but
            // notification went anyway
            await prisma.$transaction([
                prisma.follows.create({
                    data:{
                        followerId: userId,
                        followingId: targetUserId
                    }
                }),
                prisma.notification.create({
                    data:{
                        type: "FOLLOW",
                        creatorId: userId,
                        receiverId: targetUserId
                    }
                })
            ])
            
        }

        revalidatePath("/")
        return {success: true, user: targetUser}
    } catch (error) {
        console.error("Error while toggling follow. ", error)
        return {success: false, message: "Something went wrong"}
    }
}

export async function getFollowers(){
    try {
        const userId = await getCurrentUserId()

        const followers = await prisma.follows.findMany({
            where:{
                followingId: userId
            },
            include:{
                follower: {
                    select:{
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        })

        return {success: true, followers}
    } catch (error) {
        console.error("Error while fetching followers", error)
        return {success: false, message: "Error occured"}
    }
}

export async function getFollowings(){
    try {
        const userId = await getCurrentUserId()

        const followings = await prisma.follows.findMany({
            where:{
                followerId: userId
            },
            include:{
                following: {
                    select:{
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        })
        revalidatePath("/")
        return {success: true, followings}
    } catch (error) {
        console.error("Error while fetching followers", error)
        return {success: false, message: "Error occured"}
    }
}
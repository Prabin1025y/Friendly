'use server'
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user)
            return

        //check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (existingUser) return existingUser

        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                email: user.emailAddresses[0].emailAddress,
                username: user.username || user.emailAddresses[0].emailAddress.split("@")[0],
                image: user.imageUrl,
            }
        })

        return dbUser

    } catch (error) {
        console.log("Error in syncUser", error)
    }
}

export async function getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
        where: {
            clerkId
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        }
    })
}

export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: { id: id }
    })
}

export async function getCurrentUserId() {
    const { userId } = await auth()
    if (!userId) return

    const user = await getUserByClerkId(userId)
    if (!user) throw new Error("User not found")

    return user.id
}

export async function getSuggestedUsers(count: number) {

    try {
        const userId = await getCurrentUserId()
        if (!userId) throw new Error("Unauthenticated")

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true
            },
            take: count
        })
        return users
    } catch (error) {
        console.log("Error while getting suggested users", error)
    }
}

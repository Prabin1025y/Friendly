'use server'
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export async function getUserByUsername(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            include: {
                posts: {
                    orderBy: {
                        createdAt: "desc" //Sort the posts so newest comes first
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true
                            }
                        },
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
                        likes: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        image: true
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                comments: true,
                                likes: true
                            }
                        }
                    }
                },
                likes: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        post: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true,
                                        image: true
                                    }
                                },
                                comments: {
                                    orderBy: {
                                        createdAt: 'asc'
                                    },
                                    include: {
                                        author: {
                                            select: {
                                                id: true,
                                                name: true,
                                                username: true,
                                                image: true
                                            }
                                        }
                                    }
                                },
                                likes: {
                                    include: {
                                        author: {
                                            select: {
                                                id: true,
                                                name: true,
                                                username: true,
                                                image: true
                                            }
                                        }
                                    }
                                }, _count: {
                                    select: {
                                        comments: true,
                                        likes: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                        likes: true
                    }
                }
            }
        })

        if (!user)
            return { success: false, userDoesNotExists: true }

        //Check if current user is following this user
        const userId = await getCurrentUserId()
        let isFollowing: boolean;

        if (user && userId) {
            const following = await prisma.follows.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: user?.id
                    }
                }
            })

            if (following)
                isFollowing = true
            else
                isFollowing = false
        } else {
            isFollowing = false
        }

        return { success: true, user, isFollowing };

    } catch (error) {
        console.error("Error while fetching user Details", error)
        return { success: false, message: "Something went wrong" }
    }
}

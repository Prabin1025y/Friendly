'use server'

import prisma from "@/lib/prisma"
import { getCurrentUserId } from "./user.action"

export async function getNotificationsOfCurrentUser() {
    try {
        const userId = await getCurrentUserId()
        if (!userId)
            return []

        const notifications = await prisma.notification.findMany({
            where: {
                receiverId: userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                post:{
                    select:{
                        content:true,
                        id: true,
                        image: true
                    }
                },
                comment:{
                    select:{
                        id: true,
                        content: true
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        })

        return notifications
    } catch (error) {
        console.error("Error while creating notification", error)
    }
}

export async function markNotificationRead(notificationIds: string[]){
    try {
        await prisma.notification.updateMany({
            where:{
                id:{
                    in:notificationIds
                }
            },
            data:{
                read:true
            }
        })

        return {success: true}
    } catch (error) {
        console.error("Error while marking notificaiton read", error)
        return {success: false}
    }
}
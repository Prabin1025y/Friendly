'use client'

import { getNotificationsOfCurrentUser, markNotificationRead } from '@/actions/notification.action'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NotificationType } from '@/generated/prisma'
import { toastOptions } from '@/utils/utils'
import { Bell } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import NotificationsSkeleton from './_compoonents/NotificationsSekelton'
import { ScrollArea } from '@/components/ui/scroll-area'

type Notification = NonNullable<Awaited<ReturnType<typeof getNotificationsOfCurrentUser>>>[number]

const notificationMessage = (type: NotificationType, name: string) => {
    switch (type) {
        case "Comment":
            return `${name} has commented on your post.`

        case "FOLLOW":
            return `${name} has started following you.`

        case "LIKE":
            return `${name} has liked your post.`

    }
}

const page = () => {
    const [loading, setLoading] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
    const [unredNotificationIds, setunredNotificationIds] = useState<string[]>([])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsOfCurrentUser()
                if (data) {
                    setNotifications(data)
                }
                const unreadNotificationsIds = data?.filter(notification => !notification.read).map(notification => notification.id) || []
                setUnreadNotificationCount(unreadNotificationsIds?.length || 0)
                setunredNotificationIds(unreadNotificationsIds)
                await markNotificationRead(unreadNotificationsIds)
                console.log(data)


            } catch (error) {
                toast.error("Error while fetching Notificaitons", toastOptions)
            } finally {
                setLoading(false)
            }

        }
        fetchNotifications()
    }, [])

    if (loading)
        return <main>
            <NotificationsSkeleton />
        </main>

    return (
        <main>
            <Card className="overflow-hidden">
                <CardHeader className="pb-3 flex justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{unreadNotificationCount} unread</p>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className='h-[calc(100vh-250px)]'>
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div key={notification.id} className={`${unredNotificationIds.includes(notification.id) && "bg-muted/50"} p-4 hover:bg-muted/50 transition-colors overflow-hidden`}>
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={notification.creator.username || "/placeholder.svg"} alt={notification.creator.name || "User"} />
                                            <AvatarFallback>{notification.creator.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="font-medium">{notification.creator.name}</span>{" "}
                                                    <span className="text-muted-foreground">{notificationMessage(notification.type, notification.creator.name || "Someone")}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                                </span>
                                            </div>

                                            {notification.post && (
                                                <div className="mt-2 rounded-md border p-3 text-sm overflow-hidden">
                                                    <div className="flex gap-3">
                                                        {notification.post.image && (
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={notification.post.image || "/placeholder.svg"}
                                                                    alt="Post image"
                                                                    className="h-12 w-12 rounded-md object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0 overflow-hidden">
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {notification.type === "Comment" || notification.type === "LIKE" ? (
                                                                    <span className="font-medium text-foreground">Post: </span>
                                                                ) : null}
                                                                {notification.post.content}
                                                            </p>

                                                            {notification.comment && (
                                                                <div className="mt-2 border-l-2 border-muted">
                                                                    <p className="text-sm text-muted-foreground truncate">
                                                                        <span className="font-medium text-foreground">Comment: </span>
                                                                        {notification.comment.content}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </main>
    )
}

export default page
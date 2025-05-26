"use client"

import { use, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Settings,
    UserPlus,
    UserCheck,
    MapPin,
    LinkIcon,
    Calendar,
    Loader,
    Edit,
} from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserByUsername } from "@/actions/user.action"
import { useUser } from "@clerk/nextjs"
import toast from "react-hot-toast"
import { toastOptions } from "@/utils/utils"
import { notFound } from "next/navigation"
import PostCard from "@/components/Posts/PostCard"

type UserType = NonNullable<Awaited<ReturnType<typeof getUserByUsername>>['user']>
type UserPosts = UserType['posts']



// const PostGrid = ({ posts }: { posts: UserPosts }) => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {posts.map((post) => (
//             <Card key={post.id} className="overflow-hidden group cursor-pointer">
//                 {post.type === "image" ? (
//                     <div className="relative aspect-square">
//                         <Image
//                             src={post.image || "/placeholder.svg"}
//                             alt={post.caption || "Post image"}
//                             fill
//                             className="object-cover transition-transform group-hover:scale-105"
//                         />
//                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
//                             <div className="flex items-center gap-4 text-white">
//                                 <div className="flex items-center gap-1">
//                                     <Heart className="w-5 h-5" />
//                                     <span className="font-medium">{post.likes}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                     <MessageCircle className="w-5 h-5" />
//                                     <span className="font-medium">{post.comments}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         {post.caption && (
//                             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
//                                 <p className="text-white text-sm line-clamp-2">{post.caption}</p>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="p-4 min-h-[200px] flex flex-col justify-between bg-gradient-to-br from-blue-50 to-purple-50 group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
//                         <div className="flex-1">
//                             <p className="text-sm leading-relaxed text-gray-800 line-clamp-6">{post.content}</p>
//                         </div>
//                         <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
//                             <div className="flex items-center gap-4 text-gray-600">
//                                 <div className="flex items-center gap-1">
//                                     <Heart className="w-4 h-4" />
//                                     <span className="text-sm font-medium">{post.likes}</span>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                     <MessageCircle className="w-4 h-4" />
//                                     <span className="text-sm font-medium">{post.comments}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </Card>
//         ))}
//     </div>
// )

export default function page({ params }: { params: Promise<{ username: string }> }) {
    const [isFollowing, setIsFollowing] = useState(false)
    const [activeTab, setActiveTab] = useState("posts")
    const [profileUser, setProfileUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false)
    const [userExists, setUserExists] = useState(true)


    const { user, isLoaded } = useUser()
    const { username } = use(params)

    useEffect(() => {
        const fetchData = async () => {
            try {

                const result = await getUserByUsername(username)

                if (result.userDoesNotExists)
                    setUserExists(false)

                if (result.success && result.user) {
                    setProfileUser(result.user)
                    setIsFollowing(result.isFollowing)

                    console.log(result)

                    if (result.user.clerkId == user?.id)
                        setIsCurrentUserProfile(true)

                }
            } catch (error) {
                toast.error("Something went wrong", toastOptions)
                console.error(error)
            } finally {
                setIsLoading(!isLoaded)
            }
        }
        fetchData()
    }, [isLoaded])


    // const handleFollowToggle = () => {
    //     setIsFollowing(!isFollowing)
    // }

    if (isLoading)
        return <div className="w-full h-full grid place-items-center">
            <Loader size={40} className="text-primary animate-spin" />
        </div>

    if (!userExists)
        notFound()

    return (
        <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="min-h-screen bg-background">
                {/* Cover Image */}
                <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Profile Header */}
                <div className="relative px-4 pb-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-4">
                            <Avatar className="w-32 h-32 border-4 border-background">
                                <AvatarImage src={profileUser?.image || "/placeholder.svg"} alt={profileUser?.username} />
                                <AvatarFallback className="text-2xl">
                                    {(profileUser?.name || "User")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-2xl font-bold">{profileUser?.name}</h1>
                                </div>
                                <p className="text-muted-foreground mb-1">@{profileUser?.username}</p>
                                <p className="text-sm mb-4 max-w-md">{profileUser?.bio}</p>

                                {/* User Details */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                    {profileUser?.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{profileUser?.location}</span>
                                        </div>
                                    )}
                                    {profileUser?.website && (
                                        <div className="flex items-center gap-1">
                                            <LinkIcon className="w-4 h-4" />
                                            <a href={profileUser?.website} className="text-blue-600 hover:underline">
                                                {profileUser?.website}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {profileUser?.createdAt.toDateString()}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <span className="font-bold">{profileUser?._count.posts}</span>
                                        <span className="text-muted-foreground ml-1">Posts</span>
                                    </div>
                                    <div>
                                        <span className="font-bold">{profileUser?._count.followers.toLocaleString()}</span>
                                        <span className="text-muted-foreground ml-1">Followers</span>
                                    </div>
                                    <div>
                                        <span className="font-bold">{profileUser?._count.following.toLocaleString()}</span>
                                        <span className="text-muted-foreground ml-1">Following</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                {isCurrentUserProfile ? (
                                    <Button >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Button variant={isFollowing ? "outline" : "default"}>
                                        {isFollowing ? (
                                            <>
                                                <UserCheck className="w-4 h-4 mr-2" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="max-w-4xl mx-auto px-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="posts" className="flex items-center gap-2">
                                Posts ({profileUser?._count.posts})
                            </TabsTrigger>
                            <TabsTrigger value="liked" className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Liked ({profileUser?._count.likes})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="space-y-6">
                            {profileUser?._count.posts && (profileUser?._count.posts > 0) ?
                                <div className="w-full mx-auto space-y-6 pb-10">
                                    {profileUser.posts.map((post) => (
                                        <PostCard currentUserId={profileUser.id} post={post} key={post.id} />
                                    ))}
                                </div>
                                :
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No posts yet</p>
                                </div>
                            }
                        </TabsContent>

                        <TabsContent value="liked" className="space-y-6">
                            {profileUser?._count.likes && (profileUser?._count.likes > 0) ?
                                <div className="w-full mx-auto space-y-6 pb-10">
                                    {profileUser.likes.map(like => like.post).map((post) => (
                                        <PostCard currentUserId={profileUser.id} post={post} key={post.id} />
                                    ))}
                                </div>
                                :
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No liked posts</p>
                                </div>
                            }
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </ScrollArea>
    )
}



// Mock data
// const currentUser = {
//     id: "1",
//     username: "johndoe",
//     name: "John Doe",
//     bio: "Digital creator & photographer 📸 | Travel enthusiast ✈️ | Coffee lover ☕",
//     avatar: "/placeholder.svg?height=150&width=150",
//     coverImage: "/placeholder.svg?height=200&width=800",
//     followers: 2847,
//     following: 892,
//     posts: 156,
//     location: "San Francisco, CA",
//     website: "johndoe.com",
//     joinDate: "March 2020",
//     verified: true,
// }

// const profileUser = {
//     id: "2", // Different ID means it's not the current user
//     username: "alexsmith",
//     name: "Alex Smith",
//     bio: "UI/UX Designer | Creating beautiful digital experiences | Available for freelance work 💼",
//     avatar: "/placeholder.svg?height=150&width=150",
//     coverImage: "/placeholder.svg?height=200&width=800",
//     followers: 1523,
//     following: 456,
//     posts: 89,
//     location: "New York, NY",
//     website: "alexsmith.design",
//     joinDate: "June 2021",
//     verified: false,
// }

// const userPosts = [
//     {
//         id: "1",
//         type: "image",
//         image: "/placeholder.svg?height=300&width=300",
//         likes: 234,
//         comments: 12,
//         caption: "Beautiful sunset at the beach 🌅",
//     },
//     {
//         id: "2",
//         type: "text",
//         content:
//             "Just finished reading an amazing book about design principles. The way the author explains color theory and typography is incredible! Highly recommend it to anyone interested in visual design. 📚✨ #design #books #learning",
//         likes: 189,
//         comments: 8,
//     },
//     {
//         id: "3",
//         type: "image",
//         image: "/placeholder.svg?height=300&width=300",
//         likes: 456,
//         comments: 23,
//         caption: "Weekend vibes in the city",
//     },
//     {
//         id: "4",
//         type: "text",
//         content:
//             "Excited to announce that our new project is finally live! 🚀 It's been months of hard work, late nights, and countless iterations. Thank you to everyone who supported us along the way. This is just the beginning! #startup #launch #grateful",
//         likes: 321,
//         comments: 15,
//     },
//     {
//         id: "5",
//         type: "image",
//         image: "/placeholder.svg?height=300&width=300",
//         likes: 167,
//         comments: 9,
//         caption: "Mountain hiking adventure",
//     },
//     {
//         id: "6",
//         type: "text",
//         content:
//             "Coffee thoughts: There's something magical about that first sip in the morning. It's not just caffeine, it's a ritual, a moment of peace before the day begins. ☕ What's your morning ritual?",
//         likes: 298,
//         comments: 18,
//     },
// ]

// const likedPosts = [
//     {
//         id: "7",
//         type: "image",
//         image: "/placeholder.svg?height=300&width=300",
//         likes: 567,
//         comments: 34,
//         caption: "Amazing street art discovery",
//     },
//     {
//         id: "8",
//         type: "text",
//         content:
//             "Music has this incredible power to transport you to different times and places. Tonight's concert reminded me why live music will always be irreplaceable. The energy, the connection, the shared experience... pure magic! 🎵✨",
//         likes: 423,
//         comments: 21,
//     },
//     {
//         id: "9",
//         type: "image",
//         image: "/placeholder.svg?height=300&width=300",
//         likes: 789,
//         comments: 45,
//         caption: "Perfect weather for outdoor photography",
//     },
//     {
//         id: "10",
//         type: "text",
//         content:
//             "Late night coding sessions hit different. There's something about the quiet, the focus, and the satisfaction of solving complex problems when the world is asleep. 💻🌙 #coding #nightowl",
//         likes: 234,
//         comments: 12,
//     },
// ]

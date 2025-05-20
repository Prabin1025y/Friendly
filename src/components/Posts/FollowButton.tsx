'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { getFollowings, toggleFollow } from '@/actions/follow.action'
import toast from 'react-hot-toast'
import { toastOptions } from '@/utils/utils'

type FollowingType = NonNullable<Awaited<ReturnType<typeof getFollowings>>["followings"]>[number]

const FollowButton = ({ targetUserId, authorName }: { targetUserId: string, authorName: string }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [optimisticallyFollowed, setOptimisticallyFollowed] = useState(true)
    const [loaded, setLoaded] = useState(false)
    let followings: FollowingType[]
    useEffect(() => {

        const fetchFollowers = async () => {
            const result = await getFollowings()


            if (result.success && result.followings) {
                followings = result.followings
                setOptimisticallyFollowed(followings.some(following => following.followingId == targetUserId))
            }
            setLoaded(true)

        }
        fetchFollowers()

    }, [])


    // console.log(isFollowing)

    const handleToggleFollow = async () => {
        if (isLoading)
            return

        try {
            setIsLoading(true)
            setOptimisticallyFollowed(prev => !prev)
            const result = await toggleFollow(targetUserId)
            if (result.success) {
                toast.success(optimisticallyFollowed ? `Unfollowed ${authorName}` : `You are now following ${authorName}`, toastOptions)

            }

        } catch (error) {
            setOptimisticallyFollowed(followings.some(following => following.followingId == targetUserId))
            toast.error("Something went wrong!", toastOptions)
        } finally {
            setIsLoading(false)
        }
    }

    if (!loaded)
        return null
    return (
        <Button
            onClick={handleToggleFollow}
            variant={optimisticallyFollowed ? "outline" : "default"}
            size="sm"
            disabled={isLoading}
        //   onClick={() => onToggleFollow(post.author.id)}
        >
            {optimisticallyFollowed ? "Following" : "Follow"}
        </Button>
    )
}

export default FollowButton
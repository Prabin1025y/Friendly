import React from 'react'
import PostCard from './PostCard'
import { fetchPost } from '@/actions/post.action'
import toast from 'react-hot-toast'
import { toastOptions } from '@/utils/utils'
import { getCurrentUserId } from '@/actions/user.action'

const PostFeed = async () => {
    const result = await fetchPost()
    const currentUserId = await getCurrentUserId()

    if(!result.success && result.message) toast.error(result.message, toastOptions)

    if(!result.posts) return null

  return (
    <div className="w-full mx-auto space-y-6 pb-10">
      {result.posts.map((post) => (
        <PostCard post={post} currentUserId={currentUserId || ""} key={post.id} />
      ))}
    </div>
  )
}

export default PostFeed
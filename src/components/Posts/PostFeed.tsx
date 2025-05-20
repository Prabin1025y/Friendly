import React from 'react'
import PostCard from './PostCard'
import { fetchPost } from '@/actions/post.action'
import toast from 'react-hot-toast'
import { toastOptions } from '@/utils/utils'
import { currentUser } from '@clerk/nextjs/server'
import { addComment } from '@/actions/comment.action'

const PostFeed = async () => {
    const result = await fetchPost()
    const user = currentUser()

    if(!result.success && result.message) toast.error(result.message, toastOptions)

    if(!result.posts) return null

    console.log(typeof result.posts[0] )

    const addCommentToPost = async(content: string, postId: string) =>{
        if(!currentUser) {
            toast.error("Please log in to comment", toastOptions)
            return
        }

        const result = await addComment(content, postId)

        if(result.success){
            toast.success("comment added", toastOptions)
        }
    }

  return (
    <div className="w-full mx-auto space-y-6 pb-10">
      {result.posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  )
}

export default PostFeed
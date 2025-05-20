'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader, Trash2 } from 'lucide-react'
import { toastOptions } from '@/utils/utils'
import toast from 'react-hot-toast'
import { deletePost } from '@/actions/post.action'

const DeleteButton = ({ postId }: { postId: string }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const handleDelete = async () => {
        try {
            if (isDeleting)
                return

            setIsDeleting(true)
            const result = await deletePost(postId)
            if (result.success) {
                toast.success("Post deleted", toastOptions)
            }

        } catch (error) {
            toast.error("Something went wrong", toastOptions)
        } finally {
            setIsDeleting(false)
        }
    }
    return (
        <Button disabled={isDeleting} onClick={handleDelete} variant={"outline"} className='cursor-pointer'>
            {isDeleting ?
                <Loader className='animate-spin' />
                :
                <Trash2 className="h-5 w-5" />
            }
        </Button>
    )
}

export default DeleteButton
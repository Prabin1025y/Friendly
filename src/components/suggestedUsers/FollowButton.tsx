'use client'
import React, { FormEvent, useState } from 'react'
import { Button } from '../ui/button'
import { useUser } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import { toastOptions } from '@/utils/utils'
import { toggleFollow } from '@/actions/follow.action'
import {  Loader2 } from 'lucide-react'

const FollowButton = ({targetUserId}:{targetUserId: string}) => {
    const user = useUser()
    const [loading, setLoading] = useState(false)

    const handleClick = async(e: React.MouseEvent<HTMLButtonElement>)=>{
        if(!user){
            toast.error("Please log in first", toastOptions)
        }
        
        setLoading(true)
        const result = await toggleFollow(targetUserId)
        if(result.success){
            toast.success(`You are now following ${result.user?.name}`)
        }else{
            toast.error("Something went wrong")
        }
        setLoading(false)
    }
    return (
        <Button className='w-16' onClick={handleClick} disabled={loading} variant="default" size="sm" >
            {loading ? <Loader2 className='animate-spin'/> : "Follow"}
        </Button>
    )
}

export default FollowButton
import React from 'react'
import SuggestedUserCard from './SuggestedUserCard'
import { Card, CardContent, CardHeader } from './ui/card'
import { currentUser } from '@clerk/nextjs/server'
import { getSuggestedUsers } from '@/actions/user.action'

const SuggestedUsers = async () => {
    const user = await currentUser()
    if(!user) return null

    const suggestedUsers = await getSuggestedUsers(3);
    return (
        <Card className='py-0 bg-transparent border-none gap-2'>
            <CardHeader className='font-bold text-xl px-4'>Suggested Users</CardHeader>
            <CardContent className='px-0'>
                {suggestedUsers?.map(user=>(
                    <SuggestedUserCard avatarURL={user.image || "placeholder.png"} name={user.name || "name"} username={user.username} userId={user.id} key={user.id}/>
                ))}

            </CardContent>
        </Card>

    )
}

export default SuggestedUsers
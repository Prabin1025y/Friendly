import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const UserAvatar = ({avatarURL, name}:{avatarURL:string, name: string}) => {
    return (
        <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={avatarURL || "/placeholder.svg?height=40&width=40"} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
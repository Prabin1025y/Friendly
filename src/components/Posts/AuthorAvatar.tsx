import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const AuthorAvatar = ({avatarURL, name}:{avatarURL:string, name: string}) => {
    return (
        <Avatar>
            <AvatarImage src={avatarURL || "/placeholder.svg"} alt={name || "User Avatar"} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}

export default AuthorAvatar
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Link from 'next/link'

const AuthorAvatar = ({ avatarURL, name, username }: { avatarURL: string, name: string, username:string }) => {
    return (
        <Link href={`/profile/${username}`}>
            <Avatar>
                <AvatarImage src={avatarURL || "/placeholder.svg"} alt={name || "User Avatar"} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
    )
}

export default AuthorAvatar
import React from 'react'
import { Card, CardContent } from './ui/card'
import FollowButton from './suggestedUsers/FollowButton'
import UserAvatar from './suggestedUsers/UserAvatar'

const SuggestedUserCard = ({name, avatarURL, username, userId} : {name:string, avatarURL:string, username:string, userId: string}) => {
    const user = {
        avatarUrl: "http",
        name: "prabin acharya",
        username: "prabin",

    }
    return (
        <Card className="w-full py-0 bg-transparent border-none">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">

                        <UserAvatar avatarURL={avatarURL} name={name} />
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{name}</p>
                            <p className="text-xs text-muted-foreground truncate">@{username}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                        <FollowButton targetUserId={userId} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SuggestedUserCard
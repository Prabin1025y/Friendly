import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Calendar, Globe, LogIn, Mail, MapPin, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { currentUser } from '@clerk/nextjs/server'
import { Button } from './ui/button'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { getUserByClerkId } from '@/actions/user.action'

const SideBar = async () => {
  const avatarUrl = "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740"
  const name = "Prabin Acharya"
  const initials = "PA"
  const email = "acharyaprabin1025y@gmail.com"
  const location = "Gauradaha"
  const website = "https://prabinacharya1.com.np"
  const memberSince = 12
  const followers = 2000
  const following = 300
  const bio = "Full Stack Developer"

  const authUser = await currentUser()

  if (!authUser)
    return <UnAuthenticatedSidebar />

  const user = await getUserByClerkId(authUser.id)
  // console.log(user)

  if (!user) return null

  return <Card className="w-full mx-auto">
    <CardHeader className="flex flex-col items-center pb-2">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "authUser Name"} />
        <AvatarFallback className="text-2xl">{user?.name}</AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold text-center">{user?.name}</h2>

      {/* Followers and Following counts */}
      <div className="flex justify-center w-full mt-3 space-x-8">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{user?._count.followers.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{user?._count.following.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Following</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Bio section */}
        {bio && (
          <div className="pb-3 border-b">
            <p className="text-sm leading-relaxed">{user?.bio || "I am a Friendly user"}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm break-all">{user?.email}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm">{user?.location || "somewhere in Earth"}</span>
        </div>

        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            className="text-sm text-primary hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {website || "https://youtube.com"}
          </a>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground">Member since {user?.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
}

export default SideBar



const UnAuthenticatedSidebar = () => {
  const name = "prabina acharya"
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center pb-2">
        {/* <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="authUser" />
                    <AvatarFallback className="text-2xl">👋</AvatarFallback>
                </Avatar> */}
        <h2 className="text-2xl font-bold text-center">{name ? `Welcome back, ${name}!` : "Welcome back!"}</h2>
        <p className="text-center text-muted-foreground mt-2">Please sign in to continue or create a new account</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInButton>
          <Button className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
        </SignInButton>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="relative w-full mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <SignUpButton>
          <Button variant="outline" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign up
          </Button>
        </SignUpButton>
      </CardFooter>
    </Card>
  )
}
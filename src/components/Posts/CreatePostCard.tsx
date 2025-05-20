"use client"

import { useState } from "react"
import { ImageIcon, Loader2, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { createPost } from "@/actions/post.action"
import toast from "react-hot-toast"
import { toastOptions } from "@/utils/utils"

export default function CreatePostCard() {
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [isAttaching, setIsAttaching] = useState(false)
  const { user } = useUser()

  const handlePost = async () => {
    if (!user) throw Error("Not authenticated")

    if (!content.trim() && !image.trim()) return

    try {
      setIsPosting(true)
      const result = await createPost(content, image)

      if (result?.success) {
        setContent("")
        setImage("")
        setIsPosting(false)
        setIsAttaching(false)
        toast.success("Post added successfully", toastOptions)
      }
    } catch (error) {
      alert("Error occured in handlePost, Check console")
      console.error("Error", error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleAttachImage = () => {
    setIsAttaching(true)
    // In a real implementation, this would open a file picker
    console.log("Attaching image")
  }

  return (
    <Card className="w-full mx-auto">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.imageUrl || "/placeholder.svg?height=40&width=40"} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-24 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {isAttaching && (
              <div className="mt-2 p-2 bg-muted rounded-md text-sm text-muted-foreground">Image will be attached</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-6 py-1">
        <Button variant="outline" size="sm" onClick={handleAttachImage}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Attach Image
        </Button>
        <Button size={"sm"} className="w-20 flex justify-center cursor-pointer" onClick={handlePost} disabled={isPosting || !content.trim() && !image}>
          {isPosting ?
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            : <>
            <Send className="h-4 w-4 mr-2" />
              Post
            </>}
        </Button>
      </CardFooter>
    </Card>
  )
}

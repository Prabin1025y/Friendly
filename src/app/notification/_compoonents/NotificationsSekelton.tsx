import { Bell } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsSkeleton() {
  // Create an array of different skeleton items
  const skeletonItems = [
    { hasPost: true, hasImage: true, hasComment: false },
    { hasPost: true, hasImage: false, hasComment: true },
    { hasPost: true, hasImage: false, hasComment: true },
    { hasPost: false, hasImage: false, hasComment: false },
    { hasPost: true, hasImage: true, hasComment: false },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {skeletonItems.map((item, index) => (
            <div key={index} className="p-4 overflow-hidden">
              <div className="flex gap-4">
                {/* Avatar skeleton */}
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      {/* Name and message skeleton */}
                      <div className="flex gap-2 items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    {/* Time skeleton */}
                    <Skeleton className="h-3 w-16" />
                  </div>

                  {/* Post preview skeleton (only for some items) */}
                  {item.hasPost && (
                    <div className="mt-2 rounded-md border p-3 text-sm overflow-hidden">
                      <div className="flex gap-3">
                        {item.hasImage && (
                          <div className="flex-shrink-0">
                            <Skeleton className="h-12 w-12 rounded-md" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <Skeleton className="h-3 w-full" />

                          {/* Comment skeleton */}
                          {item.hasComment && (
                            <div className="mt-3 pl-2 border-l-2 border-muted space-y-2">
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-2/3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

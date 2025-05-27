"use client"

import { logout } from "@/app/login/actions"
import { CurrentUserAvatar } from "@/components/current-user-avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUserData } from "@/hooks/use-current-user-data"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Progress } from "./ui/progress"

export default function FloatingAvatar() {
  const pathname = usePathname()
  const router = useRouter()
  const userData = useCurrentUserData()
  const [initials, setInitials] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    if (userData.name) {
      const calculatedInitials = userData.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
      setInitials(calculatedInitials)
    } else {
      setInitials(null)
    }

    setProgress(userData.levelData[1] / userData.levelData[2] * 100)
  }, [userData])

  const handleSignOut = async () => {
    try {
      const result = await logout()
      if (!result.success) {
        toast.error("Logout failed: " + result.error)
      } else {
        toast.success("Logout successful!", { autoClose: 2000 })
        if (result.redirectTo) {
          router.push(result.redirectTo)
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error)
    }
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <div className="fixed right-5 top-5 z-50 flex items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 rounded-full hover:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
            <CurrentUserAvatar initials={initials} level={userData.levelData[0]} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-opacity-90 bg-[var(--color-background)] border-2 border-primary shadow-none grid grid-cols-1 justify-items-center p-0">
          <DropdownMenuLabel>{userData.name || "Guest"}</DropdownMenuLabel>
          <DropdownMenuGroup className="flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center mb-5">
              <div className="text-md">
                Level {userData.levelData[0]}
              </div>
              <Progress value={progress} indicatorColor="bg-green-500" />
              <div className="text-sm">
                {userData.levelData[1]} / {userData.levelData[2]}
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer">
              <button onClick={() => router.push(`/profile/${userData.id}`)} className="pb-2 px-4 font-medium cursor-pointer">
                Profile
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <button onClick={handleSignOut} className="pb-2 px-4 font-medium cursor-pointer">
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

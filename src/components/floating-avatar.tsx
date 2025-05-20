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
import { useCurrentUserName } from "@/hooks/use-current-user-name"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function FloatingAvatar() {
  const pathname = usePathname()
  const router = useRouter()
  const name = useCurrentUserName()
  const [initials, setInitials] = useState<string | null>(null)

  useEffect(() => {
    if (name) {
      const calculatedInitials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
      setInitials(calculatedInitials)
    } else {
      setInitials(null)
    }
  }, [name])

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
    <div className="fixed top-5 right-15 z-50 flex items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent hover:bg-transparent w-10 h-10 rounded-full text-black dark:text-white outline-2 outline-solid outline-black dark:outline-white p-0 cursor-pointer">
            <CurrentUserAvatar initials={initials} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-transparent border-none shadow-none grid grid-cols-1 justify-items-center">
          <DropdownMenuLabel>{name || "Guest"}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="bg-transparent hover:bg-transparent cursor-pointer">
              <button onClick={handleSignOut} className="pb-2 px-4 border-b-2 border-primary font-medium">
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

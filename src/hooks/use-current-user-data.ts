"use client"

import { getLevel } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export function useCurrentUserData() {
  const [name, setName] = useState<string | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [levelData, setLevelData] = useState<number[]>([1, 0, 50])
  const supabase = createClient()

  const fetchCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        setName(null)
        return
      }

      setId(data.user?.id || null)

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
          setName(null)
        } else {
          setName(profileData?.username || null)
          setLevelData(getLevel(profileData.xp))
        }
      } else {
        setName(null)
      }
    } catch (error) {
      console.error("Unexpected error fetching user:", error)
      setName(null)
    }
  }

  useEffect(() => {
    fetchCurrentUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchCurrentUser()
    })

    const intervalId = setInterval(() => {
      fetchCurrentUser()
    }, 3000)

    const handleFocus = () => {
      fetchCurrentUser()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      subscription.unsubscribe()
      clearInterval(intervalId)
      window.removeEventListener("focus", handleFocus)
    }
  }, [supabase.auth])

  return { name, id, levelData }
}

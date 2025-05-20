"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export function useCurrentUserName() {
  const [name, setName] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        setName(null)
        return
      }

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
          setName(null)
        } else {
          setName(profileData?.username || null)
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

  return name
}

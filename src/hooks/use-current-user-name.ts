"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

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
        if (data.user.user_metadata?.full_name) {
          setName(data.user.user_metadata.full_name)
        } else if (data.user.user_metadata?.name) {
          setName(data.user.user_metadata.name)
        } else {
          setName(data.user.email || null)
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
  }, [])

  return name
}

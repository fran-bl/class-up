import { createClient } from "@/utils/supabase/server"
import { jwtDecode } from "jwt-decode"
import { type NextRequest, NextResponse } from "next/server"

interface DecodedJWT {
  user_role?: string
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle()

      if (!existingProfile) {
        const username =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "user"

        let finalUsername = username
        let counter = 1

        while (true) {
          const { data: usernameCheck } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", finalUsername)
            .maybeSingle()

          if (!usernameCheck) break

          finalUsername = `${username}${counter}`
          counter++
        }

        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          username: finalUsername,
          avatar_url: data.user.user_metadata?.avatar_url || null,
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          return NextResponse.redirect(`${origin}/unauthorized`)
        }
      }

      let redirectTo = "/dashboard"

      try {
        const accessToken = data.session.access_token
        const decoded = jwtDecode<DecodedJWT>(accessToken)
        const userRole = decoded.user_role ?? "student"

        if (userRole === "admin") {
          redirectTo = "/admin/dashboard"
        } else if (userRole === "teacher") {
          redirectTo = "/teacher/dashboard"
        }
      } catch (error) {
        console.error("Error decoding JWT:", error)
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const forwardedProto = request.headers.get("x-forwarded-proto")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectTo}`)
      } else if (forwardedHost) {
        const protocol = forwardedProto || "https"
        return NextResponse.redirect(`${protocol}://${forwardedHost}${redirectTo}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectTo}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/unauthorized`)
}

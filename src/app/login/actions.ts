"use server"

import { createClient } from "@/utils/supabase/server"
import { jwtDecode } from "jwt-decode"
import { revalidatePath } from "next/cache"

type AuthResult = {
    success?: boolean
    error?: string
    redirectTo?: string
}

type DecodedJWT = {
  user_role: string;
}

export async function login(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { data: sessionData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    const accessToken = sessionData?.session?.access_token
    if (!accessToken) {
        return {
            success: false,
            error: "No access token found",
        }
    }

    let userRole = "student"
    try {
        const decoded = jwtDecode<DecodedJWT>(accessToken)
        userRole = decoded.user_role ?? "student"
    } catch (error) {
        return {
            success: false,
            error: "Failed to decode JWT: " + error,
        }
    }

    let redirectTo = "/dashboard"
    if (userRole === "admin") {
        redirectTo = "/admin/dashboard"
    } else if (userRole === "teacher") {
        redirectTo = "/teacher/dashboard"
    }

    revalidatePath("/", "layout")
    return {
        success: true,
        redirectTo: redirectTo,
    }
}

export async function signup(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    revalidatePath("/", "layout")
    return {
        success: true,
        redirectTo: "/login",
    }
}

export async function logout(): Promise<AuthResult> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    revalidatePath("/", "layout")
    return {
        success: true,
        redirectTo: "/login",
    }
}
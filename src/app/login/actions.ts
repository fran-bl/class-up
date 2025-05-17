"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

type AuthResult = {
    success?: boolean
    error?: string
    redirectTo?: string
}

export async function login(formData: FormData): Promise<AuthResult> {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    revalidatePath("/", "layout")
    return {
        success: true,
        redirectTo: "/dashboard",
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
        redirectTo: "/dashboard",
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
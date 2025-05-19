"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { login, signup } from "./actions"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formType, setFormType] = useState<"login" | "signup">("login")
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const logoSrc = currentTheme === 'dark' 
    ? '/images/logo-c-dark.png' 
    : '/images/logo-c-light.png';

  async function handleLogin(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await login(formData)
      if (!result.success) {
        toast.error("Login failed: " + result.error)
      } else {
        toast.success("Login successful!", { autoClose: 2000 })
        setTimeout(() => {
          if (result.redirectTo) {
            router.push(result.redirectTo)
          }
        }, 1000)
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signup(formData)
      if (!result.success) {
        toast.error("Signup failed: " + result.error)
      } else {
        toast.success("Signup successful! Please verify your e-mail.", { autoClose: 2000 })
        setTimeout(() => {
          if (result.redirectTo) {
            router.push(result.redirectTo)
          }
        }, 1000)
      }
    } catch (error) {
      toast.error("An unexpected error occurred: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to <span style={{ fontFamily: "var(--font-gta-medium)", alignItems: "center" }}>
          <img
            src={logoSrc}
            alt="C"
            className="w-20 h-20 inline-block mb-12 -mr-6"
            style={{ objectFit: "contain" }}
          />
          lassUp
        </span>
        !
      </h1>
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <div className="flex justify-center mb-6 border-b">
          <button
            onClick={() => setFormType("login")}
            className={`pb-2 px-4 ${formType === "login" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
          >
            Log in
          </button>
          <button
            onClick={() => setFormType("signup")}
            className={`pb-2 px-4 ${formType === "signup" ? "border-b-2 border-primary font-medium" : "text-gray-500"}`}
          >
            Sign up
          </button>
        </div>

        <form className="flex flex-col gap-4" action={formType === "login" ? handleLogin : handleSignup}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="example@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Your password" required />
          </div>

          <Button type="submit" className="mt-2 text-xl cursor-pointer w-32 self-center" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {formType === "login" ? "Logging in..." : "Signing up..."}
              </>
            ) : formType === "login" ? (
              "Log in"
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

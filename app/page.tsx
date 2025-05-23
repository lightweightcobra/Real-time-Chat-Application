"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth-form"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/chat")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111b21]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111b21]">
        <div className="text-white">Redirecting to chat...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111b21]">
      <AuthForm />
    </div>
  )
}

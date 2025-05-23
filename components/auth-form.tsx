"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function AuthForm() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [username, setUsername] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(loginEmail, loginPassword)
      router.push("/chat")
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate phone number
      if (!phone.match(/^\+?[0-9]{10,15}$/)) {
        throw new Error("Please enter a valid phone number")
      }

      await signUp(signupEmail, signupPassword, username, phone)

      // Show success message
      setError("Account created successfully! Please check your email to verify your account.")

      // Clear form
      setUsername("")
      setSignupEmail("")
      setPhone("")
      setSignupPassword("")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px] bg-whatsapp-panel text-white">
      <CardHeader>
        <CardTitle className="text-whatsapp-green text-center text-2xl">WhatsApp Clone</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Login or create an account to start chatting
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-whatsapp-dark">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              {error && (
                <p className={`text-sm ${error.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-whatsapp-green hover:bg-whatsapp-light-green"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="signup">
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="john@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="bg-whatsapp-dark border-whatsapp-dark text-white"
                  required
                />
              </div>
              {error && (
                <p className={`text-sm ${error.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-whatsapp-green hover:bg-whatsapp-light-green"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

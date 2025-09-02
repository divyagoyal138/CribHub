"use client"
import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign in"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const onSignUp = async () => {
    setError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign up"
      setError(message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to find your perfect roommate.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button className="w-full" disabled={loading} onClick={onSignIn}>{loading ? "Signing in..." : "Sign In"}</Button>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button onClick={onSignUp} className="underline disabled:opacity-50" disabled={loading}>Sign Up</button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

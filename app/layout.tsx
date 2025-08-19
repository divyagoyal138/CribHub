import type React from "react"
import "./globals.css"
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils"


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "CribHub - Roommate Finder Dashboard",
  description: "Find your perfect roommate with ease.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
        </body>
      
    </html>
  )
}

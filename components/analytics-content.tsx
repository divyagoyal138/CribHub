"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Users, TrendingUp, Sparkles, Star } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for analytics
const analyticsData = [
  { month: "Jan", listings: 10, new: 2 },
  { month: "Feb", listings: 12, new: 3 },
  { month: "Mar", listings: 15, new: 3 },
  { month: "Apr", listings: 18, new: 4 },
  { month: "May", listings: 22, new: 4 },
  { month: "Jun", listings: 25, new: 3 },
  { month: "Jul", listings: 28, new: 3 },
  { month: "Aug", listings: 32, new: 4 },
  { month: "Sep", listings: 35, new: 3 },
  { month: "Oct", listings: 38, new: 3 },
  { month: "Nov", listings: 42, new: 4 },
  { month: "Dec", listings: 45, new: 3 },
]

export function AnalyticsContent() { // Changed to named export
  // These values would typically come from a global state or fetched data
  const totalListings = 45;
  const newThisMonth = 3;
  const avgCompatibility = 85; // Placeholder
  const favoritesCount = 7; // Placeholder

  return (
    <div className="flex-1 flex flex-col"> {/* Removed p-6, parent will handle padding */}
      <h1 className="text-3xl font-bold mb-6 text-primary">Analytics Dashboard</h1>

      {/* Stats Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Total Listings</p>
                  <p className="text-2xl font-bold text-primary">{totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">New This Month</p>
                  <p className="text-2xl font-bold text-primary">+{newThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Avg. Compatibility</p>
                  <p className="text-2xl font-bold text-primary">{avgCompatibility}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Favorites</p>
                  <p className="text-2xl font-bold text-primary">{favoritesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listings Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Listings Trend Over Time</CardTitle>
          <CardDescription className="text-primary">Monthly new and total listings</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              listings: {
                label: "Total Listings",
                color: "hsl(214 39% 40%)", // #3e628e
              },
              new: {
                label: "New Listings",
                color: "hsl(214 39% 40%)", // #3e628e
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="listings" fill="var(--color-listings)" name="Total Listings" />
                <Bar dataKey="new" fill="var(--color-new)" name="New Listings" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Search, Grid3X3, List, Star, Plus, Eye, Settings, Download, Trash2, Edit, TrendingUp, Tag, Heart, Share2, LayoutGrid, Rows, CalendarIcon, Kanban, Home, DollarSign, Users, CheckCircle, BedSingle, CalendarDays, MessageSquare, Phone, Linkedin, Instagram, BookOpen, Gamepad2, MountainIcon as Hiking, Utensils, Film, Palette, Dumbbell, Coffee, Moon, Sun, PawPrint, CigaretteIcon as Smoking, Volume2, Sparkles, ShieldCheck, Globe, BarChart } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Removed Convex useQuery and api imports

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AnalyticsContent } from "@/components/analytics-content" // Import the new AnalyticsContent

// Types
interface Review {
  id: number
  reviewer: string
  rating: number
  comment: string
}

interface BudgetRange {
  min: number
  max: number
}

interface SocialMediaLinks {
  linkedin?: string
  instagram?: string
}

interface LifestylePreferences {
  cleanliness: string
  socialHabits: string
  noiseLevel: string
  pets: string
  smoking: string
}

interface Roommate {
  id: number
  name: string
  age: number
  gender: string
  occupation: string
  location: string
  accommodationType: string
  roomType: string
  rent: number
  availability: string
  lifestyle: LifestylePreferences
  compatibilityScore: number
  isVerified: boolean
  rating: number
  profilePicture: string
  photos: string[]
  bio: string
  dateJoined: string
  lastActive: string
  preferredMoveInDate: string
  minLeaseDuration: string
  budget: BudgetRange
  contactPreference: string
  socialMedia: SocialMediaLinks
  interests: string[]
  reviews: Review[]
  isFavorite: boolean
}


// Mock data for roommates
const initialRoommates = [
  {
    id: 1,
    name: "Alice Johnson",
    age: 24,
    gender: "Female",
    occupation: "Software Engineer",
    location: "San Francisco, CA",
    accommodationType: "Apartment",
    roomType: "Private Room",
    rent: 1200,
    availability: "2024-03-01",
    lifestyle: {
      cleanliness: "Very Clean",
      socialHabits: "Moderately Social",
      noiseLevel: "Quiet",
      pets: "No Pets",
      smoking: "Non-smoker",
    },
    compatibilityScore: 92,
    isVerified: true,
    rating: 4.8,
    profilePicture: "/placeholder.svg?height=64&width=64",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    bio: "I'm a software engineer looking for a quiet and clean place. I enjoy coding, hiking, and occasional board game nights. I respect personal space but also enjoy a good chat.",
    dateJoined: "2023-10-01",
    lastActive: "2024-01-20",
    preferredMoveInDate: "2024-03-01",
    minLeaseDuration: "6 months",
    budget: { min: 1000, max: 1300 },
    contactPreference: "Email",
    socialMedia: { linkedin: "alicej", instagram: "alice_j" },
    interests: ["coding", "hiking", "board games", "reading"],
    reviews: [
      { id: 1, reviewer: "John Doe", rating: 5, comment: "Alice was a fantastic roommate, very tidy and respectful." },
    ],
    isFavorite: false, // Added for favorites feature
  },
  {
    id: 2,
    name: "Bob Smith",
    age: 28,
    gender: "Male",
    occupation: "Graphic Designer",
    location: "New York, NY",
    accommodationType: "Studio",
    roomType: "Entire Place",
    rent: 1800,
    availability: "2024-02-15",
    lifestyle: {
      cleanliness: "Moderately Clean",
      socialHabits: "Social",
      noiseLevel: "Moderate",
      pets: "Dog Friendly",
      smoking: "Non-smoker",
    },
    compatibilityScore: 85,
    isVerified: true,
    rating: 4.5,
    profilePicture: "/placeholder.svg?height=64&width=64",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    bio: "Creative designer seeking a vibrant neighborhood. I love exploring new cafes, art galleries, and have a friendly golden retriever. Looking for someone who appreciates a lively home.",
    dateJoined: "2023-09-10",
    lastActive: "2024-01-19",
    preferredMoveInDate: "2024-02-15",
    minLeaseDuration: "12 months",
    budget: { min: 1700, max: 2000 },
    contactPreference: "Phone",
    socialMedia: { instagram: "bob_designs" },
    interests: ["art", "photography", "dogs", "cooking"],
    reviews: [
      { id: 2, reviewer: "Jane Doe", rating: 4, comment: "Bob is a great guy, very social. His dog is adorable!" },
    ],
    isFavorite: true, // Added for favorites feature
  },
  {
    id: 3,
    name: "Charlie Brown",
    age: 22,
    gender: "Non-binary",
    occupation: "Student",
    location: "Boston, MA",
    accommodationType: "Shared House",
    roomType: "Shared Room",
    rent: 700,
    availability: "2024-03-10",
    lifestyle: {
      cleanliness: "Average",
      socialHabits: "Quiet",
      noiseLevel: "Quiet",
      pets: "No Pets",
      smoking: "Non-smoker",
    },
    compatibilityScore: 78,
    isVerified: false,
    rating: 3.9,
    profilePicture: "/placeholder.svg?height=64&width=64",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    bio: "University student focused on studies. I'm generally quiet but open to making new friends. Looking for a budget-friendly place near campus.",
    dateJoined: "2023-11-05",
    lastActive: "2024-01-18",
    preferredMoveInDate: "2024-03-10",
    minLeaseDuration: "9 months",
    budget: { min: 600, max: 800 },
    contactPreference: "Email",
    socialMedia: {},
    interests: ["studying", "gaming", "movies"],
    reviews: [],
    isFavorite: false, // Added for favorites feature
  },
  {
    id: 4,
    name: "Diana Prince",
    age: 30,
    gender: "Female",
    occupation: "Marketing Manager",
    location: "Los Angeles, CA",
    accommodationType: "House",
    roomType: "Private Room",
    rent: 1500,
    availability: "2024-04-01",
    lifestyle: {
      cleanliness: "Very Clean",
      socialHabits: "Moderately Social",
      noiseLevel: "Moderate",
      pets: "Cat Friendly",
      smoking: "Non-smoker",
    },
    compatibilityScore: 88,
    isVerified: true,
    rating: 4.7,
    profilePicture: "/placeholder.svg?height=64&width=64",
    photos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    bio: "Experienced marketing professional seeking a comfortable home. I enjoy fitness, healthy cooking, and occasional social gatherings. I have a very friendly cat.",
    dateJoined: "2023-08-20",
    lastActive: "2024-01-21",
    preferredMoveInDate: "2024-04-01",
    minLeaseDuration: "12 months",
    budget: { min: 1400, max: 1600 },
    contactPreference: "Phone",
    socialMedia: { linkedin: "dianap" },
    interests: ["fitness", "cooking", "cats", "travel"],
    reviews: [
      {
        id: 3,
        reviewer: "Clark Kent",
        rating: 5,
        comment: "Diana is an amazing roommate, very organized and her cat is adorable.",
      },
    ],
    isFavorite: true, // Added for favorites feature
  },
]

const accommodationTypes = ["All", "Apartment", "House", "Studio", "Shared Room"]
const defaultPhotos = ["/ap1.jpg", "/ap2.jpg", "/ap3.jpg", "/ap4.jpg"]
const getDefaultPhotoForId = (id: number) => defaultPhotos[Math.abs(id) % defaultPhotos.length]
const normalizePhoto = (roommate: Pick<Roommate, "id">, src?: string) => {
  if (!src || src.includes("placeholder.svg")) return getDefaultPhotoForId(Number(roommate?.id ?? 0))
  return src
}
const rentRanges = ["All", "$500-1000", "$1000-1500", "$1500-2000", "$2000+"]
const verificationStatuses = ["All", "Verified", "Unverified"]
const genders = ["All", "Male", "Female", "Non-binary"]

const viewModes = [
  { id: "grid", label: "Grid", icon: LayoutGrid },
  { id: "list", label: "List", icon: List },
  { id: "compact", label: "Compact", icon: Rows },
  { id: "kanban", label: "Kanban", icon: Kanban },
  { id: "timeline", label: "Timeline", icon: CalendarIcon },
]

function DetailedRoommateModal({ roommate, isOpen, onClose }: { roommate: Roommate | null; isOpen: boolean; onClose: (open: boolean) => void }) {
  if (!roommate) return null

  const compatibilityColors = {
    high: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200",
    medium: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200",
    low: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200",
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return compatibilityColors.high
    if (score >= 60) return compatibilityColors.medium
    return compatibilityColors.low
  }

  const lifestyleIcons: Record<string, React.ElementType> = {
    cleanliness: Sparkles,
    socialHabits: Users,
    noiseLevel: Volume2,
    pets: PawPrint,
    smoking: Smoking,
  }

  const interestIcons: Record<string, React.ElementType> = {
    coding: BookOpen,
    hiking: Hiking,
    "board games": Gamepad2,
    reading: BookOpen,
    art: Palette,
    photography: Film,
    dogs: PawPrint,
    cooking: Utensils,
    gaming: Gamepad2,
    movies: Film,
    fitness: Dumbbell,
    cats: PawPrint,
    travel: Globe,
    coffee: Coffee,
    nightlife: Moon,
    daytime: Sun,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={normalizePhoto(roommate, roommate.profilePicture)} alt={roommate.name} />
                <AvatarFallback>{roommate.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{roommate.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {roommate.occupation} in {roommate.location}
                </DialogDescription>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={getCompatibilityColor(roommate.compatibilityScore)}>
                    {roommate.compatibilityScore}% Compatible
                  </Badge>
                  {roommate.isVerified && (
                    <Badge variant="default" className="bg-blue-500 text-white">
                      <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Image
                  src={normalizePhoto(roommate, roommate.photos[0])}
                  alt={`${roommate.name}'s accommodation`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {roommate.photos.slice(1, 3).map((photo: string, index: number) => (
                    <Image
                      key={index}
                      src={normalizePhoto(roommate, photo)}
                      alt={`Roommate photo ${index + 2}`}
                      width={200}
                      height={150}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About Me</h3>
                  <p className="text-muted-foreground">{roommate.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {roommate.interests.map((interest: string) => {
                      const Icon = interestIcons[interest.toLowerCase()] || Tag
                      return (
                        <Badge key={interest} variant="secondary">
                          <Icon className="h-3 w-3 mr-1" />
                          {interest}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Accommodation</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      {roommate.accommodationType}
                    </div>
                    <div className="flex items-center">
                      <BedSingle className="h-4 w-4 mr-2" />
                      {roommate.roomType}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />${roommate.rent}/month
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Available: {roommate.availability}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(roommate.lifestyle).map(([key, value]) => {
                  const Icon = lifestyleIcons[key]
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      </div>
                      <Badge variant="outline">{String(value)}</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget & Lease</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Preferred Rent Range</span>
                  <span className="text-sm text-muted-foreground">
                    ${roommate.budget.min} - ${roommate.budget.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Preferred Move-in Date</span>
                  <span className="text-sm text-muted-foreground">{roommate.preferredMoveInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Minimum Lease Duration</span>
                  <span className="text-sm text-muted-foreground">{roommate.minLeaseDuration}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Age</span>
                    <span className="text-sm text-muted-foreground">{roommate.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Gender</span>
                    <span className="text-sm text-muted-foreground">{roommate.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Occupation</span>
                    <span className="text-sm text-muted-foreground">{roommate.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Location</span>
                    <span className="text-sm text-muted-foreground">{roommate.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm text-muted-foreground">{roommate.dateJoined}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact & Social</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contact Preference</span>
                    <Badge variant="outline">{roommate.contactPreference}</Badge>
                  </div>
                  {roommate.socialMedia.linkedin && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <a
                        href={`https://linkedin.com/in/${roommate.socialMedia.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        @{roommate.socialMedia.linkedin}
                      </a>
                    </div>
                  )}
                  {roommate.socialMedia.instagram && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4" />
                        <span className="text-sm">Instagram</span>
                      </div>
                      <a
                        href={`https://instagram.com/${roommate.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline"
                      >
                        @{roommate.socialMedia.instagram}
                      </a>
                    </div>
                  )}
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Listing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reviews ({roommate.reviews.length})</CardTitle>
                <CardDescription>What others say about {roommate.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {roommate.reviews.length > 0 ? (
                  roommate.reviews.map((review: Review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.reviewer}</span>
                        <div className="flex items-center text-yellow-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function RoommateCard({
  roommate,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleFavorite,
}: {
  roommate: Roommate
  viewMode: "grid" | "list" | "compact" | "kanban" | "timeline"
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onEdit: (roommate: Roommate) => void
  onDelete: (id: number) => void
  onViewDetails: (roommate: Roommate) => void
  onToggleFavorite: (id: number) => void
}) {
  const compatibilityColors = {
    high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return compatibilityColors.high
    if (score >= 60) return compatibilityColors.medium
    return compatibilityColors.low
  }

  if (viewMode === "list") {
    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            <Avatar className="h-12 w-12">
              <AvatarImage src={normalizePhoto(roommate, roommate.profilePicture)} alt={roommate.name} />
              <AvatarFallback>{roommate.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3
                  className="font-medium truncate cursor-pointer hover:text-primary"
                  onClick={() => onViewDetails(roommate)}
                >
                  {roommate.name}, {roommate.age}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(roommate.id)}
                  className="p-0 h-auto w-auto"
                >
                  <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                {roommate.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                <Badge variant="secondary" className={getCompatibilityColor(roommate.compatibilityScore)}>
                  {roommate.compatibilityScore}% Compatible
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {roommate.occupation} in {roommate.location} - {roommate.roomType} for ${roommate.rent}/month
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Available: {roommate.availability}</span>
              <span>•</span>
              <span>
                Rating: {roommate.rating} <Star className="h-3 w-3 inline-block fill-yellow-500 text-yellow-500" />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(roommate)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(roommate)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(roommate.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "compact") {
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            <Avatar className="h-8 w-8">
              <AvatarImage src={normalizePhoto(roommate, roommate.profilePicture)} alt={roommate.name} />
              <AvatarFallback className="text-xs">{roommate.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                onClick={() => onViewDetails(roommate)}
              >
                {roommate.name}, {roommate.age}
              </h3>
              <div className="flex items-center space-x-1 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(roommate.id)}
                  className="p-0 h-auto w-auto"
                >
                  <Heart className={`h-3 w-3 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                {roommate.isVerified && <ShieldCheck className="h-3 w-3 text-blue-500" />}
                <Badge variant="outline" className="text-xs px-1 py-0">
                  ${roommate.rent}
                </Badge>
                <span className="text-xs text-muted-foreground">{roommate.accommodationType}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(roommate)}>
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(roommate)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "kanban") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox checked={isSelected} onCheckedChange={onSelect} />
              <Avatar className="h-8 w-8">
                <AvatarImage src={normalizePhoto(roommate, roommate.profilePicture)} alt={roommate.name} />
                <AvatarFallback className="text-xs">{roommate.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(roommate.id)}
              className="p-0 h-auto w-auto"
            >
              <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
          <h3 className="font-medium mb-2 cursor-pointer hover:text-primary" onClick={() => onViewDetails(roommate)}>
            {roommate.name}, {roommate.age} ({roommate.gender})
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{roommate.bio}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary" className="text-xs">
              ${roommate.rent}/month
            </Badge>
            <Badge variant="outline" className="text-xs">
              {roommate.roomType}
            </Badge>
            {roommate.isVerified && (
              <Badge variant="default" className="bg-blue-500 text-white text-xs">
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{roommate.compatibilityScore}% Compatible</span>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(roommate)}>
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(roommate)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "timeline") {
    return (
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="h-3 w-3 bg-primary rounded-full"></div>
          <div className="w-px h-16 bg-border mt-2"></div>
        </div>
        <Card className="flex-1 group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox checked={isSelected} onCheckedChange={onSelect} />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={normalizePhoto(roommate, roommate.profilePicture)} alt={roommate.name} />
                  <AvatarFallback>{roommate.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium cursor-pointer hover:text-primary" onClick={() => onViewDetails(roommate)}>
                    {roommate.name}, {roommate.age}
                  </h3>
                  <p className="text-xs text-muted-foreground">Available: {roommate.availability}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(roommate.id)}
                  className="p-0 h-auto w-auto"
                >
                  <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Badge variant="outline" className={getCompatibilityColor(roommate.compatibilityScore)}>
                  {roommate.compatibilityScore}%
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{roommate.bio}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  {roommate.accommodationType}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  ${roommate.rent}/month
                </Badge>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onViewDetails(roommate)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(roommate)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
            <Avatar className="h-10 w-10">
              <AvatarImage src={roommate.profilePicture || "/placeholder.svg"} alt={roommate.name} />
              <AvatarFallback>{roommate.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(roommate.id)}
              className="p-0 h-auto w-auto"
            >
              <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {roommate.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(roommate)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(roommate)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(roommate.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <CardTitle className="text-lg cursor-pointer hover:text-primary" onClick={() => onViewDetails(roommate)}>
            {roommate.name}, {roommate.age} ({roommate.gender})
          </CardTitle>
          <CardDescription className="text-sm">
            {roommate.occupation} in {roommate.location}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Image
            src={normalizePhoto(roommate, roommate.photos[0])}
            alt={`${roommate.name}'s accommodation`}
            width={300}
            height={200}
            className="w-full h-32 object-cover rounded-md cursor-pointer"
            onClick={() => onViewDetails(roommate)}
          />
          <p className="text-sm text-muted-foreground line-clamp-2">{roommate.bio}</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {roommate.accommodationType}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {roommate.roomType}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ${roommate.rent}/month
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getCompatibilityColor(roommate.compatibilityScore)}>
                {roommate.compatibilityScore}% Compatible
              </Badge>
              <span>Rating: {roommate.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarDays className="h-3 w-3" />
              <span>Available: {roommate.availability}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AppSidebar({ roommates, onSelectFavorites, onSelectDashboard, onSelectAnalytics }: { roommates: Roommate[]; onSelectFavorites: () => void; onSelectDashboard: () => void; onSelectAnalytics: () => void }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">CribHub</h2>
            <p className="text-xs text-white">Find your perfect match</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSelectDashboard}>
                  <Grid3X3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="h-4 w-4" />
                  <span>My Matches</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSelectFavorites}>
                  <Star className="h-4 w-4" />
                  <span>Favorites</span>
                  <Badge variant="secondary" className="ml-auto">
                    {roommates.filter((r) => r.isFavorite).length}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSelectAnalytics}>
                  <BarChart className="h-4 w-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified Only</span>
                  <Badge variant="secondary" className="ml-auto">
                    {roommates.filter((r) => r.isVerified).length}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <DollarSign className="h-4 w-4" />
                  <span>Under $1000</span>
                  <Badge variant="secondary" className="ml-auto">
                    {roommates.filter((r: any) => r.rent <= 1000).length}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <PawPrint className="h-4 w-4" />
                  <span>Pet Friendly</span>
                  <Badge variant="secondary" className="ml-auto">
                    {roommates.filter((r) => r.lifestyle.pets !== "No Pets").length}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 space-y-2">
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span className="text-white">Total Listings</span>
              <span className="text-white">{roommates.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">New This Month</span>
              <span className="text-white">+3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">Avg. Compatibility</span>
              <span className="text-white">
                {(roommates.reduce((sum: number, r: Roommate) => sum + r.compatibilityScore, 0) / roommates.length).toFixed(
                  0,
                )}
                %
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

// New component for the Dashboard content
function DashboardContent({
  roommates,
  searchQuery,
  setSearchQuery,
  selectedAccommodationType,
  setSelectedAccommodationType,
  selectedRentRange,
  setSelectedRentRange,
  selectedVerificationStatus,
  setSelectedVerificationStatus,
  selectedGender,
  setSelectedGender,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  selectedRoommates,
  handleSelectRoommate,
  handleSelectAll,
  handleBulkDelete,
  handleEdit,
  handleDelete,
  handleViewDetails,
  handleToggleFavorite,
  isAddDialogOpen,
  setIsAddDialogOpen,
  newListing,
  handleInputChange,
  handleSelectChange,
  handleAddListing,
  filteredRoommates,
  renderRoommates,
  isDetailModalOpen,
  selectedRoommate,
  setIsDetailModalOpen,
  setSelectedRoommate,
}: {
  roommates: Roommate[]
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedAccommodationType: string
  setSelectedAccommodationType: React.Dispatch<React.SetStateAction<string>>
  selectedRentRange: string
  setSelectedRentRange: React.Dispatch<React.SetStateAction<string>>
  selectedVerificationStatus: string
  setSelectedVerificationStatus: React.Dispatch<React.SetStateAction<string>>
  selectedGender: string
  setSelectedGender: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  viewMode: "grid" | "list" | "compact" | "kanban" | "timeline"
  setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list" | "compact" | "kanban" | "timeline">>
  selectedRoommates: number[]
  handleSelectRoommate: (roommateId: number, checked: boolean) => void
  handleSelectAll: (checked: boolean) => void
  handleBulkDelete: () => void
  handleEdit: (roommate: Roommate) => void
  handleDelete: (roommateId: number) => void
  handleViewDetails: (roommate: Roommate) => void
  handleToggleFavorite: (roommateId: number) => void
  isAddDialogOpen: boolean
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  newListing: {
    name: string
    age: string
    gender: string
    occupation: string
    location: string
    accommodationType: string
    roomType: string
    rent: string
    availability: string
    bio: string
    interests: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (id: string, value: string) => void
  handleAddListing: () => Promise<void> | void
  filteredRoommates: Roommate[]
  renderRoommates: () => React.ReactNode
  isDetailModalOpen: boolean
  selectedRoommate: Roommate | null
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedRoommate: React.Dispatch<React.SetStateAction<Roommate | null>>
}) {
  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <SidebarTrigger />
          <div className="flex items-center space-x-4 flex-1 ml-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roommates, locations, interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedAccommodationType} onValueChange={setSelectedAccommodationType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {accommodationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRentRange} onValueChange={setSelectedRentRange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by rent" />
                </SelectTrigger>
                <SelectContent>
                  {rentRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedVerificationStatus} onValueChange={setSelectedVerificationStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {verificationStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compatibilityScore">Compatibility</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-lg">
              {viewModes.map((mode) => {
                const Icon = mode.icon
                return (
                  <Button
                    key={mode.id}
                    variant={viewMode === mode.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode.id)}
                    title={mode.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
           <Link href="/login"><Button variant="outline">Login</Button></Link>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Roommate Listing</DialogTitle>
                  <DialogDescription>List yourself or a room to find a match.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newListing.name} onChange={handleInputChange} placeholder="Your Name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={newListing.age}
                        onChange={handleInputChange}
                        placeholder="e.g., 25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={newListing.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genders.slice(1).map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={newListing.occupation}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newListing.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accommodationType">Accommodation Type</Label>
                      <Select
                        value={newListing.accommodationType}
                        onValueChange={(val) => handleSelectChange("accommodationType", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accommodationTypes.slice(1).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="roomType">Room Type</Label>
                      <Select
                        value={newListing.roomType}
                        onValueChange={(val) => handleSelectChange("roomType", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private Room">Private Room</SelectItem>
                          <SelectItem value="Shared Room">Shared Room</SelectItem>
                          <SelectItem value="Entire Place">Entire Place</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rent">Rent ($/month)</Label>
                    <Input
                      id="rent"
                      type="number"
                      value={newListing.rent}
                      onChange={handleInputChange}
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability Date</Label>
                    <Input
                      id="availability"
                      type="date"
                      value={newListing.availability}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={newListing.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and what you're looking for..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="interests">Interests (comma-separated)</Label>
                    <Input
                      id="interests"
                      value={newListing.interests}
                      onChange={handleInputChange}
                      placeholder="e.g., hiking, cooking, gaming"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddListing}>Add Listing</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
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
                    <p className="text-2xl font-bold text-primary">{roommates.length}</p>
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
                    <p className="text-2xl font-bold text-primary">+3</p>
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
                    <p className="text-2xl font-bold text-primary">
                      {(roommates.reduce((sum: number, r: Roommate) => sum + r.compatibilityScore, 0) / roommates.length).toFixed(0)}%
                    </p>
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
                    <p className="text-2xl font-bold text-primary">{roommates.filter((r) => r.isFavorite).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRoommates.length > 0 && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedRoommates.length === filteredRoommates.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedRoommates.length} of {filteredRoommates.length} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Roommates Display */}
        {renderRoommates()}

        {filteredRoommates.length === 0 && (
          <div className="text-center py-12">
            <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No roommates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or add a new roommate listing.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Listing
            </Button>
          </div>
        )}
      </main>

      {/* Detailed Roommate Modal */}
      <DetailedRoommateModal
        roommate={selectedRoommate}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedRoommate(null)
        }}
      />
    </>
  )
}


export default function HomePage() {
  
  const [roommates, setRoommates] = useState(initialRoommates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAccommodationType, setSelectedAccommodationType] = useState("All")
  const [selectedRentRange, setSelectedRentRange] = useState("All")
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState("All")
  const [selectedGender, setSelectedGender] = useState("All")
  const [sortBy, setSortBy] = useState("compatibilityScore")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedRoommates, setSelectedRoommates] = useState<number[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRoommate, setSelectedRoommate] = useState<Roommate | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard") // New state for current page

  // Load roommates from localStorage on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('cribhub_roommates') : null
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setRoommates(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to read roommates from localStorage', e)
    }
  }, [])

  // Persist roommates to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cribhub_roommates', JSON.stringify(roommates))
      }
    } catch (e) {
      console.error('Failed to save roommates to localStorage', e)
    }
  }, [roommates])

  // Form states for Add Listing
  const [newListing, setNewListing] = useState({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    location: "",
    accommodationType: "",
    roomType: "",
    rent: "",
    availability: "",
    bio: "",
    interests: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewListing((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewListing((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddListing = async () => {
    if (!newListing.name || !newListing.age || !newListing.rent || !newListing.accommodationType || !newListing.roomType) {
      try { window?.alert?.("Please fill out Name, Age, Rent, Accommodation Type and Room Type.") } catch {}
      return
    }
    const newId = roommates.length > 0 ? Math.max(...roommates.map((r) => r.id)) + 1 : 1
    const newRoommate = {
      id: newId,
      name: newListing.name,
      age: Number.parseInt(newListing.age),
      gender: newListing.gender,
      occupation: newListing.occupation,
      location: newListing.location,
      accommodationType: newListing.accommodationType,
      roomType: newListing.roomType,
      rent: Number.parseInt(newListing.rent),
      availability: newListing.availability,
      lifestyle: {
        cleanliness: "Average", // Default
        socialHabits: "Moderately Social", // Default
        noiseLevel: "Moderate", // Default
        pets: "No Pets", // Default
        smoking: "Non-smoker", // Default
      },
      compatibilityScore: Math.floor(Math.random() * 40) + 60, // Random compatibility
      isVerified: false, // Default
      rating: 0, // Default
      profilePicture: normalizePhoto({ id: newId }, "/ap1.jpg"),
      photos: [normalizePhoto({ id: newId }, undefined)],
      bio: newListing.bio,
      dateJoined: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      preferredMoveInDate: newListing.availability,
      minLeaseDuration: "6 months", // Default
      budget: { min: Number.parseInt(newListing.rent) - 100, max: Number.parseInt(newListing.rent) + 100 }, // Derived
      contactPreference: "Email", // Default
      socialMedia: {}, // Default
      interests: newListing.interests.split(",").map((s) => s.trim()),
      reviews: [],
      isFavorite: false,
      createdAt: serverTimestamp(),
    }

    // Optimistically update UI immediately
    setRoommates((prev) => [...prev, { ...newRoommate, createdAt: new Date().toISOString() }])

    // Fire-and-forget Firestore write
    try {
      void addDoc(collection(db, "roommates"), newRoommate)
    } catch (e) {
      console.error("Failed to store listing in Firestore", e)
    }
    setIsAddDialogOpen(false)
    // Reset form
    setNewListing({
      name: "",
      age: "",
      gender: "",
      occupation: "",
      location: "",
      accommodationType: "",
      roomType: "",
      rent: "",
      availability: "",
      bio: "",
      interests: "",
    })
  }

  const handleToggleFavorite = (roommateId: number) => {
    setRoommates((prev) => prev.map((r) => (r.id === roommateId ? { ...r, isFavorite: !r.isFavorite } : r)))
  }

  const filteredRoommates = useMemo(() => {
    let filtered = roommates.filter((roommate) => {
      const matchesSearch =
        roommate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roommate.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roommate.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roommate.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roommate.interests.some((interest) => interest.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesAccommodationType =
        selectedAccommodationType === "All" || roommate.accommodationType === selectedAccommodationType
      const matchesRentRange =
        selectedRentRange === "All" ||
        (selectedRentRange === "$500-1000" && roommate.rent >= 500 && roommate.rent <= 1000) ||
        (selectedRentRange === "$1000-1500" && roommate.rent > 1000 && roommate.rent <= 1500) ||
        (selectedRentRange === "$1500-2000" && roommate.rent > 1500 && roommate.rent <= 2000) ||
        (selectedRentRange === "$2000+" && roommate.rent > 2000)
      const matchesVerificationStatus =
        selectedVerificationStatus === "All" ||
        (selectedVerificationStatus === "Verified" && roommate.isVerified) ||
        (selectedVerificationStatus === "Unverified" && !roommate.isVerified)
      const matchesGender = selectedGender === "All" || roommate.gender === selectedGender

      return matchesSearch && matchesAccommodationType && matchesRentRange && matchesVerificationStatus && matchesGender
    })

    if (showFavoritesOnly) {
      filtered = filtered.filter((r) => r.isFavorite)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return b.rating - a.rating
        case "price":
          return a.rent - b.rent // Sort by price ascending
        case "availability":
          return new Date(a.availability).getTime() - new Date(b.availability).getTime()
        case "compatibilityScore":
        default:
          return b.compatibilityScore - a.compatibilityScore
      }
    })
  }, [
    roommates,
    searchQuery,
    selectedAccommodationType,
    selectedRentRange,
    selectedVerificationStatus,
    selectedGender,
    sortBy,
    showFavoritesOnly,
  ])

  const handleSelectRoommate = (roommateId: number, checked: boolean) => {
    if (checked) {
      setSelectedRoommates([...selectedRoommates, roommateId])
    } else {
      setSelectedRoommates(selectedRoommates.filter((id) => id !== roommateId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRoommates(filteredRoommates.map((r) => r.id))
    } else {
      setSelectedRoommates([])
    }
  }

  const handleBulkDelete = () => {
    setRoommates((prev) => prev.filter((r) => !selectedRoommates.includes(r.id)))
    setSelectedRoommates([])
    console.log("Bulk delete roommates:", selectedRoommates)
  }

  const handleEdit = (roommate: Roommate) => {
    console.log("Edit roommate:", roommate)
    // In a real app, you'd open an edit form pre-filled with roommate data
  }

  const handleDelete = (roommateId: number) => {
    setRoommates((prev) => prev.filter((r) => r.id !== roommateId))
    console.log("Delete roommate:", roommateId)
  }

  const handleViewDetails = (roommate: Roommate) => {
    setSelectedRoommate(roommate)
    setIsDetailModalOpen(true)
  }

  const renderRoommates = () => {
    if (viewMode === "kanban") {
      const categorizedRoommates = accommodationTypes.slice(1).reduce(
        (acc, type) => {
          acc[type] = filteredRoommates.filter((r) => r.accommodationType === type)
          return acc
        },
        {} as Record<string, any[]>,
      )

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(categorizedRoommates).map(([type, roommates]) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{type}</h3>
                <Badge variant="secondary">{roommates.length}</Badge>
              </div>
              <div className="space-y-3">
                {roommates.map((roommate) => (
                  <RoommateCard
                    key={roommate.id}
                    roommate={roommate}
                    viewMode={viewMode}
                    isSelected={selectedRoommates.includes(roommate.id)}
                    onSelect={(checked: boolean) => handleSelectRoommate(roommate.id, checked)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (viewMode === "timeline") {
      return (
        <div className="max-w-3xl mx-auto">
          {filteredRoommates.map((roommate) => (
            <RoommateCard
              key={roommate.id}
              roommate={roommate}
              viewMode={viewMode}
              isSelected={selectedRoommates.includes(roommate.id)}
              onSelect={(checked: boolean) => handleSelectRoommate(roommate.id, checked)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )
    }

    const gridClasses = {
      grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      list: "space-y-2",
      compact: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3",
    }

    return (
      <div className={gridClasses[viewMode as keyof typeof gridClasses] || gridClasses.grid}>
        {filteredRoommates.map((roommate) => (
          <RoommateCard
            key={roommate.id}
            roommate={roommate}
            viewMode={viewMode}
            isSelected={selectedRoommates.includes(roommate.id)}
            onSelect={(checked: boolean) => handleSelectRoommate(roommate.id, checked)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          roommates={roommates}
          onSelectFavorites={() => {
            setShowFavoritesOnly(true)
            setCurrentPage("dashboard") // Stay on dashboard view but filter favorites
          }}
          onSelectDashboard={() => {
            setShowFavoritesOnly(false)
            setCurrentPage("dashboard")
          }}
          onSelectAnalytics={() => setCurrentPage("analytics")} // Set current page to analytics
        />
        <SidebarInset>
          {currentPage === "dashboard" ? (
            <DashboardContent
              roommates={roommates}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedAccommodationType={selectedAccommodationType}
              setSelectedAccommodationType={setSelectedAccommodationType}
              selectedRentRange={selectedRentRange}
              setSelectedRentRange={setSelectedRentRange}
              selectedVerificationStatus={selectedVerificationStatus}
              setSelectedVerificationStatus={setSelectedVerificationStatus}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              selectedRoommates={selectedRoommates}
              handleSelectRoommate={handleSelectRoommate}
              handleSelectAll={handleSelectAll}
              handleBulkDelete={handleBulkDelete}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleViewDetails={handleViewDetails}
              handleToggleFavorite={handleToggleFavorite}
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              newListing={newListing}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleAddListing={handleAddListing}
              filteredRoommates={filteredRoommates}
              renderRoommates={renderRoommates}
              isDetailModalOpen={isDetailModalOpen}
              selectedRoommate={selectedRoommate}
              setIsDetailModalOpen={setIsDetailModalOpen}
              setSelectedRoommate={setSelectedRoommate}
            />
          ) : (
            <main className="flex-1 p-6">
              <AnalyticsContent />
            </main>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
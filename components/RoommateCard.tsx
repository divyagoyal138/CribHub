"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Heart, ShieldCheck, Eye, Edit, Trash2, CalendarDays, Star } from "lucide-react";

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
}

interface Roommate {
  id: number;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  accommodationType: string;
  roomType: string;
  rent: number;
  availability: string;
  compatibilityScore: number;
  isVerified: boolean;
  rating: number;
  profilePicture?: string;
  photos?: string[];
  bio: string;
}

interface RoommateCardProps {
  roommate: Roommate;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  onToggleFavorite: () => void;
}

export default function RoommateCard({
  roommate,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewDetails,
  onToggleFavorite
}: RoommateCardProps) {
  const compatibilityColors = {
    high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return compatibilityColors.high;
    if (score >= 60) return compatibilityColors.medium;
    return compatibilityColors.low;
  };

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
              onClick={onToggleFavorite}
              className="p-0 h-auto w-auto"
            >
              <Heart className={`h-4 w-4 ${roommate.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {roommate.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={onViewDetails}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <CardTitle className="text-lg cursor-pointer hover:text-primary" onClick={onViewDetails}>
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
            src={roommate.photos?.[0] || "/placeholder.svg"}
            alt={`${roommate.name}'s accommodation`}
            width={300}
            height={200}
            className="w-full h-32 object-cover rounded-md cursor-pointer"
            onClick={onViewDetails}
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
              <span>
                Rating: {roommate.rating}{" "}
                <Star className="h-3 w-3 inline-block fill-yellow-500 text-yellow-500" />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarDays className="h-3 w-3" />
              <span>Available: {roommate.availability}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

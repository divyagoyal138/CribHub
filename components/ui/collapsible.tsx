"use client"

import type React from "react"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"
import { type VariantProps, cva } from "class-variance-authority"

const collapsibleVariants = cva(
  "overflow-hidden text-sm font-medium transition-all data-[state=open]:animate-open data-[state=closed]:animate-closed",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        destructive: "text-destructive hover:text-destructive/foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Collapsible = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & VariantProps<typeof collapsibleVariants>
>(({ className, variant, ...props }, ref) => (
  <CollapsiblePrimitive.Root ref={ref} className={cn(collapsibleVariants({ variant }), className)} {...props} />
))

Collapsible.displayName = CollapsiblePrimitive.Root.displayName

const collapsibleTriggerVariants = cva(
  "flex cursor-pointer select-none items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        destructive: "text-destructive hover:text-destructive/foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const CollapsibleTrigger = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & VariantProps<typeof collapsibleTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(collapsibleTriggerVariants({ variant }), className)}
    {...props}
  />
))

CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName

const collapsibleContentVariants = cva(
  "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top data-[state=open]:invisible data-[state=closed]:visible",
  {
    variants: {
      variant: {
        default: "bg-transparent text-muted-foreground",
        destructive: "text-destructive hover:text-destructive/foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const CollapsibleContent = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> & VariantProps<typeof collapsibleContentVariants>
>(({ className, variant, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(collapsibleContentVariants({ variant }), className)}
    {...props}
  />
))

CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

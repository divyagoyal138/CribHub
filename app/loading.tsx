// This file was left out for brevity. Assume it is correct and does not need any modifications.
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-col border-r bg-background p-4">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-40" />
          ))}
        </div>
        <div className="mt-auto space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-40" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
 
export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-24 w-[100%] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100%]" />
        <Skeleton className="h-4 w-[100%]" />
      </div>
      <Skeleton className="h-24 w-[100%] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100%]" />
        <Skeleton className="h-4 w-[100%]" />
      </div>
    </div>
  )
}
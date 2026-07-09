"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-6" />
      <h2 className="text-3xl font-semibold tracking-tight text-foreground">
        Something went wrong!
      </h2>
      <p className="mt-4 text-muted-foreground max-w-md">
        An unexpected error occurred. We have been notified and are working to fix it.
      </p>
      <div className="mt-8">
        <Button 
          onClick={() => reset()}
          className="bg-secondary text-primary hover:bg-secondary/90"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
        <h2 className="text-xl font-medium text-foreground">
          Mimaar Associates
        </h2>
        <p className="text-sm text-muted-foreground">Loading experience...</p>
      </div>
    </div>
  )
}

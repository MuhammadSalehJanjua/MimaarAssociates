import { LRUCache } from "lru-cache"

type RateLimitOptions = {
  interval?: number // ms
  uniqueTokenPerInterval?: number
}

export function createRateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60_000,
  })

  return {
    check: (limit: number, token: string): Promise<{ success: boolean; remaining: number }> =>
      new Promise((resolve) => {
        const tokenCount = (tokenCache.get(token) as number) || 0
        const newCount = tokenCount + 1
        tokenCache.set(token, newCount)

        if (newCount > limit) {
          resolve({ success: false, remaining: 0 })
        } else {
          resolve({ success: true, remaining: limit - newCount })
        }
      }),
  }
}

// Pre-configured limiters
export const contactLimiter = createRateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
})

export const newsletterLimiter = createRateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

export const apiLimiter = createRateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"
  return ip
}

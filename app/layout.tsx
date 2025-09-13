import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mimaar Associates - Supply and Services | Construction & Real Estate",
  description:
    "Professional construction, real estate consulting, architectural design, renovation, and interior design services in Islamabad. Builders and developers with expertise in DHA II.",
  generator: "v0.app",
  keywords:
    "construction, real estate, architectural design, renovation, interior design, building materials, Islamabad, DHA II",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

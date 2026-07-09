import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Mimaar Associates",
  description: "Admin login portal for Mimaar Associates",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

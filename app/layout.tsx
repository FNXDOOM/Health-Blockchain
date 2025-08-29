import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainNavigation } from "@/components/main-navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aarogya Rakshak - Decentralized Health Records for India",
  description: "Secure, portable, consent-based health record system powered by blockchain technology",
    generator: 'Team Final Commit'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <MainNavigation />
            <MobileNavigation />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

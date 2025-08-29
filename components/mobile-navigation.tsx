"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)

  const sections = [
    { name: "Dashboard", href: "/" },
    { name: "Onboarding", href: "/patient/onboarding" },
    { name: "Health Passport", href: "/patient/health-passport" },
    { name: "Doctor Access", href: "/doctor/access-portal" },
    { name: "Medical Records", href: "/patient/medical-records" },
    { name: "Doctor NFT", href: "/doctor/nft-panel" },
    { name: "Network", href: "/network" },
    { name: "Emergency Access", href: "/patient/emergency-access" },
  ]

  const handleNavClick = () => {
    setOpen(false)
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b md:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-green-500 mr-2 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg text-foreground">Aarogya Rakshak</span>
          </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[80%] sm:w-[350px] bg-background/95 backdrop-blur-sm border-l border-border/50"
          >
            <div className="flex flex-col gap-4 mt-8">
              {sections.map((section) => (
                <Link
                  key={section.name}
                  href={section.href}
                  className="text-lg font-medium px-2 py-2 rounded-md hover:bg-accent"
                  onClick={handleNavClick}
                >
                  {section.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/patient/onboarding" passHref>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    Get My Aarogya Rakshak Passport
                  </Button>
                </Link>
                <Link href="/doctor/access-portal" passHref>
                  <Button variant="outline" className="w-full border-green-600 text-green-500 hover:bg-green-900/20">
                    Doctor Login Portal
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

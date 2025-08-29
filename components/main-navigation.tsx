"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNavigation() {
  const pathname = usePathname()
  
  return (
    <div className="hidden md:flex sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-green-500 mr-2 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-bold text-lg text-foreground">Aarogya Rakshak</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Patient</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <Link href="/patient/onboarding" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Health Passport</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Access your health records and information</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/patient/health-passport" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Health Passport</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">View and manage your health records</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/patient/medical-records" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Medical Records</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Access your complete medical history</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/patient/emergency-access" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Emergency Access</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Configure emergency access settings</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Doctor</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:grid-cols-2 lg:w-[600px]">
                    <li>
                      <Link href="/doctor" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Dashboard</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">View your doctor dashboard</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/doctor/access-portal" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Access Portal</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Access patient records with authorization</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/doctor/nft-panel" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Doctor NFT Panel</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Manage your doctor credentials</p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link href="/network" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Network
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/patient/onboarding" passHref>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              Get My Aarogya Rakshak Passport
            </Button>
          </Link>
          <Link href="/doctor/access-portal" passHref>
            <Button variant="outline" className="border-green-600 text-green-500 hover:bg-green-900/20">
              Doctor Login Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
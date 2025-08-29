import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { StatusFooter } from "@/components/status-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, User, UserCog, FileText, Shield, Network, Hospital } from "lucide-react"

export default function Home() {
  return (
    <main>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Aarogya Rakshak Dashboard</h2>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            Access all features of the Aarogya Rakshak platform through our intuitive navigation system.
            Choose from patient or doctor portals to manage health records securely.  
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Portal Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Patient Portal
              </CardTitle>
              <CardDescription>Manage your health records</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Get your health passport</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>View medical history</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Configure emergency access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/patient/onboarding" passHref>
                <Button className="w-full">Enter Patient Portal</Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Doctor Portal Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" /> Doctor Portal
              </CardTitle>
              <CardDescription>Access patient records securely</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Verify doctor credentials</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Access patient records with consent</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Manage NFT credentials</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/doctor/access-portal" passHref>
                <Button className="w-full" variant="outline">Enter Doctor Portal</Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Network Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" /> Healthcare Network
              </CardTitle>
              <CardDescription>Explore connected healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>View blockchain-integrated hospitals</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Find nearby healthcare facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-green-500" />
                  <span>Check integration status</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/network" passHref>
                <Button className="w-full" variant="outline">View Network</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <StatusFooter />
    </main>
  )
}

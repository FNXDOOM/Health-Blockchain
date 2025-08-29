import { InteroperabilityNetwork } from "@/components/interoperability-network"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

export default function NetworkPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <BreadcrumbNavigation />
      
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Network</CardTitle>
          <CardDescription>Verified hospitals, labs, and clinics across India</CardDescription>
        </CardHeader>
        <CardContent>
          <InteroperabilityNetwork />
        </CardContent>
      </Card>
    </div>
  )
}
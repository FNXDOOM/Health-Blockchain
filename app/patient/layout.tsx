import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

export const metadata: Metadata = {
  title: "Patient Portal - Aarogya Rakshak",
  description: "Manage your health records and control access",
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <BreadcrumbNavigation />
      
      <Card>
        <CardHeader>
          <CardTitle>Patient Portal</CardTitle>
          <CardDescription>Manage your health records and control access</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
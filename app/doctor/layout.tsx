import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"

export const metadata: Metadata = {
  title: "Doctor Portal - Aarogya Rakshak",
  description: "Secure access to patient records with consent",
}

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <BreadcrumbNavigation />
      
      <Card>
        <CardHeader>
          <CardTitle>Doctor Portal</CardTitle>
          <CardDescription>Secure access to patient records with blockchain verification</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Lock } from "lucide-react"

export function HealthPassportDashboard() {
  const [consentGranted, setConsentGranted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGrantConsent = () => {
    setLoading(true)
    setTimeout(() => {
      setConsentGranted(true)
      setLoading(false)
    }, 1500)
  }

  const medicalRecords = [
    {
      id: "rec-001",
      type: "Prescription",
      doctor: "Dr. Nikhil Kumar",
      hospital: "City General Hospital",
      date: "15 May 2023",
      hash: "0x7a9c...3f21",
      verified: true,
    },
    {
      id: "rec-002",
      type: "Blood Test",
      doctor: "Dr. Sreejith Kumar",
      hospital: "Max Healthcare",
      date: "03 Apr 2023",
      hash: "0x3e7b...9c42",
      verified: true,
    },
    {
      id: "rec-003",
      type: "X-Ray Report",
      doctor: "Dr. Rohan Gupta",
      hospital: "AIIMS Delhi",
      date: "22 Feb 2023",
      hash: "0x8f4d...2a18",
      verified: true,
    },
  ]

  return (
    <section id="health-passport" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Health Passport Dashboard
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your NFT-style digital health card with secure record access
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health Passport NFT</CardTitle>
                <CardDescription>Your soulbound token for health data management</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-full md:w-40 h-40 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">HX</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Decentralized ID</h4>
                    <p className="text-sm font-mono">did:ethr:0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Aadhaar Hash</h4>
                    <p className="text-sm font-mono">0x8a21...7e42</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Medical Snapshot</h4>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="bg-blue-950/30 p-2 rounded text-xs border border-blue-900/50">
                      <span className="font-medium block text-blue-300">Blood Type</span>
                      <span>O+</span>
                    </div>
                    <div className="bg-blue-950/30 p-2 rounded text-xs border border-blue-900/50">
                      <span className="font-medium block text-blue-300">Allergies</span>
                      <span>Penicillin</span>
                    </div>
                    <div className="bg-blue-950/30 p-2 rounded text-xs border border-blue-900/50">
                      <span className="font-medium block text-blue-300">Conditions</span>
                      <span>Hypertension</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Blockchain Sync: 85%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleGrantConsent}
              disabled={consentGranted || loading}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? "Processing..." : consentGranted ? "Access Granted" : "Grant Doctor Access"}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Lock className="h-4 w-4 mr-2" /> Manage Permissions
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Record Timeline</CardTitle>
            <CardDescription>Verified record hashes on blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div key={record.id} className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{record.type}</h4>
                      {record.verified && (
                        <Badge variant="outline" className="text-xs bg-green-950/30 text-green-400 border-green-900/50">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.doctor} • {record.hospital}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{record.date}</span>
                      <span className="text-xs font-mono text-muted-foreground">{record.hash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Records
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Blockchain Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Off-chain storage operational</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Last verification: 5 minutes ago</div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Blockchain Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">All record hashes verified</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Last block: #14,325,678</div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Consent Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Blockchain workflow active</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Active consents: {consentGranted ? "1" : "0"}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

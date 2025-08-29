"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  Database,
  Filter,
  Globe,
  Search,
  Server,
  Building2,
  FlaskRoundIcon as Flask,
  GraduationCap,
} from "lucide-react"
import { BangaloreMap } from "./bangalore-map"

export function InteroperabilityNetwork() {
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const healthcareProviders = [
    {
      id: "provider-001",
      name: "Apollo Hospitals",
      type: "Hospital",
      location: "Delhi",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 245,
      lastSync: "10 minutes ago",
    },
    {
      id: "provider-002",
      name: "Max Healthcare",
      type: "Hospital",
      location: "Mumbai",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 189,
      lastSync: "25 minutes ago",
    },
    {
      id: "provider-003",
      name: "Fortis Hospital",
      type: "Hospital",
      location: "Bangalore",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 156,
      lastSync: "1 hour ago",
    },
    {
      id: "provider-004",
      name: "AIIMS",
      type: "Hospital",
      location: "Delhi",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 312,
      lastSync: "5 minutes ago",
    },
    {
      id: "provider-005",
      name: "Dr. Lal PathLabs",
      type: "Diagnostic",
      location: "Multiple",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 423,
      lastSync: "15 minutes ago",
    },
    {
      id: "provider-006",
      name: "SRL Diagnostics",
      type: "Diagnostic",
      location: "Multiple",
      fhirCompatible: true,
      blockchainIntegrated: false,
      exchangeCount: 178,
      lastSync: "2 hours ago",
    },
    {
      id: "provider-007",
      name: "Medanta",
      type: "Hospital",
      location: "Gurugram",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 134,
      lastSync: "30 minutes ago",
    },
    {
      id: "provider-008",
      name: "Manipal Hospitals",
      type: "Hospital",
      location: "Bangalore",
      fhirCompatible: true,
      blockchainIntegrated: true,
      exchangeCount: 201,
      lastSync: "45 minutes ago",
    },
  ]

  const filteredProviders = healthcareProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <section id="interoperability" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Interoperability Network
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connected healthcare ecosystem with HL7 FHIR and Blockchain integration
        </p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Healthcare Network</CardTitle>
              <CardDescription>Verified hospitals, labs, and clinics across India</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gradient-to-r from-orange-500 to-orange-600" : ""}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-gradient-to-r from-orange-500 to-orange-600" : ""}
              >
                Map View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or type"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="bg-card/30 backdrop-blur-sm border border-border/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription>
                      {provider.type} • {provider.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={
                          provider.fhirCompatible
                            ? "bg-green-950/30 text-green-400 border-green-900/50"
                            : "bg-muted/30 text-muted-foreground border-border/50"
                        }
                      >
                        {provider.fhirCompatible ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                        HL7 FHIR
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          provider.blockchainIntegrated
                            ? "bg-blue-950/30 text-blue-400 border-blue-900/50"
                            : "bg-muted/30 text-muted-foreground border-border/50"
                        }
                      >
                        {provider.blockchainIntegrated ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                Blockchain Integrated
                      </Badge>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Data Exchanges:</span>
                        <span className="font-medium">{provider.exchangeCount}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Last Sync:</span>
                        <span className="font-medium">{provider.lastSync}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-4 p-3 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
                <h3 className="text-sm font-medium mb-2">Bangalore Healthcare Network</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-background/80">
                      <Building2 className="h-3 w-3 text-orange-500" />
                    </div>
                    <span>Hospitals</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-background/80">
                      <Flask className="h-3 w-3 text-green-500" />
                    </div>
                    <span>Diagnostic Centers</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-background/80">
                      <GraduationCap className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Medical Colleges</span>
                  </div>
                </div>
              </div>
              <BangaloreMap />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProviders.length} of {healthcareProviders.length} providers
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">HL7 FHIR Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-400" />
              <span className="text-sm">Standard healthcare data exchange</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Compatible Providers:</span>
                <span className="font-medium">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Data Types Supported:</span>
                <span className="font-medium">Patient, Observation, Medication</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Blockchain Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Enterprise data integration</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Integrated Providers:</span>
                <span className="font-medium">87.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Blockchain Services:</span>
                <span className="font-medium">Hyperledger, Blockchain, Event Mesh</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Data Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-orange-400" />
              <span className="text-sm">Secure health data transfer</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Total Exchanges:</span>
                <span className="font-medium">1,838</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium">99.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

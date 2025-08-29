"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Building2, FlaskRoundIcon as Flask, GraduationCap } from "lucide-react"

// Healthcare facilities data
const healthcareFacilities = [
  {
    id: 1,
    name: "Manipal Hospital",
    type: "Hospital",
    position: [12.9583, 77.6408],
    fhirCompatible: true,
    blockchainIntegrated: true,
    exchangeCount: 201,
  },
  {
    id: 2,
    name: "Fortis Hospital",
    type: "Hospital",
    position: [12.901, 77.5974],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 156,
  },
  {
    id: 3,
    name: "Apollo Hospital",
    type: "Hospital",
    position: [12.9762, 77.6033],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 245,
  },
  {
    id: 4,
    name: "Narayana Health",
    type: "Hospital",
    position: [12.8467, 77.66],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 178,
  },
  {
    id: 5,
    name: "SRL Diagnostics",
    type: "Diagnostic",
    position: [12.9716, 77.5946],
    fhirCompatible: true,
    blockchainIntegrated: false,
    exchangeCount: 178,
  },
  {
    id: 6,
    name: "Dr. Lal PathLabs",
    type: "Diagnostic",
    position: [12.9352, 77.6245],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 423,
  },
  {
    id: 7,
    name: "Bangalore Medical College",
    type: "Medical College",
    position: [12.9592, 77.575],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 134,
  },
  {
    id: 8,
    name: "St. John's Medical College",
    type: "Medical College",
    position: [12.9277, 77.6371],
    fhirCompatible: true,
    sapIntegrated: true,
    exchangeCount: 201,
  },
]

export function BangaloreMap() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Render a placeholder while the map is loading
  if (!mapLoaded) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Bangalore healthcare map...</p>
        </div>
      </div>
    )
  }

  // Render a simplified map visualization since we're having issues with Leaflet
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-card/30 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden relative">
      <div className="absolute inset-0 p-4">
        <div className="text-lg font-medium mb-4">Bangalore Healthcare Network</div>

        <div className="relative h-full">
          {/* Static map with facility markers */}
          <div className="absolute inset-0 bg-[#1a1a2e] rounded-lg overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`col-${i}`} className="border-r border-white/5 h-full"></div>
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`row-${i}`} className="border-b border-white/5 w-full"></div>
              ))}
            </div>

            {/* Facility markers */}
            {healthcareFacilities.map((facility) => {
              // Convert lat/lng to relative positions in our container
              const left = ((facility.position[1] - 77.55) / 0.2) * 100
              const top = (1 - (facility.position[0] - 12.82) / 0.2) * 100

              // Determine icon based on facility type
              let Icon = Building2
              let color = "text-orange-500"

              if (facility.type === "Diagnostic") {
                Icon = Flask
                color = "text-green-500"
              } else if (facility.type === "Medical College") {
                Icon = GraduationCap
                color = "text-blue-500"
              }

              return (
                <div
                  key={facility.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${Math.min(Math.max(left, 10), 90)}%`,
                    top: `${Math.min(Math.max(top, 10), 90)}%`,
                  }}
                >
                  <div
                    className={`h-6 w-6 rounded-full bg-background/80 flex items-center justify-center ${color} hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-card/95 backdrop-blur-sm p-2 rounded-md border border-border/50 text-xs scale-0 group-hover:scale-100 transition-transform origin-bottom z-10">
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-muted-foreground">{facility.type}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge
                        variant="outline"
                        className={
                          facility.fhirCompatible
                            ? "bg-green-950/30 text-green-400 border-green-900/50 text-xs"
                            : "bg-muted/30 text-muted-foreground border-border/50 text-xs"
                        }
                      >
                        HL7 FHIR
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          facility.blockchainIntegrated
                            ? "bg-blue-950/30 text-blue-400 border-blue-900/50 text-xs"
                            : "bg-muted/30 text-muted-foreground border-border/50 text-xs"
                        }
                      >
                        Blockchain
                      </Badge>
                    </div>
                    <div className="mt-1 text-muted-foreground">Exchanges: {facility.exchangeCount}</div>
                  </div>
                </div>
              )
            })}

            {/* Major roads */}
            <div className="absolute inset-0">
              <div className="absolute h-0.5 bg-white/10 w-3/4 top-1/4 left-1/4 transform -rotate-12"></div>
              <div className="absolute h-0.5 bg-white/10 w-1/2 top-1/2 left-1/4 transform rotate-45"></div>
              <div className="absolute w-0.5 bg-white/10 h-3/4 top-1/8 left-1/3"></div>
              <div className="absolute w-0.5 bg-white/10 h-1/2 top-1/4 left-2/3"></div>
            </div>

            {/* City areas */}
            <div className="absolute bottom-4 right-4 text-xs text-white/40">Bangalore City Map</div>
          </div>
        </div>
      </div>
    </div>
  )
}

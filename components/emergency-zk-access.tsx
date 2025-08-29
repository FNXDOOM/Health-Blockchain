"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, Clock, Lock, Shield } from "lucide-react"

export function EmergencyZkAccess() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [patientId, setPatientId] = useState("")

  const handleEmergencyAccess = () => {
    setLoading(true)
    setTimeout(() => {
      setAccessGranted(true)
      setLoading(false)
    }, 2000)
  }

  return (
    <section id="emergency-access" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Emergency ZK-Access Simulation
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Zero-Knowledge Proof access for critical medical information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Emergency Access</CardTitle>
            <CardDescription>ZK-Proof for critical information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-950/30 rounded-lg border border-red-900/50 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-300">Emergency Use Only</h4>
                  <p className="text-sm text-red-400 mt-1">
                    This feature provides limited access to critical medical information without revealing the patient's
                    full health records. Use only in emergency situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-did">Patient DID or Aadhaar</Label>
                <Input
                  id="patient-did"
                  placeholder="Enter patient identifier"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency-reason">Reason for Emergency Access</Label>
                <Input id="emergency-reason" placeholder="Briefly describe the emergency" />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Access will be logged and expire after 24 hours</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleEmergencyAccess}
              disabled={loading || accessGranted || !patientId}
              className="w-full"
              variant="destructive"
            >
              {loading ? "Verifying..." : accessGranted ? "Access Granted" : "Request ZK Access"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Zero-Knowledge Medical Data</CardTitle>
                <CardDescription>Critical information without full record access</CardDescription>
              </div>
              {accessGranted && (
                <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50">
                  <CheckCircle className="h-3 w-3 mr-1" /> ZK Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!accessGranted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Lock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Emergency Access Required</h3>
                <p className="text-muted-foreground max-w-md text-center">
                  Use the emergency access request to view critical medical information without revealing the patient's
                  full health records.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-300">Zero-Knowledge Access Granted</h4>
                      <p className="text-sm text-blue-400 mt-1">
                        You have limited access to critical medical information. This access is logged on the blockchain
                        and will expire in 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age</span>
                          <span className="font-medium">42</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gender</span>
                          <span className="font-medium">Male</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Type</span>
                          <span className="font-medium">O+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight</span>
                          <span className="font-medium">78 kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Height</span>
                          <span className="font-medium">175 cm</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Critical Medical Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Allergies</span>
                          <span className="font-medium">Penicillin, Peanuts</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Conditions</span>
                          <span className="font-medium">Hypertension, Diabetes Type 2</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Current Medications</span>
                          <span className="font-medium">Metformin (500mg), Lisinopril (10mg)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Vitals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Pressure</span>
                          <span className="font-medium">140/90 mmHg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heart Rate</span>
                          <span className="font-medium">78 bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Blood Glucose</span>
                          <span className="font-medium">145 mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Oxygen Saturation</span>
                          <span className="font-medium">98%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Primary Contact</span>
                          <span className="font-medium">Priya Sharma (Wife)</span>
                          <span className="text-muted-foreground">+91 98765 43210</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Secondary Contact</span>
                          <span className="font-medium">Amit Sharma (Son)</span>
                          <span className="text-muted-foreground">+91 87654 32109</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Access expires in 23:58:45</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Request Full Access
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
        <h3 className="text-lg font-medium mb-4">How Zero-Knowledge Proof Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-medium">Request Verification</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Emergency request is verified against the patient's DID and consent rules.
            </p>
          </div>

          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h4 className="font-medium">ZK-Proof Generation</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Blockchain generates a proof revealing only critical information.
            </p>
          </div>

          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <h4 className="font-medium">Limited Data Access</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Critical information is provided without revealing the full health record.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

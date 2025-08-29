"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Filter, Shield, User, X } from "lucide-react"

export function DoctorNftPanel() {
  const auditLogs = [
    {
      id: "audit-001",
      action: "Record Access",
      patient: "Rohan Kumar",
      status: "Authorized",
      timestamp: "Today, 10:23 AM",
      details: "Prescription viewed",
    },
    {
      id: "audit-002",
      action: "Record Update",
      patient: "Priya Singh",
      status: "Authorized",
      timestamp: "Today, 09:45 AM",
      details: "New prescription added",
    },
    {
      id: "audit-003",
      action: "Record Access",
      patient: "Amit Kumar",
      status: "Unauthorized",
      timestamp: "Yesterday, 04:12 PM",
      details: "Access attempt without consent",
    },
    {
      id: "audit-004",
      action: "Emergency Access",
      patient: "Neha Gupta",
      status: "Authorized",
      timestamp: "Yesterday, 11:30 AM",
      details: "Emergency information accessed",
    },
  ]

  return (
    <section id="doctor-nft" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Doctor NFT Panel
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Verified healthcare provider credentials with NFT certification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health Professional NFT</CardTitle>
                <CardDescription>Your verified medical credentials</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900/50">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg mb-4 flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>

              <h3 className="text-lg font-medium">Dr. Nareah Patel</h3>
              <p className="text-sm text-muted-foreground mb-4">Cardiologist, MBBS, MD</p>

              <div className="w-full space-y-3 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License Number</span>
                  <span className="font-medium">MCI-12345-A</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hospital</span>
                  <span className="font-medium">Apollo Hospitals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">DID</span>
                  <span className="font-mono text-xs">did:ethr:0x4B20...8F7E</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NFT ID</span>
                  <span className="font-mono text-xs">#MED-7842</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" /> View Credentials
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Audit Trail Logs</CardTitle>
                <CardDescription>Aarogya Rakshak Table UI with blockchain verification</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.patient}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            log.status === "Authorized"
                              ? "bg-green-950/30 text-green-400 border-green-900/50"
                              : "bg-red-950/30 text-red-400 border-red-900/50"
                          }
                        >
                          {log.status === "Authorized" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" /> {log.status}
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 mr-1" /> {log.status}
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell className="text-sm">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">Showing 4 of 128 logs</div>
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
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Dual-Linked Records</CardTitle>
            <CardDescription>Patient NFT + Doctor NFT verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-300">Enhanced Security</h4>
                  <p className="text-sm text-blue-400 mt-1">
                    All medical records are dual-linked to both the patient's Health Passport NFT and your Health
                    Professional NFT, creating a verifiable chain of custody.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
                <h4 className="text-sm font-medium mb-2">Patient NFT Link</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Records Linked:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">Today</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
                <h4 className="text-sm font-medium mb-2">Doctor NFT Link</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Records Created:</span>
                    <span className="font-medium">132</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Created:</span>
                    <span className="font-medium">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Tamper Detection</CardTitle>
            <CardDescription>Automated hash verification system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-950/30 rounded-lg border border-green-900/50 mb-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">All Records Verified</span>
              </div>
              <p className="text-sm text-green-400">
                Hash verification complete. All records match their blockchain hashes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Verification</span>
                <span className="font-medium">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Verification Method</span>
                <span className="font-medium">Blockchain Storage</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Alert Status</span>
                <span className="font-medium text-green-400">No Alerts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

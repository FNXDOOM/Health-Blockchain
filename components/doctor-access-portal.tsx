"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Search, Shield, User } from "lucide-react"

// In a real app, you would get this from your auth context or session
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated (in a real app, verify with your auth provider)
    const authStatus = localStorage.getItem('doctorAuth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      router.push('/doctor/login');
    }
    setIsLoading(false);
  }, [router]);

  return { isAuthenticated, isLoading };
};

export function DoctorAccessPortal() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [emergencyAccess, setEmergencyAccess] = useState(false);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, this will be handled by the useAuth hook
  if (!isAuthenticated) {
    return null;
  }

  const handleRequestAccess = () => {
    setRequestingAccess(true)
    setTimeout(() => {
      setRequestingAccess(false)
    }, 2000)
  }

  const handleEmergencyAccess = () => {
    setEmergencyAccess(true)
    setTimeout(() => {
      setEmergencyAccess(false)
    }, 2000)
  }

  const accessLogs = [
    {
      id: "log-001",
      patientName: "Rohan Kumar",
      patientDID: "did:ethr:0x7E5F...5Bdf",
      status: "Granted",
      timestamp: "Today, 10:23 AM",
      doctor: "Dr. Nikhil Kumar",
    },
    {
      id: "log-002",
      patientName: "Priya Singh",
      patientDID: "did:ethr:0x3A1F...8C7E",
      status: "Pending",
      timestamp: "Today, 09:45 AM",
      doctor: "Dr. Nikhil Kumar",
    },
    {
      id: "log-003",
      patientName: "Amit Kumar",
      patientDID: "did:ethr:0x9B2D...1F4A",
      status: "Expired",
      timestamp: "Yesterday, 04:12 PM",
      doctor: "Dr. Nikhil Kumar",
    },
    {
      id: "log-004",
      patientName: "Neha Gupta",
      patientDID: "did:ethr:0x5E7C...9D3B",
      status: "Revoked",
      timestamp: "Yesterday, 11:30 AM",
      doctor: "Dr. Nikhil Kumar",
    },
  ]

  return (
    <section id="doctor-access" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Doctor Access Portal
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Secure patient data access with blockchain verification
        </p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
        <CardHeader className="border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Aarogya Rakshak Portal</CardTitle>
              <CardDescription>Healthcare Provider Portal</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-blue-950/30 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-900/50">
                <User className="h-3 w-3" />
                <span>Dr. Nikhil Kumar</span>
              </div>
              <div className="flex items-center gap-1 bg-green-950/30 text-green-300 px-3 py-1 rounded-full text-xs border border-green-900/50">
                <Shield className="h-3 w-3" />
                <span>Verified Provider</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b border-border/50">
              <div className="flex overflow-x-auto">
                <TabsList className="bg-transparent h-12 p-0">
                  <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-12 px-4"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="patient-access"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-12 px-4"
                  >
                    Patient Access
                  </TabsTrigger>
                  <TabsTrigger
                    value="access-logs"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 rounded-none h-12 px-4"
                  >
                    Access Logs
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="dashboard" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Active Patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-sm text-muted-foreground">3 new today</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pending Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">7</div>
                    <p className="text-sm text-muted-foreground">2 urgent</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Records Accessed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">132</div>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Recent Patient Activity</h3>
                <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-2">Aarogya Rakshak Table View</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.slice(0, 3).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.patientName}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.status === "Granted"
                                  ? "bg-green-950/30 text-green-400 border-green-900/50"
                                  : log.status === "Pending"
                                    ? "bg-yellow-950/30 text-yellow-400 border-yellow-900/50"
                                    : "bg-muted/30 text-muted-foreground border-border/50"
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patient-access" className="p-6">
              <div className="mb-6">
                <Label htmlFor="patient-search">Search Patient by DID or Aadhaar</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patient-search"
                      placeholder="Enter DID or Aadhaar number"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    Search
                  </Button>
                </div>
              </div>

              {searchQuery && (
                <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Patient Found</CardTitle>
                        <CardDescription>Rohan Kumar</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-900/50">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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

                      <div className="p-4 bg-yellow-950/30 rounded-lg border border-yellow-900/50">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-300">Access Permission Required</h4>
                            <p className="text-sm text-yellow-400 mt-1">
                              You need the patient's consent to access their health records. Request access or use
                              emergency access if needed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleRequestAccess}
                      disabled={requestingAccess}
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      {requestingAccess ? "Requesting..." : "Request Access"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleEmergencyAccess}
                      disabled={emergencyAccess}
                      className="w-full sm:w-auto"
                    >
                      {emergencyAccess ? "Accessing..." : "Emergency Access"}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {!searchQuery && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Search for a Patient</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter a patient's DID or Aadhaar number to request access to their health records.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="access-logs" className="p-6">
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50 mb-6">
                <div className="text-sm text-muted-foreground mb-2">Aarogya Rakshak Table UI</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>DID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.patientName}</TableCell>
                        <TableCell className="font-mono text-xs">{log.patientDID}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.status === "Granted"
                                ? "bg-green-950/30 text-green-400 border-green-900/50"
                                : log.status === "Pending"
                                  ? "bg-yellow-950/30 text-yellow-400 border-yellow-900/50"
                                  : log.status === "Revoked"
                                    ? "bg-red-950/30 text-red-400 border-red-900/50"
                                    : "bg-muted/30 text-muted-foreground border-border/50"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-300">Blockchain Verification</h4>
                    <p className="text-sm text-blue-400 mt-1">
                      All access logs are recorded on the blockchain for transparency and auditability. Each access
                      request is linked to your Health Professional NFT.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}

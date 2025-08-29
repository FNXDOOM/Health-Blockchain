"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, FileText, Upload, X } from "lucide-react"

export function MedicalRecordsLog() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const medicalRecords = [
    {
      id: "rec-001",
      name: "Prescription - Antibiotics",
      type: "PDF",
      date: "15 May 2023",
      doctor: "Dr. Nareah Patel",
      hospital: "Apollo Hospitals",
      hash: "0x7a9c...3f21",
      ipfsHash: "QmW21...8j7K",
      verified: true,
    },
    {
      id: "rec-002",
      name: "Blood Test Results",
      type: "PDF",
      date: "03 Apr 2023",
      doctor: "Dr. Sreejith Kumar",
      hospital: "Max Healthcare",
      hash: "0x3e7b...9c42",
      ipfsHash: "QmT45...2s9L",
      verified: true,
    },
    {
      id: "rec-003",
      name: "X-Ray Report - Chest",
      type: "DICOM",
      date: "22 Feb 2023",
      doctor: "Dr. Rohan Gupta",
      hospital: "AIIMS Delhi",
      hash: "0x8f4d...2a18",
      ipfsHash: "QmR67...4p2M",
      verified: true,
    },
    {
      id: "rec-004",
      name: "MRI Scan - Knee",
      type: "DICOM",
      date: "10 Jan 2023",
      doctor: "Dr. Bhuvan Khan",
      hospital: "Fortis Hospital",
      hash: "0x2c5e...7f39",
      ipfsHash: "QmZ89...3t5N",
      verified: true,
    },
  ]

  return (
    <section id="medical-records" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Medical Records Log
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Secure storage with blockchain verification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>Your secure, tamper-proof health records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-950/30 rounded-lg border border-blue-900/50">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-medium">{record.name}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${record.verified ? "bg-green-950/30 text-green-400 border-green-900/50" : "bg-red-950/30 text-red-400 border-red-900/50"}`}
                      >
                        {record.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3 mr-1" /> Tampered
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Type:</span> {record.type}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Date:</span> {record.date}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Provider:</span> {record.doctor}, {record.hospital}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Storage:</span> Blockchain + IPFS
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <div className="text-xs font-mono bg-background/30 p-2 rounded border border-border/50">
                        <span className="text-muted-foreground">Blockchain Hash:</span> {record.hash}
                      </div>
                      <div className="text-xs font-mono bg-background/30 p-2 rounded border border-border/50">
                        <span className="text-muted-foreground">IPFS CID:</span> {record.ipfsHash}
                      </div>
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

        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Upload New Record</CardTitle>
            <CardDescription>Add a new medical record to your passport</CardDescription>
          </CardHeader>
          <CardContent>
            {!uploading && !uploadComplete ? (
              <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <h4 className="text-sm font-medium mb-1">Drag and drop your file</h4>
                <p className="text-xs text-muted-foreground mb-4">PDF, JPEG, PNG, or DICOM</p>
                <Button
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Select File
                </Button>
              </div>
            ) : uploading ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50">
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Uploading Medical Record</h4>
                  <Progress value={uploadProgress} className="h-2 mb-2 bg-muted" />
                  <div className="flex justify-between text-xs text-blue-400">
                    <span>Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="mt-3 text-xs text-blue-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Encrypting file</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Generating hash</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {uploadProgress > 50 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-blue-400 animate-pulse"></div>
                      )}
                      <span>Storing in Blockchain</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {uploadProgress > 80 ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-blue-400"></div>
                      )}
                      <span>Updating blockchain</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-950/30 rounded-lg border border-green-900/50">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Upload Complete!</span>
                  </div>
                  <p className="text-sm text-green-400">Your medical record has been securely uploaded and verified.</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="text-xs font-mono bg-background/30 p-2 rounded border border-green-900/50">
                      <span className="text-muted-foreground">Blockchain Hash:</span> 0x4d2e...9f87
                    </div>
                    <div className="text-xs font-mono bg-background/30 p-2 rounded border border-green-900/50">
                      <span className="text-muted-foreground">IPFS CID:</span> QmT78...3k9P
                    </div>
                  </div>
                </div>
                <Button onClick={() => setUploadComplete(false)} variant="outline" className="w-full">
                  Upload Another Record
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col text-xs text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-blue-950/30 rounded-full flex items-center justify-center mt-0.5 border border-blue-900/50">
                <span className="text-blue-400 text-[10px]">i</span>
              </div>
              <span>Records are stored securely with hashes on blockchain</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 bg-blue-950/30 rounded-full flex items-center justify-center mt-0.5 border border-blue-900/50">
                <span className="text-blue-400 text-[10px]">i</span>
              </div>
              <span>Your Health Passport NFT is automatically updated with new record hashes</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
        <h3 className="text-lg font-medium mb-4">How Records Are Stored</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-medium">File Upload</h4>
            </div>
            <p className="text-sm text-muted-foreground">Medical records are encrypted and uploaded to the system.</p>
          </div>

          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h4 className="font-medium">Off-chain Storage</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Files are stored in blockchain and/or IPFS for secure access.
            </p>
          </div>

          <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-950/30 rounded-full flex items-center justify-center border border-blue-900/50">
                <span className="text-blue-400 font-bold">3</span>
              </div>
              <h4 className="font-medium">Blockchain Verification</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              File hashes are stored on blockchain for tamper-proof verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

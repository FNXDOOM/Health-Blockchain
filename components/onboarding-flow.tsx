"use client"

import { useState } from "react"
import { ArrowRight, Fingerprint, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [didCreated, setDidCreated] = useState(false)
  const [nftMinted, setNftMinted] = useState(false)

  const handleNextStep = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (step === 1) {
        setDidCreated(true)
        setProgress(50)
      } else if (step === 2) {
        setNftMinted(true)
        setProgress(100)
      }

      setLoading(false)
      if (step < 3) setStep(step + 1)
    }, 1500)
  }

  return (
    <section id="onboarding" className="py-8 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
          Onboarding Flow
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Simple 3-step process to create your decentralized health identity
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Create Your HealthX Passport</CardTitle>
            <CardDescription>Link your Aadhaar, generate your DID, and mint your Health Passport NFT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={progress} className="h-2 bg-muted" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Identity Verification</span>
                <span>DID Creation</span>
                <span>NFT Minting</span>
              </div>
            </div>

            <Tabs value={`step-${step}`} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="step-1" disabled>
                  Aadhaar
                </TabsTrigger>
                <TabsTrigger value="step-2" disabled>
                  DID
                </TabsTrigger>
                <TabsTrigger value="step-3" disabled>
                  NFT
                </TabsTrigger>
              </TabsList>

              <TabsContent value="step-1">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input id="aadhaar" placeholder="XXXX-XXXX-XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" placeholder="+91 XXXXXXXXXX" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name (as per Aadhaar)</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step-2">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-950/30 rounded-lg border border-blue-900/50 flex items-start gap-4">
                    <Fingerprint className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-300">Decentralized Identifier (DID)</h4>
                      <p className="text-sm text-blue-400 mt-1">
                        Your DID is a unique identifier that gives you control over your digital identity without
                        relying on any central authority.
                      </p>
                    </div>
                  </div>

                  {didCreated ? (
                    <div className="p-4 bg-green-950/30 rounded-lg border border-green-900/50">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">DID Successfully Created!</span>
                      </div>
                      <code className="block p-2 bg-background/50 rounded border border-green-900/50 text-sm overflow-x-auto">
                        did:ethr:0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf
                      </code>
                      <p className="text-sm text-green-400 mt-2">
                        Your DID has been created and linked to your Aadhaar identity via Aarogya Rakshak blockchain workflow.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <Fingerprint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Complete the previous step to generate your DID</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="step-3">
                <div className="space-y-6">
                  <div className="p-4 bg-orange-950/30 rounded-lg border border-orange-900/50 flex items-start gap-4">
                    <Wallet className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-orange-300">Soulbound Health Passport NFT</h4>
                      <p className="text-sm text-orange-400 mt-1">
                        Your Health Passport is a non-transferable (soulbound) NFT that securely stores references to
                        your health records.
                      </p>
                    </div>
                  </div>

                  {nftMinted ? (
                    <div className="p-4 bg-green-950/30 rounded-lg border border-green-900/50">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Health Passport NFT Minted!</span>
                      </div>
                      <div className="bg-background/50 p-4 rounded-lg border border-green-900/50 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-xl">HX</span>
                        </div>
                        <span className="text-sm font-medium">HealthX Passport #12345</span>
                        <span className="text-xs text-muted-foreground">Minted: Just now</span>
                      </div>
                      <p className="text-sm text-green-400 mt-2">
                        Your Health Passport is now ready to use. You can access it from your dashboard.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Complete the previous steps to mint your Health Passport NFT
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1 || loading}>
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={loading || (step === 3 && nftMinted)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? "Processing..." : step === 3 && nftMinted ? "Completed" : "Next"}
              {!loading && step < 3 && !nftMinted && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-8 p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50">
          <h4 className="font-medium mb-2">Backend Simulation</h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Aarogya Rakshak blockchain workflow for identity verification and DID creation</p>
            <p>• Secure blockchain storage for off-chain data</p>
            <p>• Hyperledger Fabric for consent ledger</p>
            <p>• Blockchain for consent ledger initialization</p>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database, Github, Linkedin, Twitter } from "lucide-react"

export function StatusFooter() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-green-500 mr-3 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h3 className="font-bold text-xl">Aarogya Rakshak</h3>
              <p className="text-sm text-muted-foreground">Decentralized Health, Centralized Trust</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-950/30 text-green-400 px-3 py-1 rounded-full text-xs border border-green-900/50">
              <CheckCircle className="h-3 w-3" />
              <span>Blocks Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-green-950/30 text-green-400 px-3 py-1 rounded-full text-xs border border-green-900/50">
              <CheckCircle className="h-3 w-3" />
              <span>Consent Ledger OK</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-950/30 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-900/50">
              <Database className="h-3 w-3" />
              <span>Blockchain: OK</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-medium mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollToSection("hero")} className="text-muted-foreground hover:text-foreground">
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("onboarding")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("medical-records")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("interoperability")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Roadmap
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-muted-foreground hover:text-foreground">Documentation</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">API Reference</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Developer Guide</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Community</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-muted-foreground hover:text-foreground">Privacy Policy</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Terms of Service</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Data Protection</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Compliance</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-muted-foreground hover:text-foreground">Contact Us</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Support</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Partners</button>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-foreground">Careers</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2023 HealthX Passport. All rights reserved.
          </div>

          <div className="flex gap-6">
            <button className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </button>
            <button className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            "Hyperledger",
            "Blockchain",
            "Ethereum",
            "Polygon",
            "IPFS",
            "Zero Knowledge",
            "Aarogya Rakshak",
            "Secure Health",
          ].map((tag) => (
            <Badge key={tag} variant="outline" className="bg-card/30 backdrop-blur-sm border border-border/50">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </footer>
  )
}

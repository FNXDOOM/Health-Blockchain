"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const [currentUser, setCurrentUser] = useState(0)
  const users = ["Sreejith", "Nareah", "Rohan", "Bhuvan"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser((prev) => (prev + 1) % users.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden py-12 md:py-24">
      {/* Background animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[800px] h-[800px] rounded-full border-4 border-orange-500/30 animate-[spin_60s_linear_infinite]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] rounded-full border-4 border-green-500/30 animate-[spin_40s_linear_infinite_reverse]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] rounded-full border-4 border-blue-500/30 animate-[spin_30s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-orange-500 h-2 w-2 rounded-full"></div>
            <div className="bg-white h-2 w-2 rounded-full"></div>
            <div className="bg-green-500 h-2 w-2 rounded-full"></div>
            <span className="ml-2 text-sm font-medium text-muted-foreground">Blockchain Technology</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-white to-green-500">
            Own Your Health. Powered by Blockchain. Aarogya Rakshak.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
            Give every Indian citizen secure, tamper-proof, portable control over their health history.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              onClick={() => scrollToSection("onboarding")}
            >
              Get My Aarogya Rakshak Passport
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-500 hover:bg-green-900/20"
              onClick={() => scrollToSection("doctor-access")}
            >
              Doctor Login Portal
            </Button>
          </div>

          <div className="mt-12 h-8 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key={currentUser}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground"
            >
              {users[currentUser]} just created their Aarogya Rakshak Passport
            </motion.div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            {["Hyperledger", "Blockchain", "Ethereum", "Polygon"].map((tech) => (
              <div
                key={tech}
                className="flex items-center justify-center px-4 py-2 bg-card/30 backdrop-blur-sm rounded-lg border border-border/50"
              >
                <span className="text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

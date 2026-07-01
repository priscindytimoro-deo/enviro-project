"use client"

import React from 'react'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { FeaturesSection } from './components/features-section'
import { FaqSection } from './components/faq-section'
import { LandingFooter } from './components/footer'
import FloatingActions from "./components/floating-actions";
// import VisitorTracker from "./components/visitor-tracker";
// import { StatisticsSection } from "./components/statistics-section"

export function LandingPageContent() {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNavbar />
      {/* <VisitorTracker /> */}

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <FaqSection />
        {/* <StatisticsSection /> */}
      </main>
      <FloatingActions />
      {/* Footer */}
      <LandingFooter />
    </div>
  )
}

"use client"

import React from 'react'
import { LandingNavbar } from './components/navbar'
import { HeroSection } from './components/hero-section'
import { FeaturesSection } from './components/features-section'
import { FaqSection } from './components/faq-section'
import { LandingFooter } from './components/footer'
import FloatingActions from "./components/floating-actions";
import { StatsSection } from "./components/stats-section";
import VisitorTracker from "./components/visitor-tracker"
import { FeedbackSection } from "./components/feedback-section"

export function LandingPageContent() {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <VisitorTracker />
      <LandingNavbar />

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <FaqSection />
      </main>
      <FloatingActions />
      <StatsSection />
      <FeedbackSection />
      <LandingFooter />
    </div>
  )
}

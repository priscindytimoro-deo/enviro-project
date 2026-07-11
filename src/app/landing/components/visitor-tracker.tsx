"use client"

import { useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase-client"

export default function VisitorTracker() {
  useEffect(() => {
    trackVisitor()
  }, [])

  async function trackVisitor() {
    let visitorId = localStorage.getItem("visitor_id")

    if (!visitorId) {
      visitorId = uuidv4()
      localStorage.setItem("visitor_id", visitorId)
    }

    const today = new Date().toISOString().split("T")[0]

    const lastVisit = localStorage.getItem("last_visit")

    if (lastVisit === today) return

    const { error } = await supabase
      .from("landing_visitors")
      .insert({
        visitor_id: visitorId,
      })

    if (!error) {
      localStorage.setItem("last_visit", today)
    }
  }

  return null
}
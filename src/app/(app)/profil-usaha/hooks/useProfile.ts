"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useProfile() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        setLoading(false)
        return
      }

      setUser(auth.user)

      const { data } = await supabase
        .from("usaha_profile")
        .select("*")
        .eq("user_id", auth.user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    load()
  }, [])

  return { user, profile, loading }
}
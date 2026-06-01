"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useUsaha() {
  const [usahaList, setUsahaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()
        if (!auth.user) return

        const { data: profile } = await supabase
          .from("usaha_profile")
          .select("id")
          .eq("user_id", auth.user.id)
          .single()

        if (!profile) return

        const { data, error } = await supabase
          .from("usaha_kegiatan")
          .select("*")
          .eq("profile_id", profile.id)

        if (error) throw error

        setUsahaList(data || [])
      } catch (err) {
        console.error("useUsaha error:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { usahaList, loading }
}
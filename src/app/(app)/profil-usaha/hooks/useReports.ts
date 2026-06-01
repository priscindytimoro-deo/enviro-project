"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useReports(userId?: string) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("reports")
          .select(`
            *,
            usaha_kegiatan:usaha_kegiatan_id (
              jenis_usaha_kegiatan,
              kbli
            )
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error

        setReports(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userId])

  return { reports, setReports, loading }
}
"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RiwayatTab() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return

      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", auth.user.id)

      setData(data || [])
    }

    load()
  }, [])

  return (
    <div className="space-y-2">
      {data.map((r) => (
        <div key={r.id} className="border p-2 rounded">
          {r.jenis_dokumen} - {r.status_verifikasi}
        </div>
      ))}
    </div>
  )
}
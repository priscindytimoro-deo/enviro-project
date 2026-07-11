"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { MonitorTable } from "./components/data-table"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface KabidMonitor {
  id: string

  namaUsaha: string
  jenisKegiatan: string
  alamatUsaha: string

  waktuLapor: string
  periodePelaporan: string

  report_stage: string
  jadwal_pengawasan: string | null
}

export default function KabidMonitorPage() {
  const [data, setData] = useState<KabidMonitor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const [reportsRes, profileRes, kegiatanRes] = await Promise.all([
      supabase.from("reports").select("*"),
      supabase.from("usaha_profile").select("*"),
      supabase.from("usaha_kegiatan").select("*"),
    ])

    const reports = reportsRes.data ?? []
    const profiles = profileRes.data ?? []
    const kegiatan = kegiatanRes.data ?? []

    const profileMap = new Map(profiles.map((p: any) => [p.id, p]))
    const kegiatanMap = new Map(kegiatan.map((k: any) => [k.id, k]))

    const result: KabidMonitor[] = reports
      .filter((r: any) =>
        ["pengawas_review", "pengawasan_dijadwalkan", "selesai"].includes(r.report_stage)
      )
      .map((r: any) => {
        const keg = kegiatanMap.get(r.usaha_kegiatan_id)
        const prof = keg ? profileMap.get(keg.profile_id) : null

        return {
          id: r.id,

          namaUsaha: prof
            ? `${prof.bentuk_badan_usaha} ${prof.nama_usaha_instansi}`
            : "-",

          jenisKegiatan: keg
            ? `${keg.jenis_usaha_kegiatan} - ${keg.deskripsi_kegiatan}`
            : "-",

          alamatUsaha: keg?.alamat_usaha_kegiatan ?? "-",

          waktuLapor: r.created_at ?? "-",
          periodePelaporan: r.periode_pelaporan ?? "-",

          report_stage: r.report_stage ?? "-",
          jadwal_pengawasan: r.jadwal_pengawasan ?? null,
        }
      })

    setData(result)
    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return <MonitorTable data={data} />
}
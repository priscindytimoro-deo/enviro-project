"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import { StatsCard } from "./components/stats-card"
import { LatestKabidTable } from "./components/latest-kabid-table"
import { MonitorKabidTable } from "./components/monitor-kabid-table"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface KabidDashboardReport {
  id: string

  namaUsaha: string
  jenisKegiatan: string
  alamatUsaha: string

  waktuLapor: string
  periodePelaporan: string

  report_stage: string
  jadwal_pengawasan: string | null
}

export default function KabidDashboardPage() {
  const [loading, setLoading] = useState(true)

  const [jumlahLaporan, setJumlahLaporan] = useState(0)

  const [laporanKabid, setLaporanKabid] = useState<KabidDashboardReport[]>([])
  const [monitor, setMonitor] = useState<KabidDashboardReport[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)

    const [reportsRes, profileRes, kegiatanRes] = await Promise.all([
      supabase.from("reports").select("*"),
      supabase.from("usaha_profile").select("*"),
      supabase.from("usaha_kegiatan").select("*"),
    ])

    const reports = reportsRes.data ?? []
    const profiles = profileRes.data ?? []
    const kegiatan = kegiatanRes.data ?? []

    setJumlahLaporan(reports.length)

    const profileMap = new Map(profiles.map((p: any) => [p.id, p]))
    const kegiatanMap = new Map(kegiatan.map((k: any) => [k.id, k]))

    const mapped: KabidDashboardReport[] = reports.map((r: any) => {
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

    // =========================
    // KABID INBOX
    // =========================
    setLaporanKabid(
      mapped
        .filter((x) => x.report_stage === "kabid_review")
        .slice(0, 5)
    )

    // =========================
    // MONITOR LANJUTAN
    // =========================
    setMonitor(
      mapped
        .filter((x) =>
          ["pengawas_review", "admin_final_review"].includes(
            x.report_stage
          )
        )
        .slice(0, 5)
    )

    setLoading(false)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">

      {/* OPTIONAL: stats sederhana */}
      <StatsCard
        totalLaporan={jumlahLaporan}
        masuk={laporanKabid.length}
        proses={monitor.length}
      />

      {/* Laporan masuk Kabid */}
      <LatestKabidTable data={laporanKabid} />

      {/* Monitor lanjutan */}
      <MonitorKabidTable data={monitor} />

    </div>
  )
}
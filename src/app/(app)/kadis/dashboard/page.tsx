"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { StatsCard } from "./components/stats-card"
import { LatestReportTable } from "./components/latest-report-table"
import { MonitorTable } from "./components/monitor-table"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface DashboardReport {
  id: string

  namaUsaha: string
  jenisKegiatan: string
  alamatUsaha: string

  linkDokumen: string

  waktuLapor: string
  periodePelaporan: string

  report_stage: string

  catatan_review: string | Record<string, unknown> | null

  jadwal_pengawasan: string | null
}

export default function KadisDashboardPage() {
  const [loading, setLoading] = useState(true)

  const [jumlahUser, setJumlahUser] = useState(0)
  const [jumlahUsaha, setJumlahUsaha] = useState(0)
  const [jumlahLaporan, setJumlahLaporan] = useState(0)

  const [laporanBaru, setLaporanBaru] =
    useState<DashboardReport[]>([])

  const [monitor, setMonitor] =
    useState<DashboardReport[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)

    const [
      profilesRes,
      kegiatanRes,
      reportsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("usaha_kegiatan").select("*"),
      supabase.from("reports").select("*"),
    ])

    const profiles = profilesRes.data ?? []
    const kegiatan = kegiatanRes.data ?? []
    const reports = reportsRes.data ?? []

    setJumlahUser(profiles.length)
    setJumlahUsaha(kegiatan.length)
    setJumlahLaporan(reports.length)

    const profileMap = new Map()

    profiles.forEach((item: any) => {
      profileMap.set(item.id, item)
    })

    const kegiatanMap = new Map()

    kegiatan.forEach((item: any) => {
      kegiatanMap.set(item.id, item)
    })

    const laporan = reports.map((r: any) => {
      const keg = kegiatanMap.get(r.usaha_kegiatan_id)

      const profile = keg
        ? profileMap.get(keg.profile_id)
        : null

      return {
        id: r.id,

        namaUsaha: profile
          ? `${profile.bentuk_badan_usaha} ${profile.nama_usaha_instansi}`
          : "-",

        jenisKegiatan: keg
          ? `${keg.jenis_usaha_kegiatan} - ${keg.deskripsi_kegiatan}`
          : "-",

        alamatUsaha: keg
          ? `${keg.alamat_usaha_kegiatan ?? "-"}`
          : "-",

        linkDokumen: r.link_dokumen ?? "#",

        waktuLapor: r.created_at,

        periodePelaporan: r.periode_pelaporan,

        report_stage: r.report_stage,

        catatan_review: r.catatan_review ?? null,

        jadwal_pengawasan: r.jadwal_pengawasan,
      }
    })

    setLaporanBaru(
      laporan
        .filter(
          (x) =>
            x.report_stage ===
            "kadis_review"
        )
        .slice(0, 5)
    )

    setMonitor(
      laporan
        .filter((x) =>
          [
            "kabid_review",
            "pengawas_review",
            "admin_final_review",
          ].includes(x.report_stage)
        )
        .slice(0, 5)
    )

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StatsCard
        users={jumlahUser}
        usaha={jumlahUsaha}
        laporan={jumlahLaporan}
      />
      <LatestReportTable
        data={laporanBaru}
      />
      <MonitorTable
        data={monitor}
      />

    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { DataTable } from "./components/data-table"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Laporan {
  id: string

  namaUsaha: string
  jenisKegiatan: string
  alamatUsaha: string

  waktuLapor: string
  periodePelaporan: string

  report_stage: string
  jadwal_pengawasan: string | null
}

export default function KadisMonitorPage() {
  const [data, setData] = useState<Laporan[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const fetchData = async () => {
    setLoading(true)

    const [reportsRes, profileRes, kegiatanRes] = await Promise.all([
      supabase
        .from("reports")
        .select("*")
        .in("report_stage", [
          "kadis_review",
          "kabid_review",
          "pengawas_review",
          "pengawasan_dijadwalkan",
          "laporan_disetujui",
          "done",
        ])
        .order("created_at", { ascending: false }),

      supabase.from("usaha_profile").select("*"),
      supabase.from("usaha_kegiatan").select("*"),
    ])

    const reports = reportsRes.data ?? []
    const profiles = profileRes.data ?? []
    const kegiatan = kegiatanRes.data ?? []

    const profileMap = new Map(profiles.map((p: any) => [p.id, p]))
    const kegiatanMap = new Map(kegiatan.map((k: any) => [k.id, k]))

    const result: Laporan[] = reports.map((r: any) => {
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

  useEffect(() => {
    fetchData()
  }, [])

const handleNextStage = async (id: string, action?: string, payload?: any) => {
  const report = data.find((r) => r.id === id)
  if (!report) return

  // =========================
  // KADIS → KABID
  // =========================
  if (report.report_stage === "kadis_review") {
    if (!payload?.catatan) return alert("Catatan wajib diisi")

    await supabase.from("reports").update({
      report_stage: "kabid_review",
      catatan_review: `[KADIS] ${payload.catatan}`,
    }).eq("id", id)
  }

  // =========================
  // KABID → PENGAWAS
  // =========================
  if (report.report_stage === "kabid_review") {
    if (!payload?.catatan) return alert("Catatan wajib diisi")

    await supabase.from("reports").update({
      report_stage: "pengawas_review",
      catatan_review: `[KABID] ${payload.catatan}`,
    }).eq("id", id)
  }

  // =========================
  // PENGAWAS ACTION
  // =========================
  if (report.report_stage === "pengawas_review") {
    if (action === "jadwal") {
      if (!payload?.tanggal) return alert("Tanggal wajib diisi")
      if (!payload?.catatan) return alert("Catatan wajib diisi")

      await supabase.from("reports").update({
        report_stage: "pengawasan_dijadwalkan",
        jadwal_pengawasan: payload.tanggal,
        catatan_review: `[PENGAWAS - JADWAL] ${payload.catatan}`,
      }).eq("id", id)
    }

    if (action === "approve") {
      if (!payload?.catatan) return alert("Catatan wajib diisi")

      await supabase.from("reports").update({
        report_stage: "laporan_disetujui",
        catatan_review: `[PENGAWAS - APPROVE] ${payload.catatan}`,
      }).eq("id", id)
    }
    
  }

  fetchData()
}

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <DataTable
      data={data}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      onNextStage={handleNextStage}
    />
  )
}
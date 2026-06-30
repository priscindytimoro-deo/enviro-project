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

  jenisDokumen: string
  nomorDokumen: string
  tanggalTerbit: string
  linkDokumen: string

  waktuLapor: string
  periodePelaporan: string

  statusUser: string
  catatan_verifikasi: string

  report_stage: string
  catatan_review: string
}

export default function ReportPage() {
  const [reports, setReports] = useState<Laporan[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    setLoading(true)

    const [reportsRes, profileRes, kegiatanRes] = await Promise.all([
      supabase
        .from("reports")
        .select("*")
        .eq("report_stage", "admin_review") // ⭐ FILTER UTAMA
        .order("created_at", { ascending: false }),

      supabase.from("usaha_profile").select("*"),
      supabase.from("usaha_kegiatan").select("*"),
    ])

    const reportsData = reportsRes.data ?? []
    const profileData = profileRes.data ?? []
    const kegiatanData = kegiatanRes.data ?? []

    const profileMap = new Map(profileData.map((p: any) => [p.id, p]))
    const kegiatanMap = new Map(kegiatanData.map((k: any) => [k.id, k]))

    const hasil: Laporan[] = reportsData.map((report: any) => {
      const kegiatan = kegiatanMap.get(report.usaha_kegiatan_id)
      const profile = kegiatan
        ? profileMap.get(kegiatan.profile_id)
        : null

      return {
        id: report.id,

        namaUsaha: profile
          ? `${profile.bentuk_badan_usaha} ${profile.nama_usaha_instansi}`
          : "-",

        jenisKegiatan: kegiatan
          ? `${kegiatan.jenis_usaha_kegiatan} - ${kegiatan.deskripsi_kegiatan}`
          : "-",

        alamatUsaha: kegiatan
          ? `${kegiatan.alamat_usaha_kegiatan ?? "-"}`
          : "-",

        jenisDokumen: report.jenis_dokumen ?? "-",
        nomorDokumen: report.nomor_dokumen ?? "-",
        tanggalTerbit: report.tanggal_terbit ?? "-",
        linkDokumen: report.link_dokumen ?? "#",

        waktuLapor: report.created_at ?? "-",
        periodePelaporan: report.periode_pelaporan ?? "-",

        statusUser: report.status_verifikasi ?? "-",
        catatan_verifikasi: report.catatan_verifikasi ?? "-",

        report_stage: report.report_stage ?? "admin_review",
        catatan_review: report.catatan_review ?? "-",
      }
    })

    setReports(hasil)
    setLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleNextStage = async (id: string) => {
    const flow: Record<string, string> = {
      admin_review: "kadis_review",
    }

    await supabase
      .from("reports")
      .update({
        report_stage: flow["admin_review"],
      })
      .eq("id", id)

    fetchReports()
  }

  const handleDelete = async (id: string) => {
    const ok = confirm("Hapus laporan?")
    if (!ok) return

    await supabase.from("reports").delete().eq("id", id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        Laporan Admin Review
      </h1>

      <DataTable
        data={reports}
        onNextStage={handleNextStage}
        onDelete={handleDelete}
        onRefresh={fetchReports}
      />

    </div>
  )
}
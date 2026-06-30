"use client"

import { useEffect, useState, useCallback } from "react"
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
  catatan_review: string

  report_stage: string
}

export default function KadisPage() {
  const [data, setData] = useState<Laporan[]>([])
  const [loading, setLoading] = useState(true)

  const normalizeCatatan = (val: any) => {
    if (!val) return "-"

    if (typeof val === "string") return val

    if (typeof val === "object") {
      return val.catatan ?? "-"
    }

    return "-"
  }

  const fetchData = useCallback(async () => {
    setLoading(true)

    const { data: session } = await supabase.auth.getUser()
    if (!session.user) return

    const [reportsRes, profileRes, kegiatanRes] = await Promise.all([
      supabase
        .from("reports")
        .select("*")
        .eq("report_stage", "kadis_review")
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

        jenisDokumen: r.jenis_dokumen ?? "-",
        nomorDokumen: r.nomor_dokumen ?? "-",
        tanggalTerbit: r.tanggal_terbit ?? "-",
        linkDokumen: r.link_dokumen ?? "#",

        waktuLapor: r.created_at ?? "-",
        periodePelaporan: r.periode_pelaporan ?? "-",

        statusUser: r.status_verifikasi ?? "-",
        catatan_review: r.catatan_review ?? "-",

        report_stage: r.report_stage ?? "-",
      }
    })

    setData(result)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleNextStage = async (id: string, catatan: string) => {
    if (!catatan.trim()) {
      alert("Catatan wajib diisi")
      return
    }

    const { error } = await supabase
      .from("reports")
      .update({
        report_stage: "kabid_review",
        catatan_review: catatan,
      })
      .eq("id", id)

    if (error) {
      alert("Gagal kirim ke Kabid")
      return
    }

    alert("Berhasil dikirim ke Kabid")
    fetchData()
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <DataTable
      data={data}
      onNextStage={handleNextStage}
    />
  )
}
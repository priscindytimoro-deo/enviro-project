"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================
// SUPABASE
// ============================
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ============================
// TYPE
// ============================
interface UsahaKegiatan {
  id: string
  profile_id: string
  jenis_usaha_kegiatan: string
  deskripsi_kegiatan: string
  kbli: string
  koordinat_lokasi: string
}

export default function BuatLaporanPage() {
  const router = useRouter()

  const [selectedUsahaId, setSelectedUsahaId] = useState("")
  const [usahaList, setUsahaList] = useState<UsahaKegiatan[]>([])
  const [reports, setReports] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    jenisUsaha: "",
    deskripsi: "",
    kbli: "",
    koordinat: "",
    jenisDokumen: "",
    tanggalTerbit: "",
    nomorDokumen: "",
    linkDokumen: "",
  })

  // ============================
  // LOAD DATA
  // ============================
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        setLoading(false)
        return
      }

      // usaha profile
      const { data: profile } = await supabase
        .from("usaha_profile")
        .select("id")
        .eq("user_id", auth.user.id)
        .single()

      if (!profile) {
        setLoading(false)
        return
      }

      // usaha kegiatan
      const { data: usaha } = await supabase
        .from("usaha_kegiatan")
        .select("*")
        .eq("profile_id", profile.id)

      setUsahaList(usaha || [])

      // reports + join usaha
      const { data: reportData } = await supabase
        .from("reports")
        .select(`
          id,
          jenis_dokumen,
          status_verifikasi,
          created_at,
          usaha_kegiatan:usaha_kegiatan_id (
            jenis_usaha_kegiatan,
            kbli
          )
        `)
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })

      setReports(reportData || [])
      setLoading(false)
    }

    load()
  }, [])

  // ============================
  // SELECT USAHA
  // ============================
  const handleSelectUsaha = (id: string) => {
    setSelectedUsahaId(id)

    const usaha = usahaList.find((u) => u.id === id)
    if (!usaha) return

    setForm((prev) => ({
      ...prev,
      jenisUsaha: usaha.jenis_usaha_kegiatan,
      deskripsi: usaha.deskripsi_kegiatan,
      kbli: usaha.kbli,
      koordinat: usaha.koordinat_lokasi,
    }))
  }

  // ============================
  // NOMOR DOKUMEN VALIDATION
  // ============================
  const handleNomorDokumenChange = (value: string) => {
    let clean = value.toUpperCase()
    clean = clean.replace(/[^A-Z0-9/.]/g, "")

    if (clean.length <= 21) {
      setForm((prev) => ({
        ...prev,
        nomorDokumen: clean,
      }))
    }
  }

  // ============================
  // VALIDASI
  // ============================
  const validateForm = () => {
    if (!selectedUsahaId) return "Pilih usaha"
    if (!form.jenisDokumen) return "Jenis dokumen wajib"
    if (!form.tanggalTerbit) return "Tanggal wajib"
    if (!form.nomorDokumen) return "Nomor wajib"
    if (!form.linkDokumen) return "Link wajib"
    return null
  }

  // ============================
  // SUBMIT
  // ============================
  const handleSubmit = async () => {
    const err = validateForm()
    if (err) return alert(err)

    setSubmitLoading(true)

    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return

    const { error } = await supabase.from("reports").insert({
      user_id: auth.user.id,
      usaha_kegiatan_id: selectedUsahaId,
      jenis_dokumen: form.jenisDokumen,
      tanggal_terbit: form.tanggalTerbit,
      nomor_dokumen: form.nomorDokumen,
      link_dokumen: form.linkDokumen,
      status_verifikasi: "Dalam Proses",
      catatan_verifikasi: null,
      verified_by: null,
    })

    setSubmitLoading(false)

    if (error) {
      console.error(error)
      return alert("Gagal menyimpan laporan")
    }

    alert("Laporan berhasil dikirim")
    router.push("/cek-laporan")
  }

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Memuat data...
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Buat Laporan
        </h1>
        <p className="text-muted-foreground">
          Input laporan usaha
        </p>
      </div>

      {/* PILIH USAHA */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Usaha</CardTitle>
        </CardHeader>

        <CardContent>
          <Select onValueChange={handleSelectUsaha}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih usaha" />
            </SelectTrigger>

            <SelectContent>
              {usahaList.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.jenis_usaha_kegiatan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* FORM */}
      {selectedUsahaId && (
        <Card>
          <CardHeader>
            <CardTitle>Form Laporan</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <Input value={form.jenisUsaha} disabled />
            <Input value={form.deskripsi} disabled />
            <Input value={form.kbli} disabled />
            <Input value={form.koordinat} disabled />

            <Select
              onValueChange={(v) =>
                setForm((p) => ({ ...p, jenisDokumen: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis Dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPPL">SPPL</SelectItem>
                <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  tanggalTerbit: e.target.value,
                }))
              }
            />

            <Input
              value={form.nomorDokumen}
              onChange={(e) =>
                handleNomorDokumenChange(e.target.value)
              }
              maxLength={21}
              placeholder="DLH.01/2024"
            />

            <Input
              placeholder="Link dokumen"
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  linkDokumen: e.target.value,
                }))
              }
            />

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? "Menyimpan..." : "Submit"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* TABLE REPORT */}
      <Card>
        <CardHeader>
          <CardTitle>Laporan Anda</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th>Usaha</th>
                <th>KBLI</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b">
                  <td>{r.usaha_kegiatan?.jenis_usaha_kegiatan}</td>
                  <td>{r.usaha_kegiatan?.kbli}</td>
                  <td>{r.jenis_dokumen}</td>
                  <td>{r.status_verifikasi}</td>
                  <td>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  )
}
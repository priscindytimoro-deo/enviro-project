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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  koordinat_lokasi: string | null
}

interface UsahaProfile {
  id: string
  nib: string | null
}


export default function BuatLaporanPage() {
  const router = useRouter()

  const [selectedUsahaId, setSelectedUsahaId] = useState("")
  const [usahaList, setUsahaList] = useState<UsahaKegiatan[]>([])
  const [reports, setReports] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [nib, setNib] = useState("")
  const [loadingPage, setLoadingPage] = useState(true)
  const [profileReady, setProfileReady] = useState(false)
  const [usahaReady, setUsahaReady] = useState(false)
  const [profile, setProfile] = useState<UsahaProfile | null>(null)

  const [editErrors, setEditErrors] = useState<any>({})

  const validateEdit = () => {
  const err: any = {}
  let valid = true

    if (!editForm.jenisDokumen) {
      err.jenisDokumen = "Wajib dipilih"
      valid = false
    }

    if (!editForm.instansiPenerbit) {
      err.instansiPenerbit = "Wajib dipilih"
      valid = false
    }

    if (!editForm.tanggalTerbit) {
      err.tanggalTerbit = "Wajib diisi"
      valid = false
    }

    if (!editForm.periodePelaporan) {
      err.periodePelaporan = "Wajib dipilih"
      valid = false
    }

    if (!editForm.linkDokumen) {
      err.linkDokumen = "Wajib diisi"
      valid = false
    }

    // DLH validation
    if (editForm.instansiPenerbit === "DLH") {
      if (!editForm.nomorDokumen) {
        err.nomorDokumen = "Nomor dokumen wajib diisi"
        valid = false
      } else if (editForm.nomorDokumen.length < 18) {
        err.nomorDokumen =
          "Nomor dokumen minimal 18 karakter"
        valid = false
      } else if (
        !editForm.nomorDokumen.includes("/") ||
        !editForm.nomorDokumen.includes(".")
      ) {
        err.nomorDokumen =
          "Nomor dokumen harus mengandung '/' dan '.'"
        valid = false
      }
    }

    setEditErrors(err)
    return valid
  }

  const handleEditNomorDokumenChange = (value: string) => {
    let clean = value.toUpperCase()
    clean = clean.replace(/[^A-Z0-9/.]/g, "")

    if (clean.length <= 21) {
      setEditForm((prev: any) => ({
        ...prev,
        nomorDokumen: clean,
      }))
    }
  }

  const [form, setForm] = useState({
    jenisUsaha: "",
    deskripsi: "",
    kbli: "",
    koordinat: "",
    jenisDokumen: "",
    instansiPenerbit: "",
    tanggalTerbit: "",
    nomorDokumen: "",
    periodePelaporan: "",
    linkDokumen: "",
  })

  const [errors, setErrors] = useState({
    jenisDokumen: "",
    instansiPenerbit: "",
    tanggalTerbit: "",
    nomorDokumen: "",
    periodePelaporan: "",
    linkDokumen: "",
  })

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [editId, setEditId] = useState<string | null>(null)

  const openEditModal = (r: any) => {
    setEditId(r.id)

    setEditForm({
      jenisDokumen: r.jenis_dokumen ?? "",
      instansiPenerbit: r.instansi_penerbit ?? "",
      nomorDokumen: r.nomor_dokumen ?? "",
      periodePelaporan: r.periode_pelaporan ?? "",
      linkDokumen: r.link_dokumen ?? "",
      tanggalTerbit: r.tanggal_terbit ?? "",
    })

    setEditOpen(true)
  }

  const [submitError, setSubmitError] = useState("")

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus draft ini?"
    )

    if (!confirmDelete) return

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id)

      if (error) throw error

      // update UI tanpa reload
      setReports((prev) =>
        prev.filter((r) => r.id !== id)
      )
    } catch (err) {
      console.error(err)
      alert("Gagal menghapus draft")
    }
  }


  const handleSubmitReport = async (id: string) => {
    const confirmSubmit = window.confirm(
      "Ajukan laporan ini?"
    )

    if (!confirmSubmit) return

    try {
      const { error } = await supabase
        .from("reports")
        .update({
          status_verifikasi: "Dalam Proses",
        })
        .eq("id", id)

      if (error) throw error

      // update UI langsung
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status_verifikasi: "Dalam Proses" }
            : r
        )
      )
    } catch (err) {
      console.error(err)
      alert("Gagal submit laporan")
    }
  }

// LOAD REPORTS

const loadReports = async (userId: string) => {
  const { data } = await supabase
    .from("reports")
    .select(`
      id,
      jenis_dokumen,
      instansi_penerbit,
      nomor_dokumen,
      tanggal_terbit,
      periode_pelaporan,
      link_dokumen,
      status_verifikasi,
      created_at,
      usaha_kegiatan:usaha_kegiatan_id (
        jenis_usaha_kegiatan,
        kbli
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  setReports(data || [])
}


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

    const userId = auth.user.id

    // =========================
    // PROFILE
    // =========================
    const { data: profileData } = await supabase
      .from("usaha_profile")
      .select("id, nib")
      .eq("user_id", userId)
      .maybeSingle()

    setProfile(profileData)

    // Belum ada profil
    if (!profileData) {
      setLoading(false)
      return
    }

    setNib(profileData.nib || "")

    // =========================
    // USAHA LIST
    // =========================
    const { data: usaha } = await supabase
      .from("usaha_kegiatan")
      .select("*")
      .eq("profile_id", profileData.id)

    setUsahaList(usaha || [])

    // =========================
    // REPORTS
    // =========================
    await loadReports(userId)

    setLoading(false)
  }

  load()
}, [])

  const handleEdit = (report: any) => {
    setEditId(report.id)

    setEditForm({
      jenisDokumen: report.jenis_dokumen ?? "",
      instansiPenerbit: report.instansi_penerbit ?? "",
      nomorDokumen: report.nomor_dokumen ?? "",
      periodePelaporan: report.periode_pelaporan ?? "",
      linkDokumen: report.link_dokumen ?? "",
      tanggalTerbit: report.tanggal_terbit ?? "",
    })

    setEditErrors({})
    setEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!validateEdit()) return

    setSubmitLoading(true)

    try {
      const { error } = await supabase
        .from("reports")
        .update({
          jenis_dokumen: editForm.jenisDokumen,
          instansi_penerbit: editForm.instansiPenerbit,
          nomor_dokumen: editForm.nomorDokumen,
          periode_pelaporan: editForm.periodePelaporan,
          link_dokumen: editForm.linkDokumen,
          tanggal_terbit: editForm.tanggalTerbit,
        })
        .eq("id", editId)

      if (error) throw error

      // refresh data tabel
      const { data: auth } = await supabase.auth.getUser()

      if (auth.user) {
        await loadReports(auth.user.id)
      }

      setEditOpen(false)
      setEditForm(null)
      setEditId(null)

      alert("Data berhasil diupdate")

    } catch (err) {
      console.error(err)
      alert("Gagal update")
    } finally {
      setSubmitLoading(false)
    }
  }

  // ============================
  // SELECT USAHA
  // ============================
  const handleSelectUsaha = (id: string) => {
    setSubmitError("")
    setSelectedUsahaId(id)

    const usaha = usahaList.find((u) => u.id === id)
    if (!usaha) return

    setForm((prev) => ({
      ...prev,
      jenisUsaha: usaha.jenis_usaha_kegiatan,
      deskripsi: usaha.deskripsi_kegiatan,
      kbli: usaha.kbli,
      koordinat: usaha.koordinat_lokasi ?? "",
    }))
  }

  const handleCancel = () => {
    setSelectedUsahaId("")

    setForm({
      jenisUsaha: "",
      deskripsi: "",
      kbli: "",
      koordinat: "",
      jenisDokumen: "",
      instansiPenerbit: "",
      tanggalTerbit: "",
      nomorDokumen: "",
      periodePelaporan: "",
      linkDokumen: "",
    })
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
    const newErrors = {
      jenisDokumen: "",
      tanggalTerbit: "",
      nomorDokumen: "",
      instansiPenerbit: "",
      periodePelaporan: "",
      linkDokumen: "",
    }

    let valid = true

    if (!form.jenisDokumen) {
      newErrors.jenisDokumen =
        "Jenis dokumen wajib dipilih"
      valid = false
    }

    if (!form.instansiPenerbit) {
      newErrors.instansiPenerbit =
        "Instansi penerbit wajib dipilih"
      valid = false
    }

    if (!form.tanggalTerbit) {
      newErrors.tanggalTerbit =
        "Tanggal terbit dokumen wajib diisi"
      valid = false
    }

    if (!form.nomorDokumen) {
      newErrors.nomorDokumen =
        "Nomor dokumen wajib diisi"
      valid = false
    }
    else if (form.instansiPenerbit === "DLH") {

      if (form.nomorDokumen.length < 18) {
        newErrors.nomorDokumen =
          "Nomor dokumen minimal 18 karakter"
        valid = false
      }

      else if (
        !form.nomorDokumen.includes("/") ||
        !form.nomorDokumen.includes(".")
      ) {
        newErrors.nomorDokumen =
          "Nomor dokumen harus mengandung '/' dan '.'"
        valid = false
      }

    }

    if (!form.periodePelaporan) {
      newErrors.periodePelaporan =
        "Periode pelaporan wajib dipilih"
      valid = false
    }
    if (!form.linkDokumen) {
      newErrors.linkDokumen =
        "Link dokumen wajib diisi"
      valid = false
    } else {
      try {
        new URL(form.linkDokumen)
      } catch {
        newErrors.linkDokumen =
          "Format link tidak valid"
        valid = false
      }
    }

    setErrors(newErrors)

    return valid
  }


// ============================
// SIMPAN DRAFT
// ============================
const handleSubmit = async () => {
  const valid = validateForm()

  if (!valid) return

  const confirmed = window.confirm(
    "Apakah Anda yakin data yang dimasukkan sudah sesuai?"
  )

  if (!confirmed) return

  setSubmitLoading(true)

  try {
    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
      alert("Silakan login kembali")
      return
    }

    setSubmitError("")

    const { data: existingReport } = await supabase
      .from("reports")
      .select(`
        id,
        status_verifikasi
      `)
      .eq("usaha_kegiatan_id", selectedUsahaId)
      .maybeSingle()

    if (existingReport) {
      setSubmitError(
        `Usaha/Kegiatan ini sudah memiliki laporan dengan status "${existingReport.status_verifikasi}".`
      )
      return
    }

    const nomorDokumenFinal =
      form.instansiPenerbit === "OSS"
        ? nib
        : form.nomorDokumen

    const { error } = await supabase
      .from("reports")
      .insert({
        user_id: auth.user.id,
        usaha_kegiatan_id: selectedUsahaId,

        jenis_dokumen: form.jenisDokumen,

        instansi_penerbit: form.instansiPenerbit,

        tanggal_terbit: form.tanggalTerbit || null,

        nomor_dokumen:
          form.instansiPenerbit === "OSS"
            ? nib
            : form.nomorDokumen,

        periode_pelaporan: form.periodePelaporan,

        link_dokumen: form.linkDokumen,

        status_verifikasi: "Draft",
        catatan_verifikasi: null,
        verified_by: null,
      })

    if (error) throw error

    alert("Draft berhasil disimpan")

    handleCancel()
    
    await loadReports(auth.user.id)

    // Jika nanti sudah ada fungsi loadReports
    // await loadReports()
  } catch (error) {
    console.error(error)
    alert("Gagal menyimpan draft")
  } finally {
    setSubmitLoading(false)
  }
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

  if (!profile) {
    return (
      <div className="px-4 lg:px-6 py-6">
        <div className="rounded-lg border p-6 text-center space-y-4">

          <h2 className="text-lg font-semibold">
            Profil Belum Lengkap
          </h2>

          <p className="text-muted-foreground">
            Lengkapi profil terlebih dahulu sebelum membuat laporan.
          </p>

          <Button asChild>
            <a href="/profil">
              Lengkapi Profil
            </a>
          </Button>

        </div>
      </div>
    )
  }

  if (usahaList.length === 0) {
    return (
      <div className="px-4 lg:px-6 py-6">
        <div className="rounded-lg border p-6 text-center space-y-4">

          <h2 className="text-lg font-semibold">
            Jenis Usaha/Kegiatan Belum Ada
          </h2>

          <p className="text-muted-foreground">
            Tambahkan minimal satu jenis usaha/kegiatan sebelum membuat laporan.
          </p>

          <Button asChild>
            <a href="/profil-usaha">
              Tambahkan Jenis Usaha/Kegiatan
            </a>
          </Button>

        </div>
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
          <Select
            value={selectedUsahaId}
            onValueChange={handleSelectUsaha}
          >
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

            <Label>Nama Usaha/Kegiatan</Label>
            <Input value={form.jenisUsaha} disabled />
            <Label>Deskripsi Usaha/Kegiatan</Label>
            <Input value={form.deskripsi} disabled />
            <Label>KBLI</Label>
            <Input value={form.kbli} disabled />
            <Label>Koordinat Lokasi Usaha/Kegiatan</Label>
            <Input value={form.koordinat || ""} disabled />
            <Label>Jenis Dokumen</Label>
            <Select
              value={form.jenisDokumen}
              onValueChange={(v) => {
                setForm((p) => ({
                  ...p,
                  jenisDokumen: v,
                }))

                setErrors((prev) => ({
                  ...prev,
                  jenisDokumen: "",
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Jenis Dokumen" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="SPPL">SPPL</SelectItem>
                <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
              </SelectContent>
            </Select>
            <Label>Instansi Penerbit</Label>

            <Select
              value={form.instansiPenerbit}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  instansiPenerbit: v,
                  nomorDokumen:
                    v === "OSS"
                      ? nib
                      : "",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Instansi" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="DLH">
                  DLH Kab. TTS
                </SelectItem>

                <SelectItem value="OSS">
                  OSS
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.instansiPenerbit && (
              <p className="text-sm text-red-500">
                {errors.instansiPenerbit}
              </p>
            )}

            {errors.jenisDokumen && (
              <p className="text-sm text-red-500">
                {errors.jenisDokumen}
              </p>
            )}


            <Label>
              {form.instansiPenerbit === "OSS"
                ? "NIB"
                : "Nomor Dokumen"}
            </Label>

            <Input
              value={form.nomorDokumen ?? ""}
              disabled={form.instansiPenerbit === "OSS"}
              onChange={(e) => {
                if (form.instansiPenerbit === "DLH") {
                  handleNomorDokumenChange(e.target.value)
                }

                setErrors((prev) => ({
                  ...prev,
                  nomorDokumen: "",
                }))
              }}
              maxLength={50}
              placeholder={
                form.instansiPenerbit === "OSS"
                  ? "NIB otomatis dari profil usaha"
                  : "Contoh: BLHD.16.02/1/275/2016"
              }
            />

            {errors.nomorDokumen && (
              <p className="text-sm text-red-500">
                {errors.nomorDokumen}
              </p>
            )}

            <Label>Tanggal Terbit Dokumen</Label>
            <Input
              type="date"
              value={form.tanggalTerbit}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  tanggalTerbit: e.target.value,
                }))

                setErrors((prev) => ({
                  ...prev,
                  tanggalTerbit: "",
                }))
              }}
            />

            {errors.tanggalTerbit && (
              <p className="text-sm text-red-500">
                {errors.tanggalTerbit}
              </p>
            )}

            <Label>Periode Pelaporan</Label>

            <Select
              value={form.periodePelaporan}
              onValueChange={(v) => {
                setForm((p) => ({
                  ...p,
                  periodePelaporan: v,
                }))

                setErrors((prev) => ({
                  ...prev,
                  periodePelaporan: "",
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Periode Pelaporan" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="SEMESTER 1 2026">
                  Semester 1 2026
                </SelectItem>

                <SelectItem value="SEMESTER 2 2026">
                  Semester 2 2026
                </SelectItem>
              </SelectContent>
            </Select>

            {errors.periodePelaporan && (
              <p className="text-sm text-red-500">
                {errors.periodePelaporan}
              </p>
            )}

            <Label>Link Dokumen</Label>
            <Input
              placeholder="Link dokumen"
              value={form.linkDokumen}
              onChange={(e) => {
                setForm((p) => ({
                  ...p,
                  linkDokumen: e.target.value,
                }))

                setErrors((prev) => ({
                  ...prev,
                  linkDokumen: "",
                }))
              }}
            />

            {errors.linkDokumen && (
              <p className="text-sm text-red-500">
                {errors.linkDokumen}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={submitLoading}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="flex-1"
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? "Menyimpan..." : "Simpan Draft"}
              </Button>
            </div>
            <div className="flex gap-2">
              {submitError && (
                <p className="text-sm text-red-500">
                  {submitError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABLE REPORT */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Draft Laporan</CardTitle>
          </CardHeader>

          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>Nama Usaha/Kegiatan</th>
                  <th>Jenis Dokumen</th>
                  <th>Instansi Penerbit</th>
                  <th>Nomor Dokumen</th>
                  <th>Tanggal Terbit</th>
                  <th>Periode Pelaporan</th>
                  <th>Link Dokumen</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b">
                    
                    {/* Nama usaha */}
                    <td>
                      {r.usaha_kegiatan?.jenis_usaha_kegiatan}
                    </td>

                    {/* Jenis dokumen */}
                    <td>{r.jenis_dokumen}</td>

                    {/* Instansi penerbit */}
                    <td>{r.instansi_penerbit ?? "-"}</td>

                    {/* Nomor dokumen */}
                    <td>{r.nomor_dokumen ?? "-"}</td>

                    {/* Tanggal terbit */}
                    <td>
                      {r.tanggal_terbit
                        ? new Date(r.tanggal_terbit).toLocaleDateString("id-ID")
                        : "-"}
                    </td>

                    {/* Periode */}
                    <td>{r.periode_pelaporan ?? "-"}</td>

                    {/* Link */}
                    <td className="truncate max-w-[200px]">
                      {r.link_dokumen ? (
                        <a
                          href={r.link_dokumen}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          Lihat Dokumen
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span
                        className={
                          r.status_verifikasi === "Draft"
                            ? "text-yellow-600 font-medium"
                            : r.status_verifikasi === "Dalam Proses"
                            ? "text-green-600 font-medium"
                            // : r.status_verifikasi === "Ditolak"
                            // ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {r.status_verifikasi || "Draft"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="text-right space-x-2">

                      {/* EDIT / CEK LAPORAN */}
                      {r.status_verifikasi === "Draft" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(r)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/cek-laporan`)}
                        >
                          Cek Laporan
                        </Button>
                      )}

                      {/* DELETE */}
                      {r.status_verifikasi === "Draft" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(r.id)}
                        >
                          Delete
                        </Button>
                      )}

                      {/* SUBMIT */}
                      {r.status_verifikasi === "Draft" && (
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReport(r.id)}
                        >
                          Submit
                        </Button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        <h2 className="text-lg font-bold">Draft Laporan</h2>

        {reports.map((r) => (
          <Card key={r.id}>
            <CardContent className="space-y-2 text-sm">

              <div>
                <p className="text-muted-foreground">Nama Usaha/Kegiatan</p>
                <p className="font-medium">
                  {r.usaha_kegiatan?.jenis_usaha_kegiatan}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Jenis Dokumen</p>
                <p>{r.jenis_dokumen}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Instansi</p>
                <p>{r.instansi_penerbit ?? "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Nomor</p>
                <p>{r.nomor_dokumen ?? "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Tanggal</p>
                <p>
                  {r.tanggal_terbit
                    ? new Date(r.tanggal_terbit).toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Status</p>
                <p>{r.status_verifikasi}</p>
              </div>

              <div className="flex gap-2 pt-2">
                {r.status_verifikasi === "Draft" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(r)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/cek-laporan`)}
                  >
                    Cek
                  </Button>
                )}

                {r.status_verifikasi === "Draft" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(r.id)}
                  >
                    Del
                  </Button>
                )}

                {r.status_verifikasi === "Draft" && (
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReport(r.id)}
                  >
                    Submit
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Draft Laporan</DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4">

              {/* JENIS DOKUMEN */}
              <div>
                <Label>Jenis Dokumen</Label>

                <Select
                  value={editForm.jenisDokumen || ""}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      jenisDokumen: v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Dokumen" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="SPPL">SPPL</SelectItem>
                    <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
                  </SelectContent>
                </Select>
                {editErrors.jenisDokumen && (
                  <p className="text-xs text-red-500">{editErrors.jenisDokumen}</p>
                )}
              </div>

              {/* INSTANSI PENERBIT */}
              <div>
                <Label>Instansi Penerbit</Label>

                <Select
                  value={editForm.instansiPenerbit || ""}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      instansiPenerbit: v,
                      nomorDokumen: v === "OSS" ? nib : "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Instansi Penerbit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DLH">
                      DLH Kab. TTS
                    </SelectItem>

                    <SelectItem value="OSS">
                      OSS
                    </SelectItem>
                  </SelectContent>
                </Select>
                {editErrors.instansiPenerbit && (
                  <p className="text-xs text-red-500">{editErrors.instansiPenerbit}</p>
                )}
              </div>

              {/* NOMOR / NIB */}
              <div>
                <Label>
                  {editForm.instansiPenerbit === "OSS"
                    ? "NIB"
                    : "Nomor Dokumen"}
                </Label>

                <Input
                  value={editForm.nomorDokumen || ""}
                  disabled={editForm.instansiPenerbit === "OSS"}
                  onChange={(e) => {
                    if (editForm.instansiPenerbit === "DLH") {
                      handleEditNomorDokumenChange(e.target.value)
                    }
                  }}
                  placeholder={
                    editForm.instansiPenerbit === "OSS"
                      ? "Auto dari NIB"
                      : "Contoh: BLHD.16.02/1/275/2016"
                  }
                />
                {editErrors.nomorDokumen && (
                  <p className="text-xs text-red-500">{editErrors.nomorDokumen}</p>
                )}
              </div>

              {/* TANGGAL TERBIT */}
              <div>
                <Label>Tanggal Terbit</Label>

                <Input
                  type="date"
                  value={editForm?.tanggalTerbit || ""}   
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tanggalTerbit: e.target.value,
                    })
                  }
                />
                
                {editErrors.tanggalTerbit && (
                  <p className="text-xs text-red-500">{editErrors.tanggalTerbit}</p>
                )}
              </div>

              {/* PERIODE */}
              <div>
                <Label>Periode Pelaporan</Label>

                <Select
                  value={editForm.periodePelaporan || ""}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      periodePelaporan: v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="SEMESTER 1 2026">
                      Semester 1 2026
                    </SelectItem>

                    <SelectItem value="SEMESTER 2 2026">
                      Semester 2 2026
                    </SelectItem>
                  </SelectContent>
                </Select>
                {editErrors.periodePelaporan && (
                  <p className="text-xs text-red-500">{editErrors.periodePelaporan}</p>
                )}
              </div>

              {/* LINK */}
              <div>
                <Label>Link Dokumen</Label>

                <Input
                  value={editForm.linkDokumen || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      linkDokumen: e.target.value,
                    })
                  }
                />
                {editErrors.linkDokumen && (
                  <p className="text-xs text-red-500">{editErrors.linkDokumen}</p>
                )}
              </div>

              {/* BUTTON */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditOpen(false)
                      setEditForm(null)
                      setEditId(null)
                    }}
                  >
                    Batal
                  </Button>

                  <Button
                    className="flex-1"
                    onClick={handleUpdate}
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Menyimpan..." : "Update"}
                  </Button>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
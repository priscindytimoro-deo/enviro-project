"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  FileText,
  Search,
  Eye,
  Download,
} from "lucide-react"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// =========================
// TYPE
// =========================
interface Report {
  id: string
  user_id: string
  usaha_kegiatan_id: string

  jenis_dokumen: string
  instansi_penerbit: string
  tanggal_terbit: string
  nomor_dokumen: string
  link_dokumen: string
  periode_pelaporan: string

  status_verifikasi: string
  catatan_verifikasi: string | null

  created_at?: string

  usaha_kegiatan?: {
    jenis_usaha_kegiatan: string
    deskripsi_kegiatan: string
  }
}

export default function CekLaporanPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [nib, setNib] = useState("")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  const [profile, setProfile] =
    useState<any>(null)

  const [usahaList, setUsahaList] =
    useState<any[]>([])

  const [profileReady, setProfileReady] = useState(false)
  const [usahaReady, setUsahaReady] = useState(false)
  const [reportReady, setReportReady] = useState(false)

  const [editForm, setEditForm] = useState({
    jenisDokumen: "",
    instansiPenerbit: "",
    nomorDokumen: "",
    tanggalTerbit: "",
    linkDokumen: "",
  })
  const [editId, setEditId] = useState<string | null>(null)

  const [editErrors, setEditErrors] = useState<any>({})

  const loadReports = async () => {
    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()

    if (!auth?.user?.id) {
      setNib("")
      setReports([])
      setProfileReady(false)
      setUsahaReady(false)
      setReportReady(false)
      setLoading(false)
      return
    }

  const userId = auth.user.id

  // =====================
  // PROFILE CHECK (FIX HERE)
  // =====================
  const { data: profile } = await supabase
    .from("usaha_profile")
    .select("id, nib")
    .eq("user_id", userId)
    .maybeSingle()

  const hasProfile = !!profile?.id

  setProfileReady(hasProfile)
  setNib(profile?.nib || "")

  if (!hasProfile) {
    setUsahaReady(false)
    setReportReady(false)
    setLoading(false)
    return
  }

  // =====================
  // USAHA CHECK
  // =====================
  const { data: usaha } = await supabase
    .from("usaha_kegiatan")
    .select("*")
    .eq("profile_id", profile.id)

  const hasUsaha = (usaha?.length ?? 0) > 0

  setUsahaReady(hasUsaha)

  if (!hasUsaha) {
    setReportReady(false)
    setLoading(false)
    return
  }

  // =====================
  // REPORT CHECK
  // =====================
  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      *,
      usaha_kegiatan:usaha_kegiatan_id (
        jenis_usaha_kegiatan,
        deskripsi_kegiatan
      )
    `)
    
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    setReports([])
    setReportReady(false)
  } else {
    setReports(reports || [])
    setReportReady((reports?.length ?? 0) > 0)
  }

  setLoading(false)
}

  // handle delete
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

      await loadReports()

      alert("Draft berhasil dihapus")
    } catch (err) {
      console.error(err)
      alert("Gagal menghapus draft")
    }
  }

  // handle submitReport
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
          catatan_verifikasi: null,
        })
        .eq("id", id)

      if (error) throw error

      await loadReports()

      alert("Laporan berhasil diajukan")
    } catch (err) {
      console.error(err)
      alert("Gagal submit laporan")
    }
  }

  // handle update
  const handleUpdate = async () => {
    const err: any = {}
    let valid = true

    if (!editForm?.instansiPenerbit) {
      err.instansiPenerbit = "Instansi wajib dipilih"
      valid = false
    }

    if (editForm.instansiPenerbit === "DLH") {
      if (!editForm.nomorDokumen || editForm.nomorDokumen.trim() === "") {
        err.nomorDokumen = "Nomor dokumen wajib diisi"
        valid = false
      } else if (editForm.nomorDokumen.length < 18) {
        err.nomorDokumen = "Minimal 18 karakter"
        valid = false
      } else if (
        !editForm.nomorDokumen.includes("/") ||
        !editForm.nomorDokumen.includes(".")
      ) {
        err.nomorDokumen = "Format wajib mengandung '/' dan '.'"
        valid = false
      }
    }

    if (!editForm.tanggalTerbit) {
      err.tanggalTerbit = "Tanggal wajib diisi"
      valid = false
    }

    if (!editForm.linkDokumen) {
      err.linkDokumen = "Link wajib diisi"
      valid = false
    }

    setEditErrors(err)

    if (!valid) return

    try {
      const { error } = await supabase
        .from("reports")
        .update({
          jenis_dokumen: editForm.jenisDokumen,
          instansi_penerbit: editForm.instansiPenerbit,
          nomor_dokumen:
            editForm.instansiPenerbit === "OSS"
              ? nib
              : editForm.nomorDokumen,
          tanggal_terbit: editForm.tanggalTerbit,
          link_dokumen: editForm.linkDokumen,
        })
        .eq("id", editId)

      if (error) throw error

      setEditOpen(false)
      setEditForm({
        jenisDokumen: "",
        instansiPenerbit: "",
        nomorDokumen: "",
        tanggalTerbit: "",
        linkDokumen: "",
      })
      setEditId(null)

      setEditErrors({})

      await loadReports()

    } catch (err) {
      console.error(err)
    }
  }

  // handle edit
  const handleEdit = (report: Report) => {
    setEditId(report.id)

    setEditForm({
      jenisDokumen: report.jenis_dokumen ?? "",
      instansiPenerbit: report.instansi_penerbit ?? "",
      nomorDokumen: report.nomor_dokumen ?? "",
      tanggalTerbit: report.tanggal_terbit ?? "",
      linkDokumen: report.link_dokumen ?? "",
    })

    setEditOpen(true)
  }


  // =========================
  // FETCH DATA
  // =========================
 useEffect(() => {
    loadReports()
  }, [])

  // =========================
  // FILTER DATA
  // =========================
  const filtered = reports.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.usaha_kegiatan?.jenis_usaha_kegiatan
        ?.toLowerCase()
        .includes(search.toLowerCase())

    const matchStatus =
      statusFilter === "all"
        ? true
        : item.status_verifikasi?.toLowerCase() === statusFilter

    return matchSearch && matchStatus
  })

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Memuat data laporan...
      </div>
    )
  }

  if (!profileReady) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <h2 className="text-xl font-semibold">
              Profil belum dilengkapi
            </h2>

            <p className="text-muted-foreground">
              Lengkapi profil terlebih dahulu sebelum melihat laporan.
            </p>

            <Button asChild>
              <a href="/profil">
                Lengkapi Profil
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!usahaReady) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <h2 className="text-xl font-semibold">
              Data usaha belum tersedia
            </h2>

            <p className="text-muted-foreground">
              Tambahkan jenis usaha/kegiatan terlebih dahulu.
            </p>

            <Button asChild>
              <a href="/profil-usaha">
                Tambahkan Jenis Usaha/Kegiatan
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!reportReady) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-10 space-y-4">
            <h2 className="text-xl font-semibold">
              Belum ada laporan
            </h2>

            <p className="text-muted-foreground">
              Anda belum membuat laporan pertama.
            </p>

            <Button asChild>
              <a href="/buat-laporan">
                Buat Laporan Sekarang
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Cek Laporan
        </h1>
        <p className="text-muted-foreground">
          Pantau status dan data laporan pelaku usaha
        </p>
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row gap-3">

          <Input
            placeholder="Cari ID / nama usaha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="dalam proses">Dalam Proses</SelectItem>
              <SelectItem value="laporan disetujui">Laporan Disetujui</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="hidden md:block">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Daftar Laporan
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  Nama Usaha/Kegiatan
                </TableHead>

                <TableHead className="text-center">
                  Deskripsi Kegiatan
                </TableHead>

                <TableHead className="text-center">
                  Jenis Dokumen
                </TableHead>
                
                <TableHead className="text-center">
                  Instansi Penerbit
                </TableHead>

                <TableHead className="text-center">
                  Nomor Dokumen
                </TableHead>

                <TableHead className="text-center">
                  Tanggal Terbit Dokumen
                </TableHead>

                <TableHead className="text-center">
                  Link Dokumen
                </TableHead>

                <TableHead className="text-center">
                  Tanggal Submit
                </TableHead>

                <TableHead className="text-center">
                  Periode Pelaporan
                </TableHead>

                <TableHead className="text-center">
                  Status
                </TableHead>

                <TableHead className="text-center">
                  Catatan
                </TableHead>

                <TableHead className="text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>

                  <TableCell className="text-center">
                    {item.usaha_kegiatan?.jenis_usaha_kegiatan || "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.usaha_kegiatan?.deskripsi_kegiatan || "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.jenis_dokumen}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.instansi_penerbit}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.nomor_dokumen}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.tanggal_terbit
                      ? new Date(item.tanggal_terbit)
                          .toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.link_dokumen ? (
                      <a
                        href={item.link_dokumen}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.created_at
                      ? new Date(item.created_at)
                          .toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.periode_pelaporan}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        item.status_verifikasi === "Laporan Disetujui"
                          ? "default"
                          : item.status_verifikasi === "Dalam Proses"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.status_verifikasi}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    {["Draft", "Laporan Disetujui"].includes(item.status_verifikasi)
                      ? item.catatan_verifikasi || "-"
                      : "-"}
                  </TableCell>

                  <TableCell className="text-center">

                  {(item.status_verifikasi === "Draft" ||
                    item.status_verifikasi === "Ditolak") && (
                    <div className="flex gap-2 pt-2">

                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>

                      {item.status_verifikasi === "Draft" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      )}

                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSubmitReport(item.id)}
                      >
                        Submit
                      </Button>

                    </div>
                  )}

                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

        </CardContent>
      </Card>
      </div>
      <div className="md:hidden space-y-3">
        <h2 className="text-lg font-bold">
          Daftar Laporan
        </h2>

        {filtered.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-2 text-sm">

              <div>
                <p className="text-muted-foreground">
                  Nama Usaha/Kegiatan
                </p>
                <p className="font-medium">
                  {item.usaha_kegiatan?.jenis_usaha_kegiatan}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Deskripsi Kegiatan
                </p>
                <p>{item.usaha_kegiatan?.deskripsi_kegiatan}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Jenis Dokumen
                </p>
                <p>{item.jenis_dokumen}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Instansi Penerbit
                </p>
                <p>{item.instansi_penerbit || "-"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Nomor Dokumen
                </p>
                <p>{item.nomor_dokumen}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Tanggal Terbit
                </p>
                <p>
                  {item.tanggal_terbit
                    ? new Date(item.tanggal_terbit)
                        .toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Link Dokumen</p>

                {item.link_dokumen ? (
                  <a
                    href={item.link_dokumen}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Buka Dokumen
                  </a>
                ) : (
                  <p>-</p>
                )}
              </div>

              <div>
                <p className="text-muted-foreground">
                  Tanggal Submit
                </p>
                <p>
                  {item.created_at
                    ? new Date(item.created_at)
                        .toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Periode Pelaporan
                </p>
                <p>{item.periode_pelaporan}</p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  Status
                </p>

                <Badge>
                  {item.status_verifikasi}
                </Badge>
              </div>
              {item.status_verifikasi === "Ditolak" && (
                <div>
                  <p className="text-muted-foreground">
                    Catatan Verifikasi
                  </p>

                  <p className="text-red-600">
                    {item.catatan_verifikasi || "-"}
                  </p>
                </div>
              )}

              {item.status_verifikasi === "Draft" && (
                <div className="flex gap-2 pt-2">

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleSubmitReport(item.id)}
                  >
                    Submit
                  </Button>

                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Edit Draft Laporan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">
                Jenis Dokumen
              </label>

              <Input
                value={editForm.jenisDokumen}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    jenisDokumen: e.target.value,
                  })
                }
              />
              {editErrors.jenisDokumen && (
                <p className="text-xs text-red-500 mt-1">
                  {editErrors.jenisDokumen}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Instansi Penerbit
              </label>

              <Select
                value={editForm.instansiPenerbit}
                onValueChange={(value) => {
                  const oldValue = editForm.instansiPenerbit

                  let nomorDokumen = editForm.nomorDokumen

                  // OSS -> DLH
                  if (oldValue === "OSS" && value === "DLH") {
                    nomorDokumen = ""
                  }

                  // DLH -> OSS
                  if (oldValue === "DLH" && value === "OSS") {
                    nomorDokumen = nib
                  }

                  setEditForm({
                    ...editForm,
                    instansiPenerbit: value,
                    nomorDokumen,
                  })
                }}
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
              {editErrors.instansiPenerbit && (
                <p className="text-xs text-red-500 mt-1">
                  {editErrors.instansiPenerbit}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Nomor Dokumen
              </label>

              <Input
                value={editForm.nomorDokumen}
                disabled={editForm.instansiPenerbit === "OSS"}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    nomorDokumen: e.target.value,
                  })
                }
              />
              {editErrors.nomorDokumen && (
                <p className="text-xs text-red-500 mt-1">
                  {editErrors.nomorDokumen}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Tanggal Terbit
              </label>

              <Input
                type="date"
                value={editForm.tanggalTerbit}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    tanggalTerbit: e.target.value,
                  })
                }
              />
              {editErrors.tanggalTerbit && (
                <p className="text-xs text-red-500 mt-1">
                  {editErrors.tanggalTerbit}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Link Dokumen
              </label>

              <Input
                value={editForm.linkDokumen}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    linkDokumen: e.target.value,
                  })
                }
              />
              {editErrors.linkDokumen && (
                <p className="text-xs text-red-500 mt-1">
                  {editErrors.linkDokumen}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditOpen(false)}
              >
                Batal
              </Button>

              <Button
                className="flex-1"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
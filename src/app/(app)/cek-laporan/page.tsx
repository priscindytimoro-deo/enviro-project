"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  tanggal_terbit: string
  nomor_dokumen: string
  link_dokumen: string
  status_verifikasi: string
  created_at?: string
  usaha_kegiatan?: {
    jenis_usaha_kegiatan: string
    kbli: string
  }
}

export default function CekLaporanPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          usaha_kegiatan:usaha_kegiatan_id (
            jenis_usaha_kegiatan,
            kbli
          )
        `)
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("LOAD ERROR:", error)
      } else {
        setReports(data || [])
      }

      setLoading(false)
    }

    load()
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
              <SelectItem value="dalam proses">Dalam Proses</SelectItem>
              <SelectItem value="terverifikasi">Terverifikasi</SelectItem>
              <SelectItem value="menunggu penjadwalan">
                Menunggu Penjadwalan
              </SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
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
                <TableHead>ID</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>KBLI</TableHead>
                <TableHead>Jenis Dokumen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>

                  <TableCell className="font-medium">
                    {item.id}
                  </TableCell>

                  <TableCell>
                    {item.usaha_kegiatan?.jenis_usaha_kegiatan || "-"}
                  </TableCell>

                  <TableCell>
                    {item.usaha_kegiatan?.kbli || "-"}
                  </TableCell>

                  <TableCell>
                    {item.jenis_dokumen}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        item.status_verifikasi === "terverifikasi"
                          ? "default"
                          : item.status_verifikasi === "dalam proses"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.status_verifikasi}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {item.tanggal_terbit}
                  </TableCell>

                  <TableCell className="flex gap-2">

                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>

                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
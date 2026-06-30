"use client"

import { useState } from "react"
import type { PengawasLaporan } from "../page"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  data: PengawasLaporan[]
  refresh: () => void
}

export function DataTable({ data, refresh }: Props) {
  const [openJadwal, setOpenJadwal] = useState<string | null>(null)
  const [openApprove, setOpenApprove] = useState<string | null>(null)

  const [tanggal, setTanggal] = useState("")
  const [catatan, setCatatan] = useState("")

  // =========================
  // ATUR JADWAL
  // =========================
  const handleJadwal = async (id: string) => {
    if (!tanggal) return alert("Tanggal wajib diisi")

    const { error } = await supabase
      .from("reports")
      .update({
        jadwal_pengawasan: tanggal,
        report_stage: "pengawasan_dijadwalkan",
      })
      .eq("id", id)

    if (error) return alert("Gagal menyimpan jadwal")

    alert("Jadwal berhasil dibuat")
    setOpenJadwal(null)
    setTanggal("")
    refresh()
  }

  // =========================
  // APPROVE
  // =========================
  const handleApprove = async (id: string) => {
    if (!catatan.trim()) {
      alert("Catatan wajib diisi")
      return
    }

    const { error } = await supabase
      .from("reports")
      .update({
        catatan_review: catatan,   // ✅ FIX DI SINI
        report_stage: "laporan_disetujui",
      })
      .eq("id", id)

    if (error) {
      alert("Gagal approve laporan")
      return
    }

    alert("Laporan berhasil disetujui")

    setOpenApprove(null)
    setCatatan("")
    refresh()
  }

  return (
    <div className="border rounded-lg overflow-auto">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Usaha</TableHead>
            <TableHead>Jenis Kegiatan</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Waktu Lapor</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jadwal Pengawasan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>

              <TableCell>{item.namaUsaha}</TableCell>
              <TableCell>{item.jenisKegiatan}</TableCell>
              <TableCell>{item.alamatUsaha}</TableCell>

              <TableCell>
                <a href={item.linkDokumen} className="text-blue-600 underline">
                  Lihat
                </a>
              </TableCell>

              <TableCell>
                {item.waktuLapor !== "-"
                  ? new Date(item.waktuLapor).toLocaleString("id-ID")
                  : "-"}
              </TableCell>

              <TableCell>{item.periodePelaporan}</TableCell>

              <TableCell>
                <Badge>{item.report_stage}</Badge>
              </TableCell>

              <TableCell>
                {item.jadwal_pengawasan
                  ? new Date(item.jadwal_pengawasan).toLocaleString("id-ID")
                  : "-"}
              </TableCell>

              {/* ACTION */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">

                    <DropdownMenuItem onClick={() => setOpenJadwal(item.id)}>
                      Atur Jadwal Pengawasan
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpenApprove(item.id)}>
                      Approve Laporan
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* =========================
          MODAL JADWAL
      ========================= */}
      {openJadwal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[350px] space-y-3">

            <h2 className="font-semibold">Atur Jadwal</h2>

            <input
              type="date"
              className="border p-2 w-full"
              onChange={(e) => setTanggal(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenJadwal(null)}>
                Batal
              </Button>

              <Button onClick={() => handleJadwal(openJadwal)}>
                Simpan
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* =========================
          MODAL APPROVE
      ========================= */}
      {openApprove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[400px] space-y-3">

            <h2 className="font-semibold">Approve Laporan</h2>

            <Textarea
              placeholder="Catatan pengawas"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenApprove(null)}>
                Batal
              </Button>

              <Button onClick={() => handleApprove(openApprove)}>
                Approve
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
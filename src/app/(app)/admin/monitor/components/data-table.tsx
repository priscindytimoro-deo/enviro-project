"use client"

import { useMemo, useState } from "react"
import type { Laporan } from "../page"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"

interface Props {
  data: Laporan[]
  statusFilter: string
  setStatusFilter: (val: string) => void
  onNextStage: (id: string, action?: string, payload?: any) => void
}

const STATUS_LIST = [
  "all",
  "kadis_review",
  "kabid_review",
  "pengawas_review",
  "pengawasan_dijadwalkan",
  "laporan_disetujui",
  "done",
]

export function DataTable({
  data,
  statusFilter,
  setStatusFilter,
  onNextStage,
}: Props) {

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data
    return data.filter((item) => item.report_stage === statusFilter)
  }, [data, statusFilter])

  const getLabel = (status: string) => {
    switch (status) {
      case "kadis_review": return "Kadis Review"
      case "kabid_review": return "Kabid Review"
      case "pengawas_review": return "Pengawas Review"
      case "pengawasan_dijadwalkan": return "Dijadwalkan"
      case "laporan_disetujui": return "Disetujui"
      case "done": return "Selesai"
      default: return status
    }
  }

  const getColor = (status: string) => {
    switch (status) {
      case "laporan_disetujui":
        return "bg-green-100 text-green-700"
      case "pengawasan_dijadwalkan":
        return "bg-blue-100 text-blue-700"
      case "pengawas_review":
        return "bg-yellow-100 text-yellow-700"
      case "kabid_review":
        return "bg-orange-100 text-orange-700"
      case "kadis_review":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const [modal, setModal] = useState<null | {
    type: "catatan" | "jadwal" | "approve"
    id: string
    action?: string
  }>(null)

  const [catatan, setCatatan] = useState("")
  const [tanggal, setTanggal] = useState("")

  return (
    <div className="space-y-4">

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {STATUS_LIST.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all" ? "Semua" : getLabel(status)}
          </Button>
        ))}
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Usaha</TableHead>
              <TableHead>Jenis Kegiatan</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Waktu Lapor</TableHead>
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Jadwal Pengawasan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>

                  <TableCell>{item.namaUsaha}</TableCell>
                  <TableCell>{item.jenisKegiatan}</TableCell>
                  <TableCell>{item.alamatUsaha}</TableCell>

                  <TableCell>
                    {item.waktuLapor !== "-"
                      ? new Date(item.waktuLapor).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>

                  <TableCell>{item.periodePelaporan}</TableCell>

                  <TableCell>
                    <Badge className={getColor(item.report_stage)}>
                      {getLabel(item.report_stage)}
                    </Badge>
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

                          {/* ================= KADIS ================= */}
                          <DropdownMenuItem
                            disabled={item.report_stage !== "kadis_review"}
                            onClick={() =>
                              setModal({ type: "catatan", id: item.id })
                            }
                          >
                            Kirim ke Kabid
                          </DropdownMenuItem>

                          {/* ================= KABID ================= */}
                          <DropdownMenuItem
                            disabled={item.report_stage !== "kabid_review"}
                            onClick={() =>
                              setModal({ type: "catatan", id: item.id })
                            }
                          >
                            Kirim ke Pengawas
                          </DropdownMenuItem>

                          {/* ================= PENGAWAS JADWAL ================= */}
                          <DropdownMenuItem
                            disabled={item.report_stage !== "pengawas_review"}
                            onClick={() =>
                              setModal({ type: "jadwal", id: item.id, action: "jadwal" })
                            }
                          >
                            Atur Jadwal Pengawasan
                          </DropdownMenuItem>

                          {/* ================= PENGAWAS APPROVE ================= */}
                          <DropdownMenuItem
                            disabled={item.report_stage !== "pengawas_review"}
                            onClick={() =>
                              setModal({ type: "approve", id: item.id, action: "approve" })
                            }
                          >
                            Approve Laporan
                          </DropdownMenuItem>

                          {/* ================= DONE ================= */}
                          <DropdownMenuItem
                            disabled={item.report_stage !== "laporan_disetujui"}
                          >
                            Selesai
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
            <DialogContent>

              <DialogHeader>
                <DialogTitle>
                  {modal?.type === "catatan" && "Masukkan Catatan"}
                  {modal?.type === "jadwal" && "Atur Jadwal Pengawasan"}
                  {modal?.type === "approve" && "Approve Laporan"}
                </DialogTitle>
              </DialogHeader>

              {/* ================= CATATAN ================= */}
              {modal?.type === "catatan" && (
                <Textarea
                  placeholder="Tulis catatan..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              )}

              {/* ================= JADWAL ================= */}
              {modal?.type === "jadwal" && (
                <div className="space-y-3">
                  <Input
                    type="datetime-local"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />

                  <Textarea
                    placeholder="Catatan jadwal..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  />
                </div>
              )}

              {/* ================= APPROVE ================= */}
              {modal?.type === "approve" && (
                <Textarea
                  placeholder="Catatan approve..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              )}

              {/* ================= BUTTON ================= */}
              <div className="flex justify-end gap-2 pt-4">

                <Button
                  variant="outline"
                  onClick={() => {
                    setModal(null)
                    setCatatan("")
                    setTanggal("")
                  }}
                >
                  Batal
                </Button>

                <Button
                  onClick={() => {
                    if (!modal) return

                    if (modal.type === "catatan") {
                      onNextStage(modal.id, undefined, { catatan })
                    }

                    if (modal.type === "jadwal") {
                      onNextStage(modal.id, "jadwal", {
                        tanggal,
                        catatan
                      })
                    }

                    if (modal.type === "approve") {
                      onNextStage(modal.id, "approve", { catatan })
                    }

                    setModal(null)
                    setCatatan("")
                    setTanggal("")
                  }}
                >
                  Simpan
                </Button>

              </div>

            </DialogContent>
          </Dialog>
      </div>
    </div>
  )
}
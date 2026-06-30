"use client"

import { useState } from "react"
import type { Laporan } from "../page"

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

interface Props {
  data: Laporan[]
  onNextStage: (id: string, catatan: string) => void
}

export function DataTable({ data, onNextStage }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [catatan, setCatatan] = useState("")

  return (
    <div className="border rounded-lg overflow-auto">

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Nama Usaha</TableHead>
            <TableHead>Jenis Kegiatan</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Link Dokumen</TableHead>
            <TableHead>Waktu Lapor</TableHead>
            <TableHead>Periode Pelaporan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Catatan</TableHead>
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
                <a
                  href={item.linkDokumen}
                  className="text-blue-600 underline"
                  target="_blank"
                >
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

              <TableCell className="max-w-[200px] whitespace-pre-wrap">
                {typeof item.catatan_review === "string"
                  ? item.catatan_review
                  : item.catatan_review
                  ? JSON.stringify(item.catatan_review)
                  : "-"}
              </TableCell>

              <TableCell>
                {openId === item.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={catatan}
                      onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Catatan ke Pengawas"
                    />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!catatan.trim()) {
                            alert("Catatan wajib diisi")
                            return
                          }

                          onNextStage(item.id, catatan)
                          setOpenId(null)
                          setCatatan("")
                        }}
                      >
                        Kirim
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpenId(null)}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setOpenId(item.id)}>
                    Disposisi
                  </Button>
                )}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>

    </div>
  )
}
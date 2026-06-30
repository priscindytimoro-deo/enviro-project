"use client"

import type { Laporan } from "../page"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

interface Props {
  data: Laporan[]
}

export function DataTable({ data }: Props) {
  return (
    <div className="border rounded-lg overflow-auto">

      <Table>
        <TableHeader>
          <TableRow>

            <TableHead>Nama Usaha</TableHead>
            <TableHead>Jenis Kegiatan</TableHead>
            <TableHead>Alamat</TableHead>

            <TableHead>Waktu Lapor</TableHead>
            <TableHead>Periode</TableHead>

            {/* STATUS */}
            <TableHead>Status Dokumen</TableHead>

            {/* ⭐ NEW COLUMN */}
            <TableHead>Jadwal Pengawasan</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
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
                <Badge>{item.report_stage}</Badge>
              </TableCell>

              {/* ⭐ JADWAL PENGAWASAN */}
              <TableCell>
                {item.jadwal_pengawasan
                  ? new Date(item.jadwal_pengawasan).toLocaleString("id-ID")
                  : "-"}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  )
}
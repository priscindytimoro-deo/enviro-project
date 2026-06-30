"use client"

import type { KabidMonitor } from "../page"

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
  data: KabidMonitor[]
}

export function MonitorTable({ data }: Props) {
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

            <TableHead>Status Dokumen</TableHead>

            <TableHead>Jadwal Pengawasan</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>

                <TableCell>{item.namaUsaha}</TableCell>
                <TableCell>{item.jenisKegiatan}</TableCell>

                <TableCell className="max-w-xs">
                  {item.alamatUsaha}
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

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Tidak ada data monitor
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>

    </div>
  )
}
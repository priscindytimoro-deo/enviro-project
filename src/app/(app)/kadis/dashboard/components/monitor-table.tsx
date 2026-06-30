"use client"

import Link from "next/link"
import type { DashboardReport } from "../page"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Props {
  data: DashboardReport[]
}

export function MonitorTable({ data }: Props) {
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Monitoring Laporan
          </h2>
        </div>

        <Button asChild variant="outline">
          <Link href="/kadis/monitor">
            Lihat Selengkapnya
          </Link>
        </Button>

      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-auto">

        <Table>

          <TableHeader>
            <TableRow>

              <TableHead>Jenis Kegiatan</TableHead>

              <TableHead>Alamat</TableHead>

              <TableHead>Waktu Lapor</TableHead>

              <TableHead>Periode Pelaporan</TableHead>

              <TableHead>Status Dokumen</TableHead>

              <TableHead>Jadwal Pengawasan</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {data.length > 0 ? (
              data.slice(0, 5).map((item) => (
                <TableRow key={item.id}>

                  <TableCell>
                    {item.jenisKegiatan}
                  </TableCell>

                  <TableCell className="max-w-xs whitespace-normal">
                    {item.alamatUsaha}
                  </TableCell>

                  <TableCell>
                    {item.waktuLapor !== "-"
                      ? new Date(item.waktuLapor).toLocaleString("id-ID")
                      : "-"}
                  </TableCell>

                  <TableCell>
                    {item.periodePelaporan}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {item.report_stage}
                    </Badge>
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
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data monitor laporan
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>

      </div>

    </div>
  )
}
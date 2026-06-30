"use client"

import Link from "next/link"
import type { KabidDashboardReport } from "../page"

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
  data: KabidDashboardReport[]
}

export function LatestKabidTable({ data }: Props) {
  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold">
            Laporan Masuk Kabid
          </h2>

          <p className="text-sm text-muted-foreground">
            Menunggu review dari Kepala Bidang
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/kabid/report">
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
              <TableHead>Periode</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>

                  <TableCell>
                    {item.jenisKegiatan}
                  </TableCell>

                  <TableCell className="max-w-xs">
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
                    <Badge>
                      {item.report_stage}
                    </Badge>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada laporan masuk
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>

      </div>

    </div>
  )
}
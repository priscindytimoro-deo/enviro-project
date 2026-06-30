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

export function LatestReportTable({ data }: Props) {
  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Laporan Menunggu Disposisi
        </h2>

        <Button asChild variant="outline">
          <Link href="/kadis/report">
            Lihat Selengkapnya
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>

          <TableHeader>
            <TableRow>

              <TableHead>Jenis Kegiatan</TableHead>

              <TableHead>Alamat</TableHead>

              <TableHead>Link Dokumen</TableHead>

              <TableHead>Waktu Lapor</TableHead>

              <TableHead>Periode</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Catatan Disposisi</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>

            {data.length > 0 ? (
              data.slice(0, 3).map((item) => (
                <TableRow key={item.id}>

                  <TableCell>
                    {item.jenisKegiatan}
                  </TableCell>

                  <TableCell className="max-w-xs whitespace-normal">
                    {item.alamatUsaha}
                  </TableCell>

                  <TableCell>
                    <a
                      href={item.linkDokumen}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Lihat
                    </a>
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

                  <TableCell className="max-w-[220px] whitespace-pre-wrap">
                    {(() => {
                      const val = item.catatan_review

                      if (!val) return "-"

                      if (typeof val === "string") {
                        return val
                      }

                      if (typeof val === "object") {
                        const entries = Object.entries(val)

                        if (entries.length === 0) return "-"

                        return (
                          <div className="space-y-1 text-sm">
                            {entries.map(([key, value]) => (
                              <div key={key}>
                                <span className="font-semibold capitalize">
                                  {key}:
                                </span>{" "}
                                {String(value)}
                              </div>
                            ))}
                          </div>
                        )
                      }

                      return String(val)
                    })()}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada laporan
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>
      </div>

    </div>
  )
}
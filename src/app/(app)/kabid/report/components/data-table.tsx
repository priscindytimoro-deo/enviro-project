"use client"

import { useState } from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"

import type { Laporan } from "../page"

interface Props {
  data: Laporan[]
  onApprove: (id: number) => void
  onAuditKadis: (id: number) => void
  onDelete: (id: number) => void
}

export function DataTable({
  data,
  onApprove,
  onAuditKadis,
  onDelete,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Laporan>[] = [
    {
      accessorKey: "namaUsaha",
      header: "Nama Usaha/Instansi",
    },
    {
      accessorKey: "jenisKegiatan",
      header: "Jenis Kegiatan",
    },
    {
      accessorKey: "jenisDokumen",
      header: "Jenis Dokumen",
    },
    {
      accessorKey: "nomorDokumen",
      header: "Nomor Dokumen",
    },
    {
      accessorKey: "tanggalTerbit",
      header: "Tanggal Terbit",
    },
    {
      accessorKey: "lokasi",
      header: "Lokasi (Koordinat)",
    },
    {
      accessorKey: "linkDokumen",
      header: "Link Dokumen",
      cell: ({ row }) => (
        <a
          href={row.getValue("linkDokumen")}
          target="_blank"
          className="text-blue-600 underline"
        >
          Lihat
        </a>
      ),
    },
    {
      accessorKey: "waktuLapor",
      header: "Waktu/Tgl Lapor",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("status")}</Badge>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onApprove(item.id)}>
                Approve
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onAuditKadis(item.id)}>
                Audit Kadis
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(item.id)}
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    state: {
      globalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Cari laporan..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(
                      h.column.columnDef.header,
                      h.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  Tidak ada data laporan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
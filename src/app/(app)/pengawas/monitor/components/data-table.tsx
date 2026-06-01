"use client"

import { useState } from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical, Search } from "lucide-react"
import type { Monitoring } from "../page"

interface Props {
  data: Monitoring[]
  onDelete: (id: string) => void
  onSetJadwal: (id: string) => void
}

export function DataTable({ data = [], onDelete, onSetJadwal }: Props) {
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Monitoring>[] = [
    { accessorKey: "namaUsaha", header: "Nama Usaha/Instansi" },
    { accessorKey: "jenisKegiatan", header: "Jenis Kegiatan" },
    { accessorKey: "jenisDokumen", header: "Jenis Dokumen" },
    { accessorKey: "nomorDokumen", header: "Nomor Dokumen" },
    { accessorKey: "tanggalTerbit", header: "Tanggal Terbit" },
    { accessorKey: "lokasi", header: "Lokasi (Koordinat)" },

    {
      accessorKey: "jadwalPengawasan",
      header: "Jadwal Pengawasan",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("jadwalPengawasan") || "-"}
        </Badge>
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
              <DropdownMenuItem onClick={() => onSetJadwal(item.id)}>
                Set Jadwal
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
          placeholder="Cari data monitoring..."
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
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                <TableCell colSpan={columns.length} className="text-center h-24">
                  Tidak ada data monitoring
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
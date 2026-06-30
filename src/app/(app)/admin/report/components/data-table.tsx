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

import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@supabase/ssr"
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
interface Props {
  data: Laporan[]
  onNextStage: (id: string) => void
  onDelete: (id: string) => void
  onRefresh: () => void   // 🔥 WAJIB (jangan optional)
}

export function DataTable({
  data,
  onNextStage,
  onDelete,
  onRefresh,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [openReject, setOpenReject] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [catatan, setCatatan] = useState("")

  const handleOpenReject = (id: string) => {
    setSelectedId(id)
    setCatatan("")
    setOpenReject(true)
  }

  const handleRejectSubmit = async () => {
    if (!selectedId) return

    if (!catatan.trim()) {
      alert("Catatan wajib diisi")
      return
    }

    const { error } = await supabase
      .from("reports")
      .update({
        status_verifikasi: "Draft",
        catatan_verifikasi: catatan,
      })
      .eq("id", selectedId)

    if (error) {
      alert("Gagal mengembalikan laporan")
      return
    }

    // ✅ SUCCESS ALERT
    alert("Laporan berhasil dikembalikan ke Draft")

    setOpenReject(false)
    setSelectedId(null)
    setCatatan("")

    // 🔥 REFRESH DATA
    onRefresh()
  }

  // =========================
  // COLUMNS (13 FIELD)
  // =========================

  const columns: ColumnDef<Laporan>[] = [
    // 1
    {
      accessorKey: "namaUsaha",
      header: "Nama Usaha / Instansi",
    },

    // 2
    {
      accessorKey: "jenisKegiatan",
      header: "Jenis Kegiatan",
    },

    // 3
    {
      accessorKey: "alamatUsaha",
      header: "Alamat",
    },

    // 4
    {
      accessorKey: "jenisDokumen",
      header: "Jenis Dokumen",
    },

    // 5
    {
      accessorKey: "nomorDokumen",
      header: "Nomor Dokumen",
    },

    // 6
    {
      accessorKey: "tanggalTerbit",
      header: "Tanggal Terbit",
      cell: ({ row }) => {
        const val = row.getValue("tanggalTerbit") as string
        return val !== "-" ? new Date(val).toLocaleDateString("id-ID") : "-"
      },
    },

    // 7
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

    // 8
    {
      accessorKey: "waktuLapor",
      header: "Waktu Lapor",
      cell: ({ row }) => {
        const val = row.getValue("waktuLapor") as string
        return val !== "-" ? new Date(val).toLocaleString("id-ID") : "-"
      },
    },

    // 9
    {
      accessorKey: "periodePelaporan",
      header: "Periode Pelaporan",
    },

    // 10
    {
      accessorKey: "statusUser",
      header: "Status User",
      cell: ({ row }) => {
        const status = row.getValue("statusUser") as string
        return <Badge variant="outline">{status}</Badge>
      },
    },

    // 12
    {
      accessorKey: "catatan_verifikasi",
      header: "Catatan Verifikasi",
    },

    // 11
    {
      accessorKey: "report_stage",
      header: "Status Dokumen",
      cell: ({ row }) => {
        const stage = row.getValue("report_stage") as string

        const color =
          stage === "done"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"

        return <Badge className={color}>{stage}</Badge>
      },
    },
    
    {
      accessorKey: "catatan_review",
      header: "Catatan Disposisi",
      cell: ({ row }) => {
        const val = row.getValue("catatan_review")

        if (!val) return "-"

        if (typeof val === "string") return val

        if (typeof val === "object") {
          return (
            <div className="space-y-1 text-sm">
              {Object.entries(val).map(([key, value]) => (
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
      },
    },

    // 13 ACTION
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const item = row.original

        const getLabel = (stage: string) => {
          switch (stage) {
            case "admin_review":
              return "Kirim ke Kadis"
            case "kadis_review":
              return "Audit Kabid"
            case "kabid_review":
              return "Audit Pengawas"
            case "pengawas_review":
              return "Final Admin"
            default:
              return "Selesai"
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem
                className="text-orange-600"
                onClick={() => handleOpenReject(item.id)}
              >
                Kembalikan ke Draft
              </DropdownMenuItem>

              {item.report_stage !== "done" && (
                <DropdownMenuItem
                  onClick={() => onNextStage(item.id)}
                >
                  {getLabel(item.report_stage)}
                </DropdownMenuItem>
              )}

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

  // =========================
  // TABLE INSTANCE
  // =========================

  const table = useReactTable({
    data,
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
          placeholder="Cari laporan..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="whitespace-nowrap">
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap"
                    >
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
                <TableCell colSpan={13} className="text-center h-24">
                  Tidak ada data
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

      {openReject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-lg p-4 space-y-4">

            <h2 className="text-lg font-semibold">
              Kembalikan ke Draft
            </h2>

            <Textarea
              placeholder="Masukkan catatan verifikasi..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenReject(false)}
              >
                Batal
              </Button>

              <Button
                onClick={handleRejectSubmit}
                className="bg-orange-600 text-white"
              >
                Simpan
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

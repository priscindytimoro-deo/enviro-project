"use client"

import { useState } from "react"
import type {
  User,
  UserFormValues,
} from "@/types/user"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface DataTableProps {
  users: User[]
  onAddUser: (data: UserFormValues) => void
  onEditUser: (user: User) => void
  onVerifyUser: (user: User) => void
  onRejectUser: (user: User) => void
  onDeleteUser: (user: User) => void
}

export function DataTable({
  users,
  onAddUser,
  onEditUser,
  onVerifyUser,
  onRejectUser,
  onDeleteUser,
}: DataTableProps) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([])

  const [globalFilter, setGlobalFilter] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terverifikasi":
        return "bg-green-100 text-green-700 border-green-200"

      case "Belum Verifikasi":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"

      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRoleColor = (role: string) => {

    switch (role) {

      case "Admin":
        return "bg-red-100 text-red-700"

      case "Kepala Dinas":
        return "bg-purple-100 text-purple-700"

      case "Kepala Bidang":
        return "bg-blue-100 text-blue-700"

      case "Pengawas":
        return "bg-orange-100 text-orange-700"

      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const columns: ColumnDef<User>[] = [

    {
      accessorKey: "name",

      header: "Nama Penanggung Jawab",

      cell: ({ row }) => {

        const user = row.original

        return (
          <div className="flex items-center gap-3">

            <Avatar className="h-10 w-10">

              <AvatarFallback className="font-semibold">
                {user.avatar}
              </AvatarFallback>

            </Avatar>

            <div className="flex flex-col">

              <span className="font-medium">
                {user.name}
              </span>

              <span className="text-xs text-muted-foreground">
                ID #{user.id}
              </span>

            </div>

          </div>
        )
      },
    },

    {
      accessorKey: "email",

      header: "Email",

      cell: ({ row }) => (
        <span className="text-sm">
          {row.getValue("email")}
        </span>
      ),
    },

    {
      accessorKey: "phone",

      header: "No. HP",

      cell: ({ row }) => (
        <span>
          {row.getValue("phone")}
        </span>
      ),
    },

    {
      accessorKey: "role",

      header: "Role",

      cell: ({ row }) => {

        const role = row.getValue("role") as string

        return (
          <Badge
            variant="outline"
            className={getRoleColor(role)}
          >
            {role}
          </Badge>
        )
      },
    },

    {
      accessorKey: "verificationStatus",
      header: "Status Verifikasi",
      cell: ({ row }) => {
        const status = row.getValue("verificationStatus") as string

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status === "approved" ? "Approved" : "Pending"}
          </span>
        )
      },
    },

    {
      accessorKey: "is_active",
      header: "Status Akun",
      cell: ({ row }) => {
        const active = row.getValue("is_active") as boolean

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              active
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {active ? "Aktif" : "Nonaktif"}
          </span>
        )
      },
    },

    {
      accessorKey: "createdAt",

      header: "Waktu/Tgl Pembuatan",

      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("createdAt")}
        </span>
      ),
    },

    {
      id: "actions",

      header: "Action",

      cell: ({ row }) => {

        const user = row.original




        return (
          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
              >
                <EllipsisVertical className="size-4" />
              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem
                onClick={() => onEditUser(user)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 size-4" />
                Edit Data User
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onVerifyUser(user)}
              >
                <CheckCircle2 className="mr-2 size-4 text-green-600" />
                Verifikasi User
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onRejectUser(user)}
              >
                <XCircle className="mr-2 size-4 text-red-600" />
                Tolak Verifikasi
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={() => onDeleteUser(user)}
              >
                <Trash2 className="mr-2 size-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Pengguna
          </h1>

          <p className="text-muted-foreground">
            Manajemen data pengguna sistem
          </p>

        </div>

      </div>

      {/* FILTER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="relative w-full md:max-w-sm">

          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Cari pengguna..."
            value={globalFilter ?? ""}
            onChange={(event) =>
              setGlobalFilter(event.target.value)
            }
            className="pl-9"
          />

        </div>

        <div className="flex gap-2">

          <Select
            onValueChange={(value) =>
              table
                .getColumn("role")
                ?.setFilterValue(
                  value === "all" ? "" : value
                )
            }
          >

            <SelectTrigger className="w-[220px]">

              <SelectValue placeholder="Filter Role" />

            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                Semua Role
              </SelectItem>

              <SelectItem value="Admin">
                Admin
              </SelectItem>

              <SelectItem value="kadis">
                Kepala Dinas
              </SelectItem>

              <SelectItem value="kabid">
                Kepala Bidang
              </SelectItem>

              <SelectItem value="Pengawas">
                Pengawas
              </SelectItem>

              <SelectItem value="user">
                Pengguna
              </SelectItem>

            </SelectContent>

          </Select>

        </div>

      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden">

        <Table>

          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (

                  <TableHead key={header.id}>

                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                  </TableHead>

                ))}

              </TableRow>

            ))}

          </TableHeader>

          <TableBody>

            {table.getRowModel().rows?.length ? (

              table.getRowModel().rows.map((row) => (

                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40"
                >

                  {row.getVisibleCells().map((cell) => {

                    const columnId = cell.column.id

                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Tidak ada data pengguna.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-muted-foreground">
          Total {users.length} pengguna
        </p>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
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

    </div>
  )
}
"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Badge
} from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  FileText,
  Search,
  Eye,
  Download,
} from "lucide-react"

const dummyData = [
  {
    id: "LP-001",
    nama: "PT Maju Jaya",
    sektor: "Perkebunan",
    jenis: "SPPL",
    status: "Diverifikasi",
    tanggal: "2026-01-10",
  },
  {
    id: "LP-002",
    nama: "CV Berkah Alam",
    sektor: "Peternakan",
    jenis: "UKL-UPL",
    status: "Proses",
    tanggal: "2026-02-02",
  },
  {
    id: "LP-003",
    nama: "PT Sejahtera Abadi",
    sektor: "Industri",
    jenis: "SPPL",
    status: "Ditolak",
    tanggal: "2026-03-01",
  },
]

export default function CekLaporanPage() {
  const [search, setSearch] = useState("")

  const filtered = dummyData.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Cek Laporan
        </h1>
        <p className="text-muted-foreground">
          Pantau status dan data laporan pelaku usaha
        </p>
      </div>

      {/* FILTER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row gap-3">

          <Input
            placeholder="Cari nama / ID laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="proses">Proses</SelectItem>
              <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Daftar Laporan
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Sektor</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.id}
                  </TableCell>

                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.sektor}</TableCell>
                  <TableCell>{item.jenis}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Diverifikasi"
                          ? "default"
                          : item.status === "Proses"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.tanggal}</TableCell>

                  <TableCell className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
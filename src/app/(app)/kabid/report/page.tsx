"use client"

import { useState } from "react"
import { DataTable } from "./components/data-table"
import initialReportData from "./data.json"

export interface Laporan {
  id: number
  namaUsaha: string
  jenisKegiatan: string
  jenisDokumen: string
  nomorDokumen: string
  tanggalTerbit: string
  waktuLapor: string
  lokasi: string
  linkDokumen: string
  status: string
}

export interface LaporanFormValues {
  namaUsaha: string
  jenisKegiatan: string
  jenisDokumen: string
  nomorDokumen: string
  tanggalTerbit: string
  lokasi: string
  linkDokumen: string
  status: string
}

export default function ReportPage() {
  const [reports, setReports] = useState<Laporan[]>(
    initialReportData as Laporan[]
  )

  const handleAddReport = (data: LaporanFormValues) => {
    const newReport: Laporan = {
      id: Math.max(0, ...reports.map((r) => r.id)) + 1,
      ...data,
      waktuLapor: new Date().toISOString().slice(0, 16).replace("T", " ")
    }

    setReports((prev) => [newReport, ...prev])
  }

  const handleDeleteReport = (id: number) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const handleApprove = (id: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Disetujui" } : r
      )
    )
  }

  const handleAuditKadis = (id: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "Audit Kadis" } : r
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1 px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Manajemen Laporan
        </h1>
        <p className="text-muted-foreground">
          Kelola laporan dokumen lingkungan hidup
        </p>
      </div>

      <div className="@container/main px-4 lg:px-6">
        <DataTable
          data={reports}
          onApprove={handleApprove}
          onAuditKadis={handleAuditKadis}
          onDelete={handleDeleteReport}
        />
      </div>
    </div>
  )
}
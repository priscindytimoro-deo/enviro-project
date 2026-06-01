"use client"

import { useState } from "react"
import { DataTable } from "./components/data-table"
import initialMonitorData from "./data.json"

export interface Monitoring {
  id: number
  namaUsaha: string
  jenisKegiatan: string
  jenisDokumen: string
  nomorDokumen: string
  tanggalTerbit: string
  lokasi: string
  jadwalPengawasan: string
}

export default function MonitorPage() {
  const [data, setData] = useState<Monitoring[]>(
    initialMonitorData as Monitoring[]
  )

  const handleAdd = (item: Monitoring) => {
    const newItem: Monitoring = {
      ...item,
      id: crypto.randomUUID(),
    }

    setData((prev) => [newItem, ...prev])
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((d) => d.id !== id))
  }

  const handleSetJadwal = (id: number) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              jadwalPengawasan: new Date()
                .toISOString()
                .slice(0, 16)
                .replace("T", " "),
            }
          : d
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="space-y-1 px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Monitoring Pengawasan
        </h1>
        <p className="text-muted-foreground">
          Jadwal dan data pengawasan lingkungan hidup
        </p>
      </div>

      <div className="@container/main px-4 lg:px-6">
        <DataTable
          data={data}
          onDelete={handleDelete}
          onSetJadwal={handleSetJadwal}
        />
      </div>

    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilTab({
  list,
  onSave,
  onDelete,
  onEdit,
}: any) {
  return (
    <div className="space-y-4">

      {list.map((item: any) => (
        <div key={item.id} className="border p-3 rounded">
          <div>{item.jenis_usaha_kegiatan}</div>

          <div className="flex gap-2 mt-2">
            <Button onClick={() => onEdit(item)}>Edit</Button>
            <Button variant="destructive" onClick={() => onDelete(item.id)}>
              Hapus
            </Button>
          </div>
        </div>
      ))}

    </div>
  )
}
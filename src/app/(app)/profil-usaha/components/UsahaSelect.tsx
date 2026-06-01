"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsahaSelect({ usahaList, loading, onSelect }: any) {
  return (
    <Select onValueChange={onSelect} disabled={loading}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Memuat..." : "Pilih usaha"} />
      </SelectTrigger>

      <SelectContent>
        {usahaList.length === 0 ? (
          <SelectItem value="empty">Tidak ada data</SelectItem>
        ) : (
          usahaList.map((u: any) => (
            <SelectItem key={u.id} value={u.id}>
              {u.jenis_usaha_kegiatan}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
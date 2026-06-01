"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LaporanForm({
  form,
  setForm,
  onSubmit,
  loading,
}: any) {

  const handleNomor = (value: string) => {
    let clean = value.toUpperCase()
    clean = clean.replace(/[^A-Z0-9/.]/g, "")

    if (clean.length <= 21) {
      setForm((p: any) => ({ ...p, nomorDokumen: clean }))
    }
  }

  return (
    <div className="space-y-3">

      <Input value={form.jenisUsaha} disabled />
      <Input value={form.deskripsi} disabled />
      <Input value={form.kbli} disabled />
      <Input value={form.koordinat} disabled />

      <Input
        placeholder="Nomor Dokumen"
        value={form.nomorDokumen}
        onChange={(e) => handleNomor(e.target.value)}
        maxLength={21}
      />

      <Input
        type="date"
        onChange={(e) =>
          setForm((p: any) => ({
            ...p,
            tanggalTerbit: e.target.value,
          }))
        }
      />

      <Input
        placeholder="Link dokumen"
        onChange={(e) =>
          setForm((p: any) => ({
            ...p,
            linkDokumen: e.target.value,
          }))
        }
      />

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? "Menyimpan..." : "Submit"}
      </Button>

    </div>
  )
}
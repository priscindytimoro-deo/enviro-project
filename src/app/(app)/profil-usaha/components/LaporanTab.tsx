"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LaporanTab() {
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    jenisDokumen: "",
    tanggalTerbit: "",
    nomorDokumen: "",
    linkDokumen: "",
  })

  const handleSubmit = async () => {
    if (!selected) return alert("Pilih usaha dulu")

    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return

    const { error } = await supabase.from("reports").insert({
      user_id: auth.user.id,
      usaha_kegiatan_id: selected,
      jenis_dokumen: form.jenisDokumen,
      tanggal_terbit: form.tanggalTerbit,
      nomor_dokumen: form.nomorDokumen,
      link_dokumen: form.linkDokumen,
      status_verifikasi: "Dalam Proses",
    })

    setLoading(false)

    if (error) return alert("Gagal")

    alert("Berhasil")
  }

  return (
    <div className="space-y-4">

      <Select onValueChange={setSelected}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih usaha" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="1">Usaha A</SelectItem>
          <SelectItem value="2">Usaha B</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(v) =>
          setForm((p) => ({ ...p, jenisDokumen: v }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Jenis Dokumen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SPPL">SPPL</SelectItem>
          <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            tanggalTerbit: e.target.value,
          }))
        }
      />

      <Input
        placeholder="Nomor dokumen"
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            nomorDokumen: e.target.value.toUpperCase(),
          }))
        }
      />

      <Input
        placeholder="Link dokumen"
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            linkDokumen: e.target.value,
          }))
        }
      />

      <Button onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
    </div>
  )
}
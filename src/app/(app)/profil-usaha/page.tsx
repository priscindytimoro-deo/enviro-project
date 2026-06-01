"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import { Plus, Save, Trash2, Pencil, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ======================================
// SUPABASE
// ======================================
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ======================================
// TYPE
// ======================================
interface Usaha {
  id: string
  profile_id: string
  jenis_usaha_kegiatan: string
  deskripsi_kegiatan: string
  kbli: string
  koordinat_lokasi: string
}

export default function JenisUsahaPage() {

const [list, setList] = useState<Usaha[]>([])
const [user, setUser] = useState<any>(null)

const [profile, setProfile] = useState<any>(null)

// id dari tabel usaha_profile
const [usahaProfile, setUsahaProfile] = useState<any>(null)

const [form, setForm] = useState({
  jenis: "",
  deskripsi: "",
  kbli: "",
  koordinat: "",
})

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ======================================
  // LOAD USER + PROFILE + DATA
  // ======================================
 useEffect(() => {
  const load = async () => {
    try {
      // USER LOGIN
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)

      // ==========================
      // AMBIL DATA USAHA PROFILE
      // ==========================
      const {
        data: usahaProfile,
        error: profileError,
      } = await supabase
        .from("usaha_profile")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError) {
        console.error("USAHA PROFILE ERROR:", profileError)
        return
      }

      setProfile(usahaProfile)

      // ==========================
      // AMBIL DATA USAHA KEGIATAN
      // ==========================
      const {
        data: kegiatan,
        error: kegiatanError,
      } = await supabase
        .from("usaha_kegiatan")
        .select("*")
        .eq("profile_id", usahaProfile.id)
        .order("created_at", { ascending: false })

      if (kegiatanError) {
        console.error("KEGIATAN ERROR:", kegiatanError)
        return
      }

      setList(kegiatan || [])
    } catch (err) {
      console.error("LOAD ERROR:", err)
    }
  }

  load()
}, [])

  // ======================================
  // INPUT
  // ======================================
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // KBLI max 5 digit
  const handleKbliChange = (value: string) => {
    const clean = value.replace(/\D/g, "")
    if (clean.length <= 5) {
      setForm((p) => ({ ...p, kbli: clean }))
    }
  }

  // koordinat valid
  const handleKoordinatChange = (value: string) => {
    const clean = value.replace(/[^0-9\s\-.]/g, "")
    setForm((p) => ({ ...p, koordinat: clean }))
  }

  // ======================================
  // SAVE
  // ======================================
const handleSave = async () => {
  if (!user) {
    alert("User belum siap")
    return
  }

  if (
    !form.jenis ||
    !form.deskripsi ||
    !form.kbli ||
    !form.koordinat
  ) {
    alert("Semua field wajib diisi")
    return
  }

  setLoading(true)

  try {

    // ==========================
    // AMBIL ID usaha_profile
    // ==========================
    const { data: usahaProfile, error: profileError } =
      await supabase
        .from("usaha_profile")
        .select("id")
        .eq("user_id", user.id)
        .single()

    if (profileError || !usahaProfile) {
      console.error("USAHA PROFILE ERROR:", profileError)
      alert("Profil usaha belum dibuat")
      setLoading(false)
      return
    }

    // ==========================
    // UPDATE
    // ==========================
    if (editId) {

      const { data, error } = await supabase
        .from("usaha_kegiatan")
        .update({
          jenis_usaha_kegiatan: form.jenis,
          deskripsi_kegiatan: form.deskripsi,
          kbli: form.kbli,
          koordinat_lokasi: form.koordinat,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editId)
        .select()
        .single()

      if (error) {
        console.error("UPDATE ERROR:", error)
        throw error
      }

      setList((prev) =>
        prev.map((item) =>
          item.id === editId ? data : item
        )
      )
    }

    // ==========================
    // INSERT
    // ==========================
    else {

      const { data, error } = await supabase
        .from("usaha_kegiatan")
        .insert({
          profile_id: usahaProfile.id,
          jenis_usaha_kegiatan: form.jenis,
          deskripsi_kegiatan: form.deskripsi,
          kbli: form.kbli,
          koordinat_lokasi: form.koordinat,
        })
        .select()
        .single()

      if (error) {
        console.error("INSERT ERROR:", error)
        throw error
      }

      setList((prev) => [data, ...prev])
    }

    setOpen(false)

    setForm({
      jenis: "",
      deskripsi: "",
      kbli: "",
      koordinat: "",
    })

    setEditId(null)

  } catch (err) {
    console.error("SAVE ERROR:", err)
    alert("Gagal menyimpan data")
  }

  setLoading(false)
}

  // ======================================
  // DELETE
  // ======================================
const handleDelete = async (id: string) => {

  const confirmDelete = confirm(
    "Apakah Anda yakin ingin menghapus data usaha ini?"
  )

  if (!confirmDelete) return

  try {

    const { error } = await supabase
      .from("usaha_kegiatan")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("DELETE ERROR:", error)
      alert(error.message)
      return
    }

    setList((prev) =>
      prev.filter((item) => item.id !== id)
    )

    alert("Data berhasil dihapus")

  } catch (err) {
    console.error("DELETE ERROR:", err)
    alert("Gagal menghapus data")
  }
}

  // ======================================
  // UI
  // ======================================
  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Jenis Usaha/Kegiatan
          </h1>

          <p className="text-muted-foreground">
            Kelola usaha pengguna
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="w-full md:w-auto"
        >
          Tambah
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Usaha</CardTitle>
        </CardHeader>

        <CardContent>
          {list.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Belum ada data
            </p>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>Jenis</th>
                  <th>Deskripsi</th>
                  <th>KBLI</th>
                  <th>Koordinat</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td>{item.jenis_usaha_kegiatan}</td>
                    <td>{item.deskripsi_kegiatan}</td>
                    <td>{item.kbli}</td>
                    <td>{item.koordinat_lokasi}</td>

                    <td className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditId(item.id)
                          setForm({
                            jenis: item.jenis_usaha_kegiatan,
                            deskripsi: item.deskripsi_kegiatan,
                            kbli: item.kbli,
                            koordinat: item.koordinat_lokasi,
                          })
                          setOpen(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </CardContent>
      </Card>

      {list.length > 0 && (
        <div className="flex justify-end">
          <Button asChild size="lg">
            <a href="/buat-laporan">
              <FileText className="mr-2 h-4 w-4" />
              Lanjutkan ke Buat Laporan
            </a>
          </Button>
        </div>
      )}

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit" : "Tambah"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <Label>Nama Usaha/kegiatan</Label>
              <Input
                value={form.jenis}
                onChange={(e) =>
                  handleChange("jenis", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Deskripsi Usaha/kegiatan</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  handleChange("deskripsi", e.target.value)
                }
              />
            </div>

            <div>
              <Label>KBLI (max 5 digit)</Label>
              <Input
                value={form.kbli}
                onChange={(e) =>
                  handleKbliChange(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Koordinat</Label>
              <Input
                value={form.koordinat}
                onChange={(e) =>
                  handleKoordinatChange(e.target.value)
                }
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
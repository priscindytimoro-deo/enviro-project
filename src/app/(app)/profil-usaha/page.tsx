"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import { Save, Trash2, Pencil, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
  alamat_usaha_kegiatan: string
  koordinat_lokasi: string

  hasReport?: boolean
}

export default function JenisUsahaPage() {

  const [list, setList] = useState<Usaha[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [profileReady, setProfileReady] = useState(false)
  const [nameExists, setNameExists] = useState(false)
  const [checkingName, setCheckingName] = useState(false)

  const checkNamaUsaha = async (nama: string) => {
  if (!nama || !profile?.id) return

  setCheckingName(true)

  const { data } = await supabase
      .from("usaha_kegiatan")
      .select("id")
      .eq("profile_id", profile.id)
      .ilike("jenis_usaha_kegiatan", nama)

    setNameExists((data?.length ?? 0) > 0)

    setCheckingName(false)
  }

  const [form, setForm] = useState({
    jenis: "",
    deskripsi: "",
    kbli: "",
    alamat: "",
    latitude: "",
    longitude: "",
  })

  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  // ======================================
  // LOAD DATA
  // ======================================
 useEffect(() => {
    const load = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()

        if (!auth?.user) {
          setLoadingPage(false)
          return
        }

        setUser(auth.user)

        const { data: usahaProfile } = await supabase
          .from("usaha_profile")
          .select("*")
          .eq("user_id", auth.user.id)
          .maybeSingle()

        // BELUM ADA PROFIL
        if (!usahaProfile) {
          setProfile(null)
          setProfileReady(false)
          setList([])
          setLoadingPage(false)
          return
        }

        setProfile(usahaProfile)
        setProfileReady(true)

        const { data: kegiatan } = await supabase
          .from("usaha_kegiatan")
          .select(`
            *,
            reports:reports(id)
          `)
          .eq("profile_id", usahaProfile.id)
          .order("created_at", {
            ascending: false,
          })

        const mapped = (kegiatan || []).map((item) => ({
          ...item,
          hasReport: (item.reports?.length ?? 0) > 0,
        }))

        setList(mapped)
      } finally {
        setLoadingPage(false)
      }
    }

    load()
  }, [])

  // ======================================
  // GPS LOCATION
  // ======================================
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS tidak didukung browser")
      return
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((p) => ({
        ...p,
        latitude: pos.coords.latitude.toString(),
        longitude: pos.coords.longitude.toString(),
      }))
    })
  }

  // ======================================
  // SAVE
  // ======================================
  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    setErrors({})

    const newErrors: any = {}

    if (!form.jenis)
      newErrors.jenis = "Nama usaha wajib diisi"

    if (!form.deskripsi)
      newErrors.deskripsi = "Deskripsi wajib diisi"
    else if (form.deskripsi.length > 500)
      newErrors.deskripsi = "Maksimal 500 karakter"

    if (!form.kbli)
      newErrors.kbli = "KBLI wajib diisi"
    else if (!/^\d{1,5}$/.test(form.kbli))
      newErrors.kbli = "KBLI harus angka dan maksimal 5 digit"

    if (!form.alamat)
      newErrors.alamat = "Alamat wajib diisi"

    // if (!form.latitude || !form.longitude)
    //   newErrors.lokasi = "Lokasi wajib diisi"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    const koordinat =
      form.latitude && form.longitude
        ? `${form.latitude},${form.longitude}`
        : null

    try {
      const { data: usahaProfile } = await supabase
        .from("usaha_profile")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!usahaProfile) return

      if (editId) {
        const { data, error } = await supabase
          .from("usaha_kegiatan")
          .update({
            jenis_usaha_kegiatan: form.jenis,
            deskripsi_kegiatan: form.deskripsi,
            kbli: form.kbli,
            alamat_usaha_kegiatan: form.alamat,
            koordinat_lokasi: koordinat,
          })
          .eq("id", editId)
          .select()
          .single()

        if (error) throw error

        setList((prev) =>
          prev.map((i) =>
            i.id === editId ? data : i
          )
        )
      } else {
        const { data, error } = await supabase
          .from("usaha_kegiatan")
          .insert({
            profile_id: usahaProfile.id,
            jenis_usaha_kegiatan: form.jenis,
            deskripsi_kegiatan: form.deskripsi,
            kbli: form.kbli,
            alamat_usaha_kegiatan: form.alamat,
            koordinat_lokasi: koordinat,
          })
          .select()
          .single()

        if (error) throw error

        setList((prev) => [data, ...prev])
      }

      setOpen(false)
      setEditId(null)
      setForm({
        jenis: "",
        deskripsi: "",
        kbli: "",
        alamat: "",
        latitude: "",
        longitude: "",
      })

    } catch (err) {
      setErrors({
        global: "Terjadi kesalahan saat menyimpan data",
      })
    }

    setLoading(false)
  }

  // ======================================
  // DELETE
  // ======================================
  const handleDelete = async (id: string) => {
    const ok = confirm("Hapus data ini?")
    if (!ok) return

    await supabase
      .from("usaha_kegiatan")
      .delete()
      .eq("id", id)

    setList((prev) =>
      prev.filter((i) => i.id !== id)
    )
  }

  // Acces Guard
  if (loadingPage) {
  return (
    <div className="p-6">
      Memuat data...
    </div>
  )
}

if (!profileReady) {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <div className="border rounded-xl p-6 space-y-4">

        <h1 className="text-2xl font-bold">
          Profil Belum Lengkap
        </h1>

        <p className="text-muted-foreground">
          Anda harus melengkapi profil terlebih dahulu
          sebelum dapat mengakses halaman Profil Usaha.
        </p>

        <Button asChild>
          <Link href="/profil">
            Lengkapi Profil
          </Link>
        </Button>

      </div>

    </div>
  )
}

  // ======================================
  // UI (TIDAK DIUBAH)
  // ======================================
  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Jenis Usaha / Kegiatan
          </h1>
          <p className="text-muted-foreground">
            Kelola data usaha pengguna
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          Tambah Usaha/Kegiatan
        </Button>
      </div>

      {/* TABLE + MOBILE (TIDAK DIUBAH) */}
      <div className="space-y-4">

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th>Nama Usaha/Kegiatan</th>
                <th>Deskripsi Usaha/Kegiatan</th>
                <th>KBLI</th>
                <th>Alamat Usaha/Kegiatan</th>
                <th>Koordinat Lokasi Usaha/Kegiatan</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b">
                  <td>{item.jenis_usaha_kegiatan}</td>
                  <td>{item.deskripsi_kegiatan}</td>
                  <td>{item.kbli}</td>
                  <td>{item.alamat_usaha_kegiatan}</td>
                  <td>{item.koordinat_lokasi}</td>

                  <td className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditId(item.id)

                        const [lat, lng] =
                          (item.koordinat_lokasi || "").split(",")

                        setForm({
                          jenis: item.jenis_usaha_kegiatan,
                          deskripsi: item.deskripsi_kegiatan,
                          kbli: item.kbli,
                          alamat: item.alamat_usaha_kegiatan,
                          latitude: lat || "",
                          longitude: lng || "",
                        })

                        setOpen(true)
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {item.hasReport && (
                      <Button
                      variant="outline">
                        Sudah dilaporkan
                      </Button>
                    )}

                    {!item.hasReport && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE tetap utuh */}
        <div className="grid gap-3 md:hidden">
          {list.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="font-semibold">
                {item.jenis_usaha_kegiatan}
              </div>

              <div className="text-sm text-muted-foreground">
                {item.deskripsi_kegiatan}
              </div>

              <div className="text-xs space-y-1">
                <div>KBLI: {item.kbli}</div>
                <div>Alamat: {item.alamat_usaha_kegiatan}</div>
                <div>Koordinat: {item.koordinat_lokasi}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditId(item.id)

                    const [lat, lng] =
                      (item.koordinat_lokasi || "").split(",")

                    setForm({
                      jenis: item.jenis_usaha_kegiatan,
                      deskripsi: item.deskripsi_kegiatan,
                      kbli: item.kbli,
                      alamat: item.alamat_usaha_kegiatan,
                      latitude: lat || "",
                      longitude: lng || "",
                    })

                    setOpen(true)
                  }}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                {item.hasReport && (
                  <Button
                      variant="outline">
                    Sudah dilaporkan
                  </Button>
                )}

                {!item.hasReport && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL (TIDAK DIUBAH) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit" : "Tambah"} Usaha
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <Label>Nama Usaha/Kegiatan</Label>
                <Input
                  value={form.jenis}
                  onChange={(e) => {
                    const val = e.target.value

                    setForm({ ...form, jenis: val })

                    // realtime check (simple)
                    checkNamaUsaha(val)
                  }}
                />
                {checkingName && (
                  <p className="text-xs text-muted-foreground">
                    Mengecek nama usaha...
                  </p>
                )}

                {nameExists && (
                  <p className="text-xs text-red-500">
                    Nama usaha/kegiatan sudah terdaftar pada profil Anda
                  </p>
                )}
            </div>

            <div>
              <Label>Deskripsi Usaha/Kegiatan</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({ ...form, deskripsi: e.target.value })
                }
              />
              {errors.deskripsi && (
                <p className="text-red-500 text-xs">
                  {errors.deskripsi}
                </p>
              )}
            </div>

            <div>
              <Label>KBLI</Label>
              <Input
                value={form.kbli}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "")
                  if (val.length <= 5)
                    setForm({ ...form, kbli: val })
                }}
              />
              {errors.kbli && (
                <p className="text-red-500 text-xs">
                  {errors.kbli}
                </p>
              )}
            </div>

            <div>
              <Label>Alamat Usaha/Kegiatan</Label>
              <Input
                value={form.alamat}
                onChange={(e) =>
                  setForm({ ...form, alamat: e.target.value })
                }
              />
              {errors.alamat && (
                <p className="text-red-500 text-xs">
                  {errors.alamat}
                </p>
              )}
            </div>

            {/* LOKASI */}
            <div className="space-y-3">
              <Label>Lokasi Usaha/Kegiatan</Label>

              {/* STATUS LOKASI */}
              <div className="p-3 rounded-md border bg-muted/30 text-xs space-y-1">
                <div className="font-medium">
                  📍 Status Lokasi
                </div>

                {form.latitude && form.longitude ? (
                  <div className="text-green-600">
                    ✔ Lokasi sudah diambil
                    <div className="text-muted-foreground">
                      {form.latitude}, {form.longitude}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Belum ada lokasi. Klik tombol di bawah untuk mengambil GPS.
                  </div>
                )}
              </div>

              {/* INPUT (OPTIONAL, TAPI TETAP ADA) */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      latitude: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longitude: e.target.value,
                    })
                  }
                />
              </div>

              {/* BUTTON GPS UTAMA */}
              <Button
                type="button"
                onClick={handleGetLocation}
                className="w-full"
              >
                📍 Ambil Lokasi Saat Ini
              </Button>

              {/* ERROR */}
              {/* {errors.lokasi && (
                <p className="text-red-500 text-xs">
                  {errors.lokasi}
                </p>
              )} */}
            </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={
              loading ||
              nameExists ||
              checkingName ||
              !form.jenis ||
              !form.deskripsi ||
              !form.kbli ||
              !form.alamat
              // !form.latitude ||
              // !form.longitude
            }
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>

          </div>
        </DialogContent>
      </Dialog>

      {/* NEXT */}
      {list.length > 0 && (
        <div className="flex justify-end">
          <Button asChild>
            <a href="/buat-laporan">
              <FileText className="w-4 h-4 mr-2" />
              Lanjut Buat Laporan
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
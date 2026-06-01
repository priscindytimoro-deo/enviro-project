"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Building2, Save, Pencil, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProfilUsahaPage() {
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [usahaProfile, setUsahaProfile] = useState<any>(null)

  const [formData, setFormData] = useState({
    bentukBadanUsaha: "",
    namaUsahaInstansi: "",
    alamatUsahaInstansi: "",
    nib: "",
    noHp: "", // ✅ TAMBAH FIELD NO HP (tetap ada di form)
  })

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return

      setUser(auth.user)

      // PROFILES
      const { data: prof } = await supabase
        .from("profiles")
        .select("nama_penanggung_jawab, no_hp")
        .eq("id", auth.user.id)
        .single()

      setProfile(prof)

      // USAHA PROFILE
      const { data: usaha } = await supabase
        .from("usaha_profile")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle()

      if (usaha) {
        setUsahaProfile(usaha)
        setShowContinue(true)

        setFormData({
          bentukBadanUsaha: usaha.bentuk_badan_usaha || "",
          namaUsahaInstansi: usaha.nama_usaha_instansi || "",
          alamatUsahaInstansi: usaha.alamat_usaha_instansi || "",
          nib: usaha.nib || "",
          noHp: prof?.no_hp || "",
        })
      } else {
        setFormData((prev) => ({
          ...prev,
          noHp: prof?.no_hp || "",
        }))
      }
    }

    load()
  }, [])

  const isInstansi = formData.bentukBadanUsaha === "Instansi"

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNibChange = (value: string) => {
    const numeric = value.replace(/\D/g, "")
    if (numeric.length <= 13) {
      setFormData((prev) => ({ ...prev, nib: numeric }))
    }
  }

  // ======================
  // SAVE
  // ======================
  const handleSubmit = async () => {
    if (!user) return

    if (!isInstansi && formData.nib && formData.nib.length !== 13) {
      alert("NIB harus 13 digit")
      return
    }

    setLoading(true)

    const payload = {
      user_id: user.id,
      bentuk_badan_usaha: formData.bentukBadanUsaha,
      nama_usaha_instansi: formData.namaUsahaInstansi,
      alamat_usaha_instansi: formData.alamatUsahaInstansi,
      nib: isInstansi ? null : formData.nib || null,
    }

    const query = usahaProfile
      ? supabase.from("usaha_profile").update(payload).eq("user_id", user.id)
      : supabase.from("usaha_profile").insert(payload)

    const { error } = await query

    setLoading(false)

    if (error) {
      console.error(error)
      alert("Gagal menyimpan profil")
      return
    }

    alert("Profil berhasil disimpan")

    setEditMode(false)
    setShowContinue(true)
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Profil Usaha
          </h1>
          <p className="text-muted-foreground">
            Data identitas usaha
          </p>
        </div>

        {usahaProfile && !editMode && (
          <Button onClick={() => setEditMode(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* FORM */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Data Usaha</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">

          {/* BENTUK */}
          <div>
            <Label>Bentuk Badan Usaha</Label>
            <Select
              value={formData.bentukBadanUsaha}
              onValueChange={(v) =>
                handleChange("bentukBadanUsaha", v)
              }
              disabled={!editMode && usahaProfile}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PT">PT</SelectItem>
                <SelectItem value="CV">CV</SelectItem>
                <SelectItem value="Koperasi">Koperasi</SelectItem>
                <SelectItem value="Yayasan">Yayasan</SelectItem>
                <SelectItem value="Perorangan">Perorangan</SelectItem>
                <SelectItem value="Instansi">Instansi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NAMA */}
          <div>
            <Label>Nama Usaha/Instansi</Label>
            <Input
              value={formData.namaUsahaInstansi}
              onChange={(e) =>
                handleChange("namaUsahaInstansi", e.target.value)
              }
              disabled={!editMode && usahaProfile}
            />
          </div>

          {/* ALAMAT */}
          <div className="md:col-span-2">
            <Label>Alamat</Label>
            <Input
              value={formData.alamatUsahaInstansi}
              onChange={(e) =>
                handleChange("alamatUsahaInstansi", e.target.value)
              }
              disabled={!editMode && usahaProfile}
            />
          </div>

          {/* PENANGGUNG JAWAB */}
          <div>
            <Label>Penanggung Jawab</Label>
            <Input
              value={profile?.nama_penanggung_jawab || ""}
              disabled
            />
          </div>

          {/* NO HP (TETAP ADA) */}
          <div>
            <Label>No HP</Label>
            <Input
              value={formData.noHp}
              onChange={(e) =>
                handleChange("noHp", e.target.value)
              }
              disabled
            />
          </div>

          {/* NIB */}
          {!isInstansi && (
            <div className="md:col-span-2">
              <Label>NIB</Label>
              <Input
                value={formData.nib}
                onChange={(e) =>
                  handleNibChange(e.target.value)
                }
                disabled={!editMode && usahaProfile}
                maxLength={13}
                inputMode="numeric"
              />
            </div>
          )}

        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between">

        {/* SIMPAN */}
        {(!usahaProfile || editMode) && (
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        )}

        {/* LANJUTKAN */}
        {showContinue && (
          <Button asChild>
            <a href="/profil-usaha">
              Lanjutkan
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}

      </div>
    </div>
  )
}
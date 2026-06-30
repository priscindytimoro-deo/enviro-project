"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Building2, Save, Pencil, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [usahaProfile, setUsahaProfile] = useState<any>(null)

  const [canContinue, setCanContinue] = useState(false)

  const [formData, setFormData] = useState({
    bentukBadanUsaha: "",
    namaUsahaInstansi: "",
    alamatUsahaInstansi: "",
    nib: "",
    noHp: "",
  })

  const [errors, setErrors] = useState<any>({})

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return

      setUser(auth.user)

      const { data: prof } = await supabase
        .from("profiles")
        .select("nama_penanggung_jawab, no_hp")
        .eq("id", auth.user.id)
        .single()

      setProfile(prof)

      const { data: usaha } = await supabase
        .from("usaha_profile")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle()

      if (usaha) {
        setUsahaProfile(usaha)
        setCanContinue(true)

        setFormData({
          bentukBadanUsaha: usaha.bentuk_badan_usaha || "",
          namaUsahaInstansi: usaha.nama_usaha_instansi || "",
          alamatUsahaInstansi: usaha.alamat_usaha_instansi || "",
          nib: usaha.nib || "",
          noHp: prof?.no_hp || "",
        })
      } else {
        setCanContinue(false)

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
  // VALIDASI
  // ======================
  const validate = () => {
    const err: any = {}

    if (!formData.bentukBadanUsaha)
      err.bentukBadanUsaha = "Wajib dipilih"

    if (!formData.namaUsahaInstansi)
      err.namaUsahaInstansi = "Wajib diisi"

    if (!formData.alamatUsahaInstansi)
      err.alamatUsahaInstansi = "Wajib diisi"

    if (!isInstansi) {
      if (!formData.nib)
        err.nib = "NIB wajib diisi"
      else if (formData.nib.length !== 13)
        err.nib = "NIB harus 13 digit"
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  // ======================
  // SAVE
  // ======================
  const handleSubmit = async () => {
    if (!user) return

    if (!validate()) return

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
      alert("Gagal menyimpan profil")
      return
    }

    alert("Profil berhasil disimpan")

    setEditMode(false)
    setCanContinue(true)
  }

  const isComplete =
    formData.bentukBadanUsaha &&
    formData.namaUsahaInstansi &&
    formData.alamatUsahaInstansi &&
    (isInstansi ? true : formData.nib?.length === 13)

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
            {errors.bentukBadanUsaha && (
              <p className="text-xs text-red-500">{errors.bentukBadanUsaha}</p>
            )}
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
            {errors.namaUsahaInstansi && (
              <p className="text-xs text-red-500">{errors.namaUsahaInstansi}</p>
            )}
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
            {errors.alamatUsahaInstansi && (
              <p className="text-xs text-red-500">{errors.alamatUsahaInstansi}</p>
            )}
          </div>

          {/* PENANGGUNG JAWAB */}
          <div>
            <Label>Penanggung Jawab</Label>
            <Input value={profile?.nama_penanggung_jawab || ""} disabled />
          </div>

          {/* NO HP */}
          <div>
            <Label>No HP</Label>
            <Input value={formData.noHp} disabled />
          </div>

          {/* NIB */}
          {!isInstansi && (
            <div className="md:col-span-2">
              <Label>NIB</Label>
              <Input
                value={formData.nib}
                onChange={(e) => handleNibChange(e.target.value)}
                disabled={!editMode && usahaProfile}
              />
              {errors.nib && (
                <p className="text-xs text-red-500">{errors.nib}</p>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* ACTION */}
      <div className="flex justify-between">

        {/* SIMPAN */}
        {(!usahaProfile || editMode) && (
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        )}

        {/* LANJUTKAN */}
        <Button
          asChild={canContinue}
          disabled={!canContinue}
          className={!canContinue ? "opacity-50 cursor-not-allowed" : ""}
        >
          {canContinue ? (
            <a href="/profil-usaha">
              Lanjutkan
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          ) : (
            <span>
              Lanjutkan
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>

      </div>
    </div>
  )
}
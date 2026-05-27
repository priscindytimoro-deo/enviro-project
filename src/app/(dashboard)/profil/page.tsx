"use client"

import { useState } from "react"

import {
  Building2,
  User,
  MapPin,
  Phone,
  FileText,
  BadgeCheck,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ======================================
// DATA DUMMY DOKUMEN
// ======================================
const documentData = {
  namaUsaha: "PT. Emedical Center Indonesia",
  jenisDokumen: "SPPL",
  nomorTerbit: "DLH.17.02/01/84/2023",
}

export default function ProfilUsahaPage() {

  // ======================================
  // STATE FORM
  // ======================================
  const [formData, setFormData] = useState({

    // IDENTITAS
    bentukBadanUsaha: "PT",
    namaUsaha: documentData.namaUsaha,
    alamatUsaha: "",
    namaPenanggungJawab: "",
    nomorHp: "",

    // KARAKTERISTIK
    jenisUsaha: "",
    kbli: "",
    nib: "",
    koordinat: "",

    // DOKUMEN
    jenisDokumen: documentData.jenisDokumen,
    tanggalTerbit: "",
    nomorDokumen: documentData.nomorTerbit,
  })

  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">

      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Lengkapi Profil Usaha
          </h1>

          <p className="text-muted-foreground">
            Lengkapi informasi usaha dan dokumen lingkungan
          </p>

        </div>

        <Button className="w-full md:w-auto">

          <Save className="mr-2 h-4 w-4" />

          Simpan Profil

        </Button>

      </div>

      {/* ======================================
          ALERT
      ====================================== */}
      <Card className="border-yellow-300 bg-yellow-50">

        <CardContent className="py-5">

          <div className="flex items-start gap-3">

            <BadgeCheck className="h-5 w-5 text-yellow-700 mt-0.5" />

            <div>

              <h2 className="font-semibold text-yellow-800">
                Profil usaha belum lengkap
              </h2>

              <p className="text-sm text-yellow-700 mt-1">
                Lengkapi seluruh data untuk menggunakan
                fitur monitoring dan pelaporan lingkungan.
              </p>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          DATA IDENTITAS
      ====================================== */}
      <Card className="border-border/60 shadow-sm">

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-primary/10 p-3 text-primary">

              <Building2 className="h-5 w-5" />

            </div>

            <div>

              <CardTitle>
                1. Data Identitas Usaha dan/atau Instansi
              </CardTitle>

              <CardDescription className="mt-1">
                Informasi identitas utama usaha atau instansi
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="grid gap-5 md:grid-cols-2">

            {/* BENTUK BADAN USAHA */}
            <div className="space-y-2">

              <Label>
                Bentuk Badan Usaha/Instansi
              </Label>

              <Select
                value={formData.bentukBadanUsaha}
                onValueChange={(value) =>
                  handleChange("bentukBadanUsaha", value)
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="PT">
                    PT
                  </SelectItem>

                  <SelectItem value="CV">
                    CV
                  </SelectItem>

                  <SelectItem value="Koperasi">
                    Koperasi
                  </SelectItem>

                  <SelectItem value="Yayasan">
                    Yayasan
                  </SelectItem>

                  <SelectItem value="Perorangan">
                    Perorangan
                  </SelectItem>

                  <SelectItem value="Dinas">
                    Dinas
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

            {/* NAMA USAHA */}
            <div className="space-y-2">

              <Label>
                Nama Usaha/Instansi
              </Label>

              <Input
                value={formData.namaUsaha}
                onChange={(e) =>
                  handleChange("namaUsaha", e.target.value)
                }
              />

            </div>

            {/* ALAMAT */}
            <div className="space-y-2 md:col-span-2">

              <Label>
                Alamat Usaha/Instansi
              </Label>

              <Input
                placeholder="Masukkan alamat usaha"
                value={formData.alamatUsaha}
                onChange={(e) =>
                  handleChange("alamatUsaha", e.target.value)
                }
              />

            </div>

            {/* PENANGGUNG JAWAB */}
            <div className="space-y-2">

              <Label>
                Nama Penanggung Jawab
              </Label>

              <Input
                placeholder="Masukkan nama penanggung jawab"
                value={formData.namaPenanggungJawab}
                onChange={(e) =>
                  handleChange("namaPenanggungJawab", e.target.value)
                }
              />

            </div>

            {/* NO HP */}
            <div className="space-y-2">

              <Label>
                Nomor HP Penanggung Jawab
              </Label>

              <Input
                placeholder="08xxxxxxxxxx"
                value={formData.nomorHp}
                onChange={(e) =>
                  handleChange("nomorHp", e.target.value)
                }
              />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          KARAKTERISTIK USAHA
      ====================================== */}
      <Card className="border-border/60 shadow-sm">

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-primary/10 p-3 text-primary">

              <FileText className="h-5 w-5" />

            </div>

            <div>

              <CardTitle>
                2. Data Karakteristik Usaha dan/atau Kegiatan
              </CardTitle>

              <CardDescription className="mt-1">
                Informasi karakteristik usaha dan kegiatan
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="grid gap-5 md:grid-cols-2">

            {/* JENIS USAHA */}
            <div className="space-y-2">

              <Label>
                Jenis Usaha dan/atau Kegiatan
              </Label>

              <Input
                placeholder="Contoh: Klinik Kesehatan"
                value={formData.jenisUsaha}
                onChange={(e) =>
                  handleChange("jenisUsaha", e.target.value)
                }
              />

            </div>

            {/* KBLI */}
            <div className="space-y-2">

              <Label>
                KBLI
              </Label>

              <Input
                placeholder="Masukkan KBLI"
                value={formData.kbli}
                onChange={(e) =>
                  handleChange("kbli", e.target.value)
                }
              />

            </div>

            {/* NIB */}
            <div className="space-y-2">

              <Label>
                NIB
              </Label>

              <Input
                placeholder="Masukkan NIB"
                value={formData.nib}
                onChange={(e) =>
                  handleChange("nib", e.target.value)
                }
              />

            </div>

            {/* KOORDINAT */}
            <div className="space-y-2">

              <Label>
                Koordinat Lokasi Usaha dan/atau Kegiatan
              </Label>

              <Input
                placeholder="-10.1772, 123.6070"
                value={formData.koordinat}
                onChange={(e) =>
                  handleChange("koordinat", e.target.value)
                }
              />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          DATA DOKUMEN
      ====================================== */}
      <Card className="border-border/60 shadow-sm">

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-primary/10 p-3 text-primary">

              <FileText className="h-5 w-5" />

            </div>

            <div>

              <CardTitle>
                3. Data Persetujuan Lingkungan
              </CardTitle>

              <CardDescription className="mt-1">
                Informasi dokumen persetujuan lingkungan
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="grid gap-5 md:grid-cols-3">

            {/* JENIS DOKUMEN */}
            <div className="space-y-2">

              <Label>
                Jenis Dokumen
              </Label>

              <Input
                value={formData.jenisDokumen}
                disabled
              />

            </div>

            {/* TANGGAL TERBIT */}
            <div className="space-y-2">

              <Label>
                Tanggal Terbit
              </Label>

              <Input
                type="date"
                value={formData.tanggalTerbit}
                onChange={(e) =>
                  handleChange("tanggalTerbit", e.target.value)
                }
              />

            </div>

            {/* NOMOR DOKUMEN */}
            <div className="space-y-2">

              <Label>
                Nomor Dokumen
              </Label>

              <Input
                value={formData.nomorDokumen}
                disabled
              />

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          ACTION
      ====================================== */}
      <div className="flex justify-end">

        <Button size="lg">

          <Save className="mr-2 h-4 w-4" />

          Simpan Profil

        </Button>

      </div>

    </div>
  )
}
"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  CalendarIcon,
  Upload,
  FileText,
  MapPin,
} from "lucide-react"

import { format } from "date-fns"

export default function BuatLaporanPage() {
  const [tanggalPersetujuan, setTanggalPersetujuan] =
    useState<Date>()

  return (
    <div className="space-y-6">

      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div className="space-y-1">

        <h1 className="text-2xl font-bold tracking-tight">
          Buat Laporan
        </h1>

        <p className="text-muted-foreground">
          Lengkapi data laporan pelaku usaha
        </p>

      </div>

      {/* ======================================
          FORM CARD
      ====================================== */}
      <Card className="border-border/60 shadow-sm">

        <CardHeader>

          <CardTitle>
            Formulir Pelaporan
          </CardTitle>

          <CardDescription>
            Isi seluruh data dengan benar sebelum
            mengirim laporan.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-8">

          {/* ======================================
              INFORMASI PELAKU USAHA
          ====================================== */}
          <div className="space-y-5">

            <div className="flex items-center gap-2">

              <FileText className="h-5 w-5 text-primary" />

              <h2 className="font-semibold">
                Informasi Pelaku Usaha
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAMA */}
              <div className="space-y-2">

                <Label>
                  Nama Usaha
                </Label>

                <Input
                  placeholder="Contoh : Warung Makanan Sehat"
                />

              </div>

              {/* BADAN HUKUM */}
              <div className="space-y-2">

                <Label>
                  Jenis Badan Hukum
                </Label>

                <Select>

                  <SelectTrigger>
                    <SelectValue placeholder="Pilih badan hukum" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="pt">
                      PT
                    </SelectItem>

                    <SelectItem value="cv">
                      CV
                    </SelectItem>

                    <SelectItem value="koperasi">
                      Koperasi
                    </SelectItem>

                    <SelectItem value="yayasan">
                      Yayasan
                    </SelectItem>

                    <SelectItem value="perorangan">
                      Perorangan
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* HP */}
              <div className="space-y-2">

                <Label>
                  No. HP
                </Label>

                <Input
                  placeholder="08xxxxxxxxxx"
                />

              </div>

              {/* EMAIL */}
              <div className="space-y-2">

                <Label>
                  Email
                </Label>

                <Input
                  type="email"
                  placeholder="email@contoh.com"
                />

              </div>

              {/* SEKTOR */}
              <div className="space-y-2 md:col-span-2">

                <Label>
                  Sektor Usaha
                </Label>

                <Input
                  placeholder="Contoh: Perkebunan, Peternakan, Industri"
                />

              </div>

            </div>

          </div>

          {/* ======================================
              DOKUMEN LINGKUNGAN
          ====================================== */}
          <div className="space-y-5">

            <div className="flex items-center gap-2">

              <FileText className="h-5 w-5 text-primary" />

              <h2 className="font-semibold">
                Dokumen Lingkungan
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* JENIS DOKUMEN */}
              <div className="space-y-2">

                <Label>
                  Jenis Dokumen
                </Label>

                <Select>

                  <SelectTrigger>
                    <SelectValue placeholder="Pilih dokumen" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="sppl">
                      SPPL
                    </SelectItem>

                    <SelectItem value="ukl-upl">
                      UKL UPL
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              {/* NOMOR */}
              <div className="space-y-2">

                <Label>
                  Nomor Persetujuan Lingkungan
                </Label>

                <Input
                  placeholder="Nomor persetujuan"
                />

              </div>

              {/* TANGGAL */}
              <div className="space-y-2">

                <Label>
                  Tanggal Persetujuan
                </Label>

                <Popover>

                  <PopoverTrigger asChild>

                    <Button
                      variant="outline"
                      className="
                        w-full justify-start
                        text-left font-normal
                      "
                    >

                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {tanggalPersetujuan ? (
                        format(
                          tanggalPersetujuan,
                          "dd MMMM yyyy"
                        )
                      ) : (
                        <span>
                          Pilih tanggal
                        </span>
                      )}

                    </Button>

                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0"
                  >

                    <Calendar
                      mode="single"
                      selected={tanggalPersetujuan}
                      onSelect={setTanggalPersetujuan}
                    />

                  </PopoverContent>

                </Popover>

              </div>

              {/* PERIODE */}
              <div className="space-y-2">

                <Label>
                  Periode Pelaporan
                </Label>

                <Input
                  placeholder="Contoh: Januari - Juni 2026"
                />

              </div>

            </div>

          </div>

          {/* ======================================
              ALAMAT
          ====================================== */}
          <div className="space-y-5">

            <div className="flex items-center gap-2">

              <MapPin className="h-5 w-5 text-primary" />

              <h2 className="font-semibold">
                Lokasi Usaha
              </h2>

            </div>

            <div className="grid gap-5">

              {/* ALAMAT */}
              <div className="space-y-2">

                <Label>
                  Alamat
                </Label>

                <Textarea
                  placeholder="Masukkan alamat lengkap usaha"
                  className="min-h-[120px]"
                />

              </div>

              {/* KOORDINAT */}
              <div className="space-y-2">

                <Label>
                  Koordinat
                </Label>

                <Input
                  placeholder="-10.1772, 123.6070"
                />

              </div>

            </div>

          </div>

          {/* ======================================
              UPLOAD
          ====================================== */}
          <div className="space-y-5">

            <div className="flex items-center gap-2">

              <Upload className="h-5 w-5 text-primary" />

              <h2 className="font-semibold">
                Upload Dokumen
              </h2>

            </div>

            <div
              className="
                border-2 border-dashed
                border-border
                rounded-xl
                p-8
                text-center
                bg-muted/30
              "
            >

              <Upload className="
                h-10 w-10 mx-auto
                text-muted-foreground mb-4
              " />

              <p className="font-medium">
                Upload Dokumen Laporan
              </p>

              <p className="
                text-sm text-muted-foreground
                mt-1 mb-4
              ">
                PDF, DOCX, atau ZIP maksimal 10MB
              </p>

              <Input
                type="file"
                className="max-w-sm mx-auto"
              />

            </div>

          </div>

          {/* ======================================
              ACTION
          ====================================== */}
          <div className="
            flex flex-col-reverse
            gap-3 pt-4
            sm:flex-row sm:justify-end
          ">

            <Button
              variant="outline"
            >
              Simpan Draft
            </Button>

            <Button>
              Kirim Laporan
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}
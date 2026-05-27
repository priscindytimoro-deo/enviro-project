"use client"

import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  Pencil,
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

export default function ProfilUsahaPage() {
  return (
    <div className="space-y-6 px-4 lg:px-6">

      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            Profil Usaha
          </h1>

          <p className="text-muted-foreground">
            Informasi data pelaku usaha dan penanggung jawab
          </p>

        </div>

        <Button className="w-full md:w-auto">

          <Pencil className="mr-2 h-4 w-4" />

          Edit Profil

        </Button>

      </div>

      {/* ======================================
          PROFILE CARD
      ====================================== */}
      <Card className="border-border/60 shadow-sm">

        <CardHeader>

          <div className="flex items-center gap-4">

            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >

              <Building2 className="h-8 w-8" />

            </div>

            <div>

              <CardTitle className="text-2xl">
                PT Maju Sejahtera
              </CardTitle>

              <CardDescription className="mt-1">
                Pelaku Usaha Terdaftar
              </CardDescription>

            </div>

          </div>

        </CardHeader>

        <CardContent className="space-y-6">

          {/* ======================================
              STATUS
          ====================================== */}
          <div className="flex flex-wrap items-center gap-3">

            <Badge
              className="
                bg-green-100
                text-green-700
                hover:bg-green-100
                dark:bg-green-900/30
                dark:text-green-400
              "
            >

              <BadgeCheck className="mr-1 h-3 w-3" />

              Terverifikasi

            </Badge>

            <Badge variant="secondary">
              Aktif
            </Badge>

          </div>

          <Separator />

          {/* ======================================
              INFORMASI USAHA
          ====================================== */}
          <div className="space-y-5">

            <h2 className="text-lg font-semibold">
              Informasi Usaha
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAMA USAHA */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <Building2 className="h-4 w-4" />

                  <span className="text-sm">
                    Nama Pelaku Usaha
                  </span>

                </div>

                <p className="font-medium">
                  PT Maju Sejahtera
                </p>

              </div>

              {/* BADAN HUKUM */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <FileText className="h-4 w-4" />

                  <span className="text-sm">
                    Jenis Badan Hukum
                  </span>

                </div>

                <p className="font-medium">
                  Perseroan Terbatas (PT)
                </p>

              </div>

              {/* NIB */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <FileText className="h-4 w-4" />

                  <span className="text-sm">
                    Nomor Induk Berusaha (NIB)
                  </span>

                </div>

                <p className="font-medium">
                  1234567890123
                </p>

              </div>

              {/* EMAIL */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <Mail className="h-4 w-4" />

                  <span className="text-sm">
                    Email
                  </span>

                </div>

                <p className="font-medium">
                  pelakuusaha@example.com
                </p>

              </div>

              {/* NO HP */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <Phone className="h-4 w-4" />

                  <span className="text-sm">
                    Nomor HP
                  </span>

                </div>

                <p className="font-medium">
                  081234567890
                </p>

              </div>

            </div>

          </div>

          <Separator />

          {/* ======================================
              PENANGGUNG JAWAB
          ====================================== */}
          <div className="space-y-5">

            <h2 className="text-lg font-semibold">
              Penanggung Jawab
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* NAMA */}
              <div className="space-y-1">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <User className="h-4 w-4" />

                  <span className="text-sm">
                    Nama Penanggung Jawab
                  </span>

                </div>

                <p className="font-medium">
                  Budi Santoso
                </p>

              </div>

              {/* ALAMAT */}
              <div className="space-y-1 md:col-span-2">

                <div className="flex items-center gap-2 text-muted-foreground">

                  <MapPin className="h-4 w-4" />

                  <span className="text-sm">
                    Alamat Penanggung Jawab
                  </span>

                </div>

                <p className="font-medium leading-relaxed">
                  Jl. Timor Raya No. 10,
                  Kelurahan Oebobo,
                  Kota Kupang,
                  Nusa Tenggara Timur
                </p>

              </div>

            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}
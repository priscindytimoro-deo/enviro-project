import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// =========================
// DATA DUMMY DOKUMEN
// =========================
const documentData = {
  namaUsaha: "PT. Emedical Center Indonesia",
  jenisDokumen: "SPPL",
  nomorTerbit: "DLH.17.02/01/84/2023",
}

export default function Dashboard2() {

  console.log(supabase)
  return (
    <div className="flex-1 space-y-6 px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard MONITOR PATUH - LH
          </h1>

          <p className="text-muted-foreground">
            Sistem Monitoring Kepatuhan Lingkungan Hidup
          </p>
        </div>

        <Link href="/profil">
          <Button className="w-full cursor-pointer">
            Lengkapi Profil
          </Button>
        </Link>
      </div>

      {/* ALERT */}
      <Card className="border-yellow-300 bg-yellow-50">
        <CardContent className="py-5">

          <div className="space-y-2">
            <h2 className="font-semibold text-yellow-800">
              ⚠ Profil usaha Anda belum lengkap
            </h2>

            <p className="text-sm text-yellow-700">
              Lengkapi data profil usaha untuk menggunakan
              seluruh fitur sistem monitoring.
            </p>
          </div>

        </CardContent>
      </Card>

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          {/* DATA DOKUMEN */}
          <Card>

            <CardHeader>
              <CardTitle>
                Data Persetujuan Lingkungan
              </CardTitle>

              <CardDescription>
                Data dokumen lingkungan yang ditemukan
                saat aktivasi akun
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="grid gap-6 md:grid-cols-2">

                {/* NAMA USAHA */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Nama Usaha/Instansi
                  </p>

                  <p className="font-medium">
                    {documentData.namaUsaha}
                  </p>
                </div>

                {/* JENIS DOKUMEN */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Jenis Dokumen
                  </p>

                  <p className="font-medium">
                    {documentData.jenisDokumen}
                  </p>
                </div>

                {/* NOMOR TERBIT */}
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Nomor Terbit
                  </p>

                  <p className="font-medium break-all">
                    {documentData.nomorTerbit}
                  </p>
                </div>

              </div>

            </CardContent>
          </Card>

          {/* INFORMASI */}
          <Card>

            <CardHeader>
              <CardTitle>
                Informasi
              </CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">

                <p>
                  Sistem berhasil menemukan dokumen
                  persetujuan lingkungan yang terhubung
                  dengan akun Anda.
                </p>

                <p>
                  Silakan lengkapi data profil usaha
                  untuk melanjutkan penggunaan fitur:
                </p>

                <ul className="list-disc pl-5 space-y-1">
                  <li>Pelaporan semester</li>
                  <li>Monitoring kepatuhan</li>
                  <li>Upload dokumen</li>
                  <li>Notifikasi sistem</li>
                </ul>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* STATUS */}
          <Card>

            <CardHeader>
              <CardTitle>
                Status Akun
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              {/* PROGRESS */}
              <div className="space-y-2">

                <div className="flex items-center justify-between text-sm">
                  <span>Kelengkapan Profil</span>

                  <span className="font-medium">
                    40%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[40%] bg-primary rounded-full" />
                </div>

              </div>

              {/* CHECKLIST */}
              <div className="rounded-xl border bg-muted/50 p-4 space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Aktivasi Akun
                  </span>

                  <span className="text-sm text-green-600 font-medium">
                    Selesai
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Verifikasi Email
                  </span>

                  <span className="text-sm text-green-600 font-medium">
                    Selesai
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Dokumen Lingkungan
                  </span>

                  <span className="text-sm text-green-600 font-medium">
                    Ditemukan
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Profil Usaha
                  </span>

                  <span className="text-sm text-yellow-600 font-medium">
                    Belum Lengkap
                  </span>
                </div>

              </div>

              {/* BUTTON */}
              <Link href="/profil">
                <Button className="w-full cursor-pointer">
                  Lengkapi Profil
                </Button>
              </Link>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
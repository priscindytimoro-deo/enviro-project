import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { supabaseAdmin } from "@/lib/supabase-admin"
import Link from "next/link"
import { Button } from "@/components/ui/button"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Users,
  Building2,
  FileText,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

const { data: users } = await supabaseAdmin
  .from("profiles")
  .select("*")
  .order("created_at", { ascending: false })

  const stats = {
    users: users?.length ?? 0,
    usaha: 0,
    laporan: 0,
  }

  const tingkatKepatuhan = 0

  const latestUsers = users?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-6">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="space-y-1">

        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Admin
        </h1>

        <p className="text-muted-foreground">
          Monitoring dan pengawasan kepatuhan lingkungan hidup
        </p>

      </div>

      {/* ======================================
          TOP CARDS
      ====================================== */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* USERS */}
        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Jumlah Pengguna
            </CardTitle>

            <Users className="size-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {stats.users}
            </div>

          </CardContent>

        </Card>

        {/* USAHA */}
        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Jenis Usaha/Kegiatan
            </CardTitle>

            <Building2 className="size-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {stats.usaha}
            </div>

          </CardContent>

        </Card>

        {/* LAPORAN */}
        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Jumlah Laporan
            </CardTitle>

            <FileText className="size-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {stats.laporan}
            </div>

          </CardContent>

        </Card>

        {/* KEPATUHAN */}
        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Tingkat Kepatuhan
            </CardTitle>

            <ShieldCheck className="size-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-3xl font-bold">
              {tingkatKepatuhan}%
            </div>

          </CardContent>

        </Card>

      </div>

      {/* ======================================
          TABEL LAPORAN TERBARU
      ====================================== */}
      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <div>

            <CardTitle>
              Laporan Terbaru
            </CardTitle>

            <CardDescription>
              Daftar laporan terbaru pelaku usaha
            </CardDescription>

          </div>

          <Button asChild variant="outline">

            <Link href="/admin/report">
              Lihat Selengkapnya
            </Link>

          </Button>

        </CardHeader>
        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left font-medium">
                    Perusahaan
                  </th>

                  <th className="py-3 text-left font-medium">
                    Dokumen
                  </th>

                  <th className="py-3 text-left font-medium">
                    Tanggal
                  </th>

                  <th className="py-3 text-left font-medium">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>

                  <td
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Belum ada data laporan
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          TABEL USER TERBARU
      ====================================== */}
      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <div>

            <CardTitle>
              Pengguna Terbaru
            </CardTitle>

            <CardDescription>
              Daftar pengguna terbaru
            </CardDescription>

          </div>

          <Button asChild variant="outline">

            <Link href="/admin/users">
              Lihat Selengkapnya
            </Link>

          </Button>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left font-medium">
                    Nama Penanggung Jawab
                  </th>

                  <th className="py-3 text-left font-medium">
                    No. HP
                  </th>

                  <th className="py-3 text-left font-medium">
                    Role
                  </th>

                </tr>

              </thead>

              <tbody>

                {latestUsers.length > 0 ? (

                  latestUsers.map((item: any, index: number) => (

                    <tr
                      key={index}
                      className="border-b"
                    >

                      <td className="py-4">
                        {item.nama_penanggung_jawab ?? "-"}
                      </td>

                      <td className="py-4">
                        {item.no_hp ?? "-"}
                      </td>

                      <td className="py-4">

                        <Badge>
                          {item.role}
                        </Badge>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan={3}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Belum ada data pengguna
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}
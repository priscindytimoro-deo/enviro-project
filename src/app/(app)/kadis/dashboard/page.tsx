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

// =========================
// DATA DUMMY
// =========================
const stats = {
  users: 124,
  usaha: 89,
  laporan: 76,
}

const tingkatKepatuhan = Math.round(
  (stats.laporan / stats.usaha) * 100
)

// =========================
// DATA LAPORAN TERBARU
// =========================
const latestReports = [
  {
    perusahaan: "PT Sejahtera Abadi",
    jenis: "UKL-UPL",
    tanggal: "27 Mei 2026",
    status: "Terkirim",
  },
  {
    perusahaan: "CV Hijau Lestari",
    jenis: "SPPL",
    tanggal: "26 Mei 2026",
    status: "Diverifikasi",
  },
  {
    perusahaan: "PT Energi Nusantara",
    jenis: "AMDAL",
    tanggal: "25 Mei 2026",
    status: "Review",
  },
]

// =========================
// DATA USER TERBARU
// =========================
const latestUsers = [
  {
    nama: "PT Maju Bersama",
    email: "ptmaju@gmail.com",
    status: "Aktif",
  },
  {
    nama: "CV Alam Lestari",
    email: "alam@gmail.com",
    status: "Pending",
  },
  {
    nama: "PT Flores Hijau",
    email: "flores@gmail.com",
    status: "Aktif",
  },
]

export default function AdminDashboardPage() {
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

        <CardHeader>

          <CardTitle>
            Laporan Terbaru
          </CardTitle>

          <CardDescription>
            Daftar laporan terbaru pelaku usaha
          </CardDescription>

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

                {latestReports.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="py-4">
                      {item.perusahaan}
                    </td>

                    <td className="py-4">
                      {item.jenis}
                    </td>

                    <td className="py-4">
                      {item.tanggal}
                    </td>

                    <td className="py-4">

                      <Badge>
                        {item.status}
                      </Badge>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

      {/* ======================================
          TABEL USER TERBARU
      ====================================== */}
      <Card>

        <CardHeader>

          <CardTitle>
            User Terbaru
          </CardTitle>

          <CardDescription>
            Pengguna terbaru yang mendaftar
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left font-medium">
                    Nama Perusahaan
                  </th>

                  <th className="py-3 text-left font-medium">
                    Email
                  </th>

                  <th className="py-3 text-left font-medium">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {latestUsers.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="py-4">
                      {item.nama}
                    </td>

                    <td className="py-4">
                      {item.email}
                    </td>

                    <td className="py-4">

                      <Badge
                        variant={
                          item.status === "Aktif"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}
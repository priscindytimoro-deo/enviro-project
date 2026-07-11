import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Users,
  Building2,
  FileText,
  ShieldCheck,
} from "lucide-react"

interface Props {
  users: number
  usaha: number
  laporan: number
}

export function StatsCard({
  users,
  usaha,
  laporan,
}: Props) {
  const kepatuhan = (laporan/usaha)*100

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {/* USER */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Jumlah Pengguna
          </CardTitle>

          <Users className="size-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            {users}
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
            {usaha}
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
            {laporan}
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
            {kepatuhan}%
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
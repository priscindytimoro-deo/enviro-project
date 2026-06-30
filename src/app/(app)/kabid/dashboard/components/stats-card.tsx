import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  FileText,
  Clock,
  Layers,
} from "lucide-react"

interface Props {
  totalLaporan: number
  masuk: number
  proses: number
}

export function StatsCard({
  totalLaporan,
  masuk,
  proses,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">

      {/* TOTAL */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Laporan
          </CardTitle>
          <FileText className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {totalLaporan}
          </div>
        </CardContent>
      </Card>

      {/* MASUK ROLE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Laporan Masuk
          </CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {masuk}
          </div>
        </CardContent>
      </Card>

      {/* PROSES LANJUT */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Proses Lanjutan
          </CardTitle>
          <Layers className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {proses}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
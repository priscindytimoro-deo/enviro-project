"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  CalendarRange,
  Calendar,
  Users,
} from "lucide-react"

import { supabase } from "@/lib/supabase-client"
import { Card, CardContent } from "@/components/ui/card"

type Stats = {
  today_visitors: number
  week_visitors: number
  month_visitors: number
  total_visitors: number
}

export function StatsSection() {
    const [stats, setStats] = useState<Stats>({
    today_visitors: 0,
    week_visitors: 0,
    month_visitors: 0,
    total_visitors: 0,
    })

  useEffect(() => {
    fetchVisitorStats()
  }, [])

async function fetchVisitorStats() {
  const { data, error } = await supabase
    .from("landing_statistics")
    .select("*")
    .single()

  if (error) {
    console.error("Gagal mengambil statistik:", error)
    return
  }

  setStats(data)
}

const cards = [
  {
    icon: CalendarDays,
    value: stats.today_visitors.toLocaleString("id-ID"),
    label: "Pengunjung Hari Ini",
    description: "Jumlah kunjungan hari ini",
  },
  {
    icon: CalendarRange,
    value: stats.week_visitors.toLocaleString("id-ID"),
    label: "Pengunjung 1 Minggu",
    description: "7 hari terakhir",
  },
  {
    icon: Calendar,
    value: stats.month_visitors.toLocaleString("id-ID"),
    label: "Pengunjung 1 Bulan",
    description: "30 hari terakhir",
  },
  {
    icon: Users,
    value: stats.total_visitors.toLocaleString("id-ID"),
    label: "Total Pengunjung",
    description: "Seluruh kunjungan",
  },
]

  return (
    <section
      className="
        relative overflow-hidden
        py-24 sm:py-32
        bg-gradient-to-b
        from-white
        via-green-50/50
        to-white
        dark:from-[#020817]
        dark:via-[#041b11]
        dark:to-[#020817]
      "
    >
      <div
        className="
          absolute top-0 left-0
          w-80 h-80
          bg-green-300/20
          rounded-full blur-3xl
          dark:bg-green-500/10
        "
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="text-center bg-background/60 backdrop-blur-sm border-border/50 py-0"
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-bold">
                    {card.value}
                  </h3>

                  <p className="font-semibold">
                    {card.label}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
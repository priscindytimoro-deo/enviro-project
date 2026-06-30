"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function DashboardUser() {
  const [profile, setProfile] = useState<any>(null)
  const [usahaProfile, setUsahaProfile] = useState<any>(null)
  const [usahaList, setUsahaList] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // FETCH DATA (SAFE VERSION)
  // =========================
  const fetchData = async () => {
    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
      setLoading(false)
      return
    }

    const userId = auth.user.id

    // PROFILE
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    setProfile(prof)

    // USAHA PROFILE
    const { data: usahaProf } = await supabase
      .from("usaha_profile")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()

    setUsahaProfile(usahaProf)

    // USAHA LIST (SAFE)
    let usahaData: any[] = []

    if (usahaProf?.id) {
      const { data: usaha } = await supabase
        .from("usaha_kegiatan")
        .select("*")
        .eq("profile_id", usahaProf.id)

      usahaData = usaha || []
    }

    setUsahaList(usahaData)

    // REPORTS
    const { data: rep } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setReports(rep || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // STEP LOGIC (IMPROVED)
  // =========================
  const steps = [
    {
      label: "Profil User",
      done: !!profile?.nama_penanggung_jawab && !!profile?.no_hp,
      link: "/profil",
    },
    {
      label: "Profil Usaha",
      done: !!usahaProfile?.id,
      link: "/profil",
    },
    {
      label: "Usaha/Kegiatan",
      done: usahaList.length > 0,
      link: "/profil-usaha",
    },
    {
      label: "Laporan",
      done: reports.length > 0,
      link: "/buat-laporan",
    },
  ]

  const completed = steps.filter((s) => s.done).length
  const progress = Math.round((completed / steps.length) * 100)

  // =========================
  // COMPLIANCE FIX (REAL)
  // =========================
  const usahaWithReportStatus = usahaList.map((usaha) => {
    const relatedReports = reports.filter(
      (r) => r.usaha_kegiatan_id === usaha.id
    )

    const latest = relatedReports[0]

    return {
      ...usaha,
      sudahDilaporkan: relatedReports.length > 0,
      statusLaporan: latest?.status_verifikasi || "-",
    }
  })

  const usahaSudahDilaporkan = usahaWithReportStatus.filter(
    (u) => u.sudahDilaporkan
  ).length

  const complianceRate =
    usahaList.length === 0
      ? 0
      : Math.round((usahaSudahDilaporkan / usahaList.length) * 100)

  const latestReport = reports[0]

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Memuat dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6 py-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Selamat datang, {profile?.nama_penanggung_jawab}
        </h1>

        <p className="text-muted-foreground">
          Progress: {progress}% • Kepatuhan: {complianceRate}%
        </p>
      </div>

      {/* STEP PROGRESS */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Sistem</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex justify-between border rounded-lg p-3"
            >
              <div className="flex gap-3 items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${
                    step.done ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </div>

                <div>
                  <p className="font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.done ? "Selesai" : "Belum"}
                  </p>
                </div>
              </div>

              {!step.done && (
                <Link href={step.link}>
                  <Button size="sm">Lengkapi</Button>
                </Link>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* KPI */}
      <Card>
        <CardHeader>
          <CardTitle>Tingkat Kepatuhan</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{complianceRate}%</p>

          <p className="text-sm text-muted-foreground">
            {usahaSudahDilaporkan} dari {usahaList.length} usaha sudah dilaporkan
          </p>
        </CardContent>
      </Card>

      {/* STATUS USAHA */}
      <Card>
        <CardHeader>
          <CardTitle>Status Usaha & Laporan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {usahaWithReportStatus.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada usaha/kegiatan
            </p>
          ) : (
            usahaWithReportStatus.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">
                    {item.jenis_usaha_kegiatan}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    KBLI: {item.kbli}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.sudahDilaporkan
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.sudahDilaporkan
                      ? item.statusLaporan
                      : "Belum Dilaporkan"}
                  </span>

                  {!item.sudahDilaporkan && (
                    <Link href="/buat-laporan">
                      <Button size="sm">Lapor</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Laporan Terbaru</CardTitle>
        </CardHeader>

        <CardContent>
          {latestReport ? (
            <div className="text-sm space-y-2">
              <p>
                📄 Status: <b>{latestReport.status_verifikasi}</b>
              </p>

              <p className="text-muted-foreground">
                Draft → Proses → Verifikasi → Selesai
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Belum ada laporan
            </p>
          )}
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-end">
        <Link href="/buat-laporan">
          <Button disabled={progress < 100}>
            Buat Laporan
          </Button>
        </Link>
      </div>

    </div>
  )
}
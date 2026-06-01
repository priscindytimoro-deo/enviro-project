"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// =========================
// TYPE
// =========================
interface Profile {
  id: string
  nama_penanggung_jawab: string
  no_hp: string
}

export default function DashboardUser() {

  const [profile, setProfile] = useState<Profile | null>(null)
  const [usahaProfile, setUsahaProfile] = useState<any>(null)
  const [usahaList, setUsahaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // LOAD ALL DATA
  // =========================
  const fetchData = async () => {

    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()

    if (!auth.user) {
      setLoading(false)
      return
    }

    // 1. PROFILE
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", auth.user.id)
      .single()

    setProfile(prof)

    // 2. USAHA PROFILE
    const { data: usahaProf } = await supabase
      .from("usaha_profile")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle()

    setUsahaProfile(usahaProf)

    // 3. USAHA LIST
    const { data: usaha } = await supabase
      .from("usaha_kegiatan")
      .select("*")
      .eq("profile_id", auth.user.id)

    setUsahaList(usaha || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // STATUS LOGIC
  // =========================
  const isProfileComplete =
    !!profile?.nama_penanggung_jawab &&
    !!profile?.no_hp

  const isUsahaComplete = !!usahaProfile

  const isUsahaKegiatanComplete = usahaList.length > 0

  const progress =
    (Number(isProfileComplete) +
      Number(isUsahaComplete) +
      Number(isUsahaKegiatanComplete)) * 33

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
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
          Progress kelengkapan Anda: {progress}%
        </p>
      </div>

      {/* PROGRESS CARD */}
      <Card>
        <CardContent className="p-6 space-y-3">

          <p>Profil: {isProfileComplete ? "✔" : "❌"}</p>
          <p>Data Usaha/Kegiatan: {isUsahaComplete ? "✔" : "❌"}</p>
          <p>Jenis Usaha: {isUsahaKegiatanComplete ? "✔" : "❌"}</p>

        </CardContent>
      </Card>

      {/* ALERT */}
      {progress < 100 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-5 space-y-2">

            <p className="font-semibold">
              ⚠ Data belum lengkap
            </p>

            <p className="text-sm">
              Lengkapi semua tahap untuk bisa membuat laporan
            </p>

            <Link href="/profil">
              <Button>Mulai Lengkapi</Button>
            </Link>

          </CardContent>
        </Card>
      )}

      {/* QUICK ACTION */}
      <div className="grid md:grid-cols-3 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/profil">
              <Button className="w-full">Isi Profil</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usaha</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/profil-usaha">
              <Button className="w-full">Data Usaha</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/buat-laporan">
              <Button className="w-full" disabled={progress < 100}>
                Buat Laporan
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}
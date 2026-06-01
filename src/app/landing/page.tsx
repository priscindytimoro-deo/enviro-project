import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { LandingPageContent } from "./landing-page-content"

// ======================
// METADATA
// ======================
export const metadata: Metadata = {
  title:
    "Monitor Patuh-LH | Monitoring Kepatuhan Laporan Berkala Pelaku Usaha – DLH TTS",

  description:
    "Monitor Patuh-LH merupakan platform digital Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan untuk memantau kepatuhan pelaku usaha dalam penyampaian laporan berkala lingkungan hidup secara transparan, terintegrasi, dan akuntabel.",

  keywords: [
    "monitor patuh lh",
    "dashboard monitoring kepatuhan",
    "kepatuhan pelaku usaha",
    "laporan berkala lingkungan hidup",
    "DLH TTS",
    "SPPL",
    "UKL-UPL",
    "AMDAL",
  ],

  authors: [
    {
      name: "Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan",
    },
  ],
}

// ======================
// PAGE
// ======================
export default async function LandingPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    const role = profile?.role

    if (role === "admin") redirect("/admin/dashboard")
    if (role === "kadis") redirect("/kadis/dashboard")
    if (role === "kabid") redirect("/kabid/dashboard")
    if (role === "pengawas") redirect("/pengawas/dashboard")

    redirect("/dashboard")
  }

  // ======================
  // TAMPILKAN LANDING
  // ======================
  return <LandingPageContent />
}
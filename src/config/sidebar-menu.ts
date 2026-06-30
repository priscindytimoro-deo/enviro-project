import {
  LayoutDashboard,
  Users,
  FileText,
  User,
  ShieldCheck,
  Monitor,
  ShieldQuestionMark,
  BriefcaseBusiness,
} from "lucide-react"

// =========================
// ADMIN (TETAP)
// =========================
export const adminMenu = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pengguna",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Laporan",
    url: "/admin/report",
    icon: ShieldCheck,
  },
  {
    title: "Monitor",
    url: "/admin/monitor",
    icon: Monitor,
  },
]

// =========================
// USER (TETAP)
// =========================
export const userMenu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profil",
    url: "/profil",
    icon: User,
  },
  {
    title: "Jenis Usaha/Kegiatan",
    url: "/profil-usaha",
    icon: BriefcaseBusiness,
  },
  {
    title: "Buat Laporan",
    url: "/buat-laporan",
    icon: FileText,
  },
  {
    title: "Cek Laporan",
    url: "/cek-laporan",
    icon: ShieldQuestionMark,
  },
]

// =========================
// KEPALA DINAS (KADIS)
// =========================
export const kadisMenu = [
  {
    title: "Dashboard",
    url: "/kadis/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Laporan",
    url: "/kadis/report",
    icon: FileText,
  },
  {
    title: "Monitor",
    url: "/kadis/monitor",
    icon: Monitor,
  },
]

// =========================
// KEPALA BIDANG (KABID)
// =========================
export const kabidMenu = [
  {
    title: "Dashboard",
    url: "/kabid/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Laporan",
    url: "/kabid/report",
    icon: FileText,
  },
  {
    title: "Monitor",
    url: "/kabid/monitor",
    icon: Monitor,
  },
]

// =========================
// PENGAWAS
// =========================
export const pengawasMenu = [
  {
    title: "Dashboard",
    url: "/pengawas/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Laporan",
    url: "/pengawas/report",
    icon: FileText,
  },
  {
    title: "Monitor",
    url: "/pengawas/monitor",
    icon: Monitor,
  },
]
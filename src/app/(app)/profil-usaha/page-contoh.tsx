// "use client"

// import { useState } from "react"
// import ProfilTab from "@/app/(app)/profil-usaha/components/profileTab"
// import LaporanTab from "@/app/(app)/profil-usaha/components/LaporanTab"
// import RiwayatTab from "@/app/(app)/profil-usaha/components/RiwayatTab"

// import { useProfile } from "@/app/(app)/profil-usaha/hooks/useProfile"
// import { useUsaha } from "@/app/(app)/profil-usaha/hooks/useUsaha"
// import { useReports } from "@/app/(app)/profil-usaha/hooks/useReports"

// export default function Page() {
//   const [tab, setTab] = useState("profil")

//   const { user, profile } = useProfile()
//   const { list } = useUsaha(profile?.id)
//   const { reports } = useReports(user?.id)

//   return (
//     <div className="space-y-4">

//       {/* TAB NAV */}
//       <div className="flex gap-2">
//         <button onClick={() => setTab("profil")}>Profil</button>
//         <button onClick={() => setTab("laporan")}>Laporan</button>
//         <button onClick={() => setTab("riwayat")}>Riwayat</button>
//       </div>

//       {/* CONTENT */}
//       {tab === "profil" && (
//         <ProfilTab list={list} />
//       )}

//       {tab === "laporan" && (
//         <LaporanTab user={user} profile={profile} />
//       )}

//       {tab === "riwayat" && (
//         <RiwayatTab reports={reports} />
//       )}

//     </div>
//   )
// }
"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  adminMenu,
  userMenu,
  kadisMenu,
  kabidMenu,
  pengawasMenu,
} from "@/config/sidebar-menu"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  const pathname = usePathname()

  // =========================
  // ROLE DETECTION
  // =========================
  const getRoleFromPath = (path: string) => {

    if (path.startsWith("/admin")) return "admin"
    if (path.startsWith("/kadis")) return "kadis"
    if (path.startsWith("/kabid")) return "kabid"
    if (path.startsWith("/pengawas")) return "pengawas"

    return "user"
  }

  const role = getRoleFromPath(pathname)

  // =========================
  // MENU BY ROLE
  // =========================
  const menu =
    role === "admin"
      ? adminMenu
      : role === "kadis"
        ? kadisMenu
        : role === "kabid"
          ? kabidMenu
          : role === "pengawas"
            ? pengawasMenu
            : userMenu

  // =========================
  // USER DISPLAY
  // =========================
  const userData = {
    name:
      role === "admin"
        ? "Administrator"
        : role === "kadis"
          ? "Kepala Dinas"
          : role === "kabid"
            ? "Kepala Bidang"
            : role === "pengawas"
              ? "Pengawas"
              : "Pelaku Usaha",

    email:
      role === "admin"
        ? "admin@mplh-dlhtts.vercel.app"
        : role === "kadis"
          ? "kadis@mplh-dlhtts.vercel.app"
          : role === "kabid"
            ? "kabid@mplh-dlhtts.vercel.app"
            : role === "pengawas"
              ? "pengawas@mplh-dlhtts.vercel.app"
              : "user@mplh-dlhtts.vercel.app",

    avatar: "/logo.svg",
  }

  return (
    <Sidebar {...props}>

      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>

              <Link
                href={
                  role === "admin"
                    ? "/admin/dashboard"
                    : role === "kadis"
                      ? "/kadis/dashboard"
                      : role === "kabid"
                        ? "/kabid/dashboard"
                        : role === "pengawas"
                          ? "/pengawas/dashboard"
                          : "/dashboard"
                }
              >

                <div className="flex aspect-square size-9 items-center justify-center rounded-lg border bg-background overflow-hidden">
                  <Image
                    src="/logo.svg"
                    alt="Monitor LH"
                    width={28}
                    height={28}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    MONITOR PATUH LH
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    {userData.name}
                  </span>
                </div>

              </Link>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <NavMain label="Menu Utama" items={menu} />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>

    </Sidebar>
  )
}
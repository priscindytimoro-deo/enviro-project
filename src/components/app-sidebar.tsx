"use client"

import * as React from "react"
import Image from "next/image"

import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Bell,
  Settings,
} from "lucide-react"

import Link from "next/link"

import { SidebarNotification } from "@/components/sidebar-notification"

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

const data = {
  user: {
    name: "PT Sejahtera",
    email: "pelakuusaha@example.com",
    avatar: "/logo.svg",
  },

  navGroups: [
    {
      label: "Menu Utama",

      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },

        {
          title: "Profil Usaha",
          url: "/profil-usaha",
          icon: FileText,
        },

        {
          title: "Buat Laporan",
          url: "/buat-laporan",
          icon: FileText,
        },

        {
          title: "Cek Laporan",
          url: "/cek-laporan",
          icon: ClipboardList,
        },

        {
          title: "Pengaturan",
          url: "/pengaturan",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>

      {/* ======================================
          SIDEBAR HEADER
      ====================================== */}
      <SidebarHeader>

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton size="lg" asChild>

              <Link href="/dashboard">

                {/* LOGO */}
                <div className="
                  flex aspect-square size-9
                  items-center justify-center
                  rounded-lg border
                  bg-background overflow-hidden
                ">

                  <Image
                    src="/logo.svg"
                    alt="Monitor Patuh LH"
                    width={28}
                    height={28}
                    className="object-contain"
                    priority
                  />

                </div>

                {/* TITLE */}
                <div className="
                  grid flex-1 text-left
                  text-sm leading-tight
                ">

                  <span className="truncate font-semibold">
                    MONITOR PATUH LH
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    Pelaku Usaha
                  </span>

                </div>

              </Link>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarHeader>

      {/* ======================================
          SIDEBAR CONTENT
      ====================================== */}
      <SidebarContent>

        {data.navGroups.map((group) => (

          <NavMain
            key={group.label}
            label={group.label}
            items={group.items}
          />

        ))}

      </SidebarContent>

      {/* ======================================
          SIDEBAR FOOTER
      ====================================== */}
      <SidebarFooter>

        <SidebarNotification />

        <NavUser user={data.user} />

      </SidebarFooter>

    </Sidebar>
  )
}
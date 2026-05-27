"use client"

import { ModeToggle } from "@/components/mode-toggle"

import {
  Separator,
} from "@/components/ui/separator"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header
      className="
        flex h-(--header-height)
        shrink-0 items-center
        border-b bg-background
        transition-[width,height]
        ease-linear
        group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
      "
    >

      <div className="
        flex w-full items-center
        px-4 py-3 lg:px-6
      ">

        {/* SIDEBAR BUTTON */}
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-3 data-[orientation=vertical]:h-4"
        />

        {/* PAGE TITLE */}
        <div className="flex flex-col">

          <h1 className="text-sm font-semibold tracking-tight">
            Dashboard Pelaku Usaha
          </h1>

          <p className="text-xs text-muted-foreground">
            MONITOR PATUH LH
          </p>

        </div>

        {/* RIGHT ACTION */}
        <div className="ml-auto flex items-center gap-2">

          <ModeToggle />

        </div>

      </div>

    </header>
  )
}
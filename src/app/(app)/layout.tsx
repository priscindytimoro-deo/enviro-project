"use client";

import React from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { useSidebarConfig } from "@/hooks/use-sidebar-config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config } = useSidebarConfig();

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "4rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
      className={`
        min-h-screen
        bg-background
        text-foreground

        [--sidebar:var(--color-sidebar)]
        [--sidebar-foreground:var(--color-sidebar-foreground)]

        [--sidebar-primary:var(--color-primary)]
        [--sidebar-primary-foreground:var(--color-primary-foreground)]

        [--sidebar-accent:var(--color-accent)]
        [--sidebar-accent-foreground:var(--color-accent-foreground)]

        [--sidebar-border:var(--color-border)]
        [--sidebar-ring:var(--color-ring)]

        ${config.collapsible === "none"
          ? "sidebar-none-mode"
          : ""}
      `}
    >

      {/* ======================================
          LEFT SIDEBAR
      ====================================== */}
      {config.side === "left" ? (
        <>

          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />

          <SidebarInset
            className="
              flex min-h-screen flex-col
              bg-background
            "
          >

            {/* HEADER */}
            <SiteHeader />

            {/* MAIN CONTENT */}
            <main
              className="
                flex-1
                bg-background
              "
            >

              <div
                className="
                  @container/main
                  flex flex-col
                  gap-4
                  px-4 py-4
                  md:px-6 md:py-6
                  lg:px-8
                "
              >
                {children}
              </div>

            </main>

            {/* FOOTER */}
            <SiteFooter />

          </SidebarInset>

        </>
      ) : (
        <>
          {/* ======================================
              RIGHT SIDEBAR
          ====================================== */}
          <SidebarInset
            className="
              flex min-h-screen flex-col
              bg-background
            "
          >

            {/* HEADER */}
            <SiteHeader />

            {/* MAIN CONTENT */}
            <main
              className="
                flex-1
                bg-background
              "
            >

              <div
                className="
                  @container/main
                  flex flex-col
                  gap-4
                  px-4 py-4
                  md:px-6 md:py-6
                  lg:px-8
                "
              >
                {children}
              </div>

            </main>

            {/* FOOTER */}
            <SiteFooter />

          </SidebarInset>

          <AppSidebar
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />

        </>
      )}

    </SidebarProvider>
  );
}
"use client"

import {
  EllipsisVertical,
  LogOut,
  CircleUser,
} from "lucide-react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase-client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  // HANDLE LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/sign-in")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <DropdownMenu>

          {/* TRIGGER */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >

              {/* LOGO */}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              {/* USER INFO */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name}
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <EllipsisVertical className="ml-auto size-4" />

            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* MENU */}
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >

            {/* HEADER */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2">

                <div className="h-8 w-8 overflow-hidden rounded-lg">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.name}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* MENU UTAMA */}
            <DropdownMenuGroup>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings/account">
                  <CircleUser className="mr-2 size-4" />
                  Pengaturan Akun
                </Link>
              </DropdownMenuItem>

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* LOGOUT */}
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
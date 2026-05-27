"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "@/hooks/use-theme"

const navigationItems = [
  { name: "Beranda", href: "#hero" },
  { name: "SOP", href: "#features" },
  { name: "Edukasi Lingkungan", href: "#faq" },
  { name: "Dokumen", href: "#team" },
  { name: "Kontak", href: "#footer" },
]

const smoothScrollTo = (targetId: string) => {
  if (targetId.startsWith("#")) {
    const element = document.querySelector(targetId)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">

        {/* ======================================
            LOGO
        ====================================== */}
        <div className="flex items-center space-x-2">

          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer"
          >

            <Image
              src="/logo.svg"
              alt="Monitor Patuh LH"
              width={44}
              height={44}
              priority
              className="
                object-contain
                transition-all
                duration-300
                hover:scale-105
                drop-shadow-sm
                dark:brightness-110
                dark:drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]
              "
            />

            <div className="flex flex-col leading-none">

              <span className="font-extrabold text-lg tracking-tight">

                <span className="text-green-700 dark:text-green-400">
                  MONITOR
                </span>{" "}

                <span className="text-red-600 dark:text-red-400">
                  PATUH
                </span>

                <span className="text-primary">
                  {" "}LH
                </span>

              </span>

              <span className="text-xs text-muted-foreground tracking-wide">
                Lingkungan Hidup
              </span>

            </div>

          </Link>

        </div>

        {/* ======================================
            DESKTOP NAVIGATION
        ====================================== */}
        <NavigationMenu className="hidden xl:flex">

          <NavigationMenuList>

            {navigationItems.map((item) => (

              <NavigationMenuItem key={item.name}>

                <NavigationMenuLink
                  className="
                    group inline-flex h-10 w-max
                    items-center justify-center
                    px-4 py-2
                    text-sm font-medium
                    transition-colors
                    hover:text-primary
                    focus:text-primary
                    focus:outline-none
                    cursor-pointer
                  "
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault()

                    if (item.href.startsWith("#")) {
                      smoothScrollTo(item.href)
                    } else {
                      window.location.href = item.href
                    }
                  }}
                >
                  {item.name}
                </NavigationMenuLink>

              </NavigationMenuItem>

            ))}

          </NavigationMenuList>

        </NavigationMenu>

        {/* ======================================
            DESKTOP ACTIONS
        ====================================== */}
        <div className="hidden xl:flex items-center space-x-2">

          <ModeToggle variant="ghost" />

          <Button
            variant="ghost"
            asChild
            className="cursor-pointer"
          >
            <Link href="/sign-in">
              Masuk
            </Link>
          </Button>

          <Button
            asChild
            className="cursor-pointer 
                  font-bold
                  bg-green-700
                  hover:bg-green-800
                  text-white

                  dark:bg-yellow-400
                  dark:hover:bg-yellow-300
                  dark:text-black"
          >
            <Link href="/sign-up">
              Daftar
            </Link>
          </Button>

        </div>

        {/* ======================================
            MOBILE MENU
        ====================================== */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>

          <SheetTrigger asChild className="xl:hidden">

            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
            >
              <Menu className="h-5 w-5" />

              <span className="sr-only">
                Toggle menu
              </span>

            </Button>

          </SheetTrigger>

          <SheetContent
            side="right"
            className="
              w-full sm:w-[400px]
              p-0 gap-0
              [&>button]:hidden
              overflow-hidden
              flex flex-col
            "
          >

            <div className="flex flex-col h-full">

              {/* ======================================
                  MOBILE HEADER
              ====================================== */}
              <SheetHeader className="space-y-0 p-4 pb-2 border-b">

                <SheetTitle className="sr-only">
                  Mobile Navigation Menu
                </SheetTitle>

                <div className="flex items-center justify-between w-full">

                  {/* MOBILE LOGO */}
                  <Link
                    href="/"
                    className="flex items-center gap-3"
                  >

                    <Image
                      src="/logo.svg"
                      alt="Monitor Patuh LH"
                      width={42}
                      height={42}
                      priority
                      className="
                        object-contain
                        transition-all
                        duration-300
                        hover:scale-105
                        drop-shadow-sm
                        dark:brightness-110
                        dark:drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]
                      "
                    />

                    <div className="flex flex-col leading-none">

                      <span className="font-extrabold text-lg tracking-tight">

                        <span className="text-green-700 dark:text-green-400">
                          MONITOR
                        </span>{" "}

                        <span className="text-red-600 dark:text-red-400">
                          PATUH
                        </span>

                        <span className="text-primary">
                          {" "}LH
                        </span>

                      </span>

                      <span className="text-xs text-muted-foreground tracking-wide">
                        Lingkungan Hidup
                      </span>

                    </div>

                  </Link>

                  {/* MOBILE ACTIONS */}
                  <div className="flex items-center gap-2">

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                      }
                      className="cursor-pointer h-8 w-8"
                    >

                      <Moon className="
                        h-4 w-4
                        rotate-0 scale-100
                        transition-all
                        dark:-rotate-90
                        dark:scale-0
                      " />

                      <Sun className="
                        absolute h-4 w-4
                        rotate-90 scale-0
                        transition-all
                        dark:rotate-0
                        dark:scale-100
                      " />

                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="cursor-pointer h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                  </div>

                </div>

              </SheetHeader>

              {/* ======================================
                  MOBILE NAVIGATION
              ====================================== */}
              <div className="flex-1 overflow-y-auto">

                <nav className="p-6 space-y-1">

                  {navigationItems.map((item) => (

                    <div key={item.name}>

                      <a
                        href={item.href}
                        className="
                          flex items-center
                          px-4 py-3
                          text-base font-medium
                          rounded-lg
                          transition-colors
                          hover:bg-accent
                          hover:text-accent-foreground
                          cursor-pointer
                        "
                        onClick={(e) => {
                          setIsOpen(false)

                          if (item.href.startsWith("#")) {
                            e.preventDefault()

                            setTimeout(() => {
                              smoothScrollTo(item.href)
                            }, 100)
                          }
                        }}
                      >
                        {item.name}
                      </a>

                    </div>

                  ))}

                  {/* ======================================
                      MOBILE AUTH BUTTONS
                  ====================================== */}
                  <div className="pt-6 space-y-3">

                    <Button
                      variant="outline"
                      asChild
                      className="w-full"
                    >
                      <Link
                        href="/auth/sign-in"
                        onClick={() => setIsOpen(false)}
                      >
                        Masuk
                      </Link>
                    </Button>

                    <Button
                      asChild
                      className="w-full
                  font-bold
                  bg-green-700
                  hover:bg-green-800
                  text-white

                  dark:bg-yellow-400
                  dark:hover:bg-yellow-300
                  dark:text-black"
                    >
                      <Link
                        href="/sign-up"
                        onClick={() => setIsOpen(false)}
                      >
                        Daftar
                      </Link>
                    </Button>

                  </div>

                </nav>

              </div>

            </div>

          </SheetContent>

        </Sheet>

      </div>

    </header>
  )
}

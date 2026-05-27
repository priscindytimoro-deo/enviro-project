"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  BellRing,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="
        relative overflow-hidden
        bg-gradient-to-br
        from-green-100
        via-white
        to-emerald-100

        dark:from-[#041b11]
        dark:via-[#062617]
        dark:to-[#0b3b24]

        text-slate-900
        dark:text-white
        transition-colors duration-500
      "
    >
      {/* ======================================
          BACKGROUND EFFECT
      ====================================== */}
      <div className="absolute inset-0 overflow-hidden">

        {/* LIGHT MODE */}
        <div
          className="
            absolute top-0 left-0
            w-96 h-96
            bg-green-300/30
            rounded-full blur-3xl

            dark:hidden
          "
        />

        <div
          className="
            absolute bottom-0 right-0
            w-[32rem] h-[32rem]
            bg-emerald-300/30
            rounded-full blur-3xl

            dark:hidden
          "
        />

        {/* DARK MODE */}
        <div
          className="
            hidden dark:block
            absolute top-0 left-0
            w-[30rem] h-[30rem]
            bg-green-500/10
            rounded-full blur-3xl
          "
        />

        <div
          className="
            hidden dark:block
            absolute bottom-0 right-0
            w-[35rem] h-[35rem]
            bg-lime-400/10
            rounded-full blur-3xl
          "
        />

      </div>

      {/* GRID OVERLAY */}
      <div
        className="
          absolute inset-0
          opacity-[0.04]
          dark:opacity-[0.06]
          bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          bg-[size:80px_80px]
        "
      />

      <div
        className="
          container relative z-10
          mx-auto
          px-4 sm:px-6 lg:px-8
          py-20 lg:py-28
        "
      >
        <div
          className="
            grid grid-cols-1
            lg:grid-cols-2
            gap-16
            items-center
          "
        >

          {/* ======================================
              LEFT CONTENT
          ====================================== */}
          <div className="space-y-8">

            {/* BADGE */}
            <div
              className="
                inline-flex items-center gap-2
                rounded-full
                border border-green-200
                bg-white/80
                backdrop-blur-md
                px-4 py-2
                text-sm font-semibold
                shadow-sm

                dark:border-white/10
                dark:bg-white/10
              "
            >
              <ShieldCheck
                className="
                  h-4 w-4
                  text-green-600
                  dark:text-lime-300
                "
              />

              <span
                className="
                  text-slate-700
                  dark:text-white/90
                "
              >
                Sistem Monitoring Lingkungan Hidup
              </span>

            </div>

            {/* HEADING */}
            <div className="space-y-5">

              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  lg:text-6xl
                  font-black
                  leading-tight
                  tracking-tight
                "
              >
                MONITOR{" "}

                <span
                  className="
                    text-green-700
                    dark:text-yellow-300
                  "
                >
                  PATUH - LH
                </span>

              </h1>

              <p
                className="
                  text-lg sm:text-xl
                  text-slate-600
                  dark:text-white/75
                  leading-relaxed
                  max-w-2xl
                "
              >
                Platform digital monitoring kepatuhan lingkungan hidup
                untuk pengajuan, verifikasi, monitoring dokumen,
                notifikasi, dan pengelolaan data secara terintegrasi.
              </p>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* CARD 1 */}
              <div
                className="
                  rounded-2xl
                  border border-green-100
                  bg-white/80
                  backdrop-blur-md
                  p-5
                  shadow-lg

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <FileCheck2
                  className="
                    h-8 w-8 mb-3
                    text-green-600
                    dark:text-lime-300
                  "
                />

                <h3
                  className="
                    font-bold text-lg
                    text-slate-800
                    dark:text-white
                  "
                >
                  Verifikasi Cepat
                </h3>

                <p
                  className="
                    text-sm mt-1
                    text-slate-600
                    dark:text-white/70
                  "
                >
                  Validasi dan proses dokumen lebih efisien.
                </p>

              </div>

              {/* CARD 2 */}
              <div
                className="
                  rounded-2xl
                  border border-green-100
                  bg-white/80
                  backdrop-blur-md
                  p-5
                  shadow-lg

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <BellRing
                  className="
                    h-8 w-8 mb-3
                    text-yellow-500
                    dark:text-yellow-300
                  "
                />

                <h3
                  className="
                    font-bold text-lg
                    text-slate-800
                    dark:text-white
                  "
                >
                  Notifikasi Real-time
                </h3>

                <p
                  className="
                    text-sm mt-1
                    text-slate-600
                    dark:text-white/70
                  "
                >
                  Informasi proses langsung ke pengguna.
                </p>

              </div>

              {/* CARD 3 */}
              <div
                className="
                  rounded-2xl
                  border border-green-100
                  bg-white/80
                  backdrop-blur-md
                  p-5
                  shadow-lg

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <ShieldCheck
                  className="
                    h-8 w-8 mb-3
                    text-emerald-600
                    dark:text-emerald-300
                  "
                />

                <h3
                  className="
                    font-bold text-lg
                    text-slate-800
                    dark:text-white
                  "
                >
                  Aman & Terintegrasi
                </h3>

                <p
                  className="
                    text-sm mt-1
                    text-slate-600
                    dark:text-white/70
                  "
                >
                  Data tersimpan aman dan mudah diakses.
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">

              <Button
                size="lg"
                asChild
                className="
                  rounded-xl
                  h-12 px-7
                  font-bold
                  bg-green-700
                  hover:bg-green-800
                  text-white

                  dark:bg-yellow-400
                  dark:hover:bg-yellow-300
                  dark:text-black
                "
              >
                <Link href="/sign-up">

                  Mulai Sekarang

                  <ArrowRight className="ml-2 h-4 w-4" />

                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="
                  rounded-xl
                  h-12 px-7

                  border-green-300
                  bg-white/70
                  hover:bg-white
                  text-slate-800

                  dark:border-white/20
                  dark:bg-white/5
                  dark:text-white
                  dark:hover:bg-white/10
                  dark:hover:text-white
                "
              >
                <Link href="/dashboard">
                  Masuk
                </Link>
              </Button>

            </div>

          </div>

          {/* ======================================
              RIGHT CONTENT
          ====================================== */}
          <div className="relative">

            {/* MAIN CARD */}
            <div
              className="
                relative overflow-hidden
                rounded-[2rem]
                border border-green-100
                bg-white/80
                backdrop-blur-2xl
                shadow-[0_20px_80px_rgba(0,0,0,0.12)]

                dark:border-white/10
                dark:bg-white/5
                dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]
              "
            >

              {/* TOP BAR */}
              <div
                className="
                  flex items-center gap-2
                  px-6 py-4
                  border-b border-slate-200
                  bg-slate-50/80

                  dark:border-white/10
                  dark:bg-white/5
                "
              >
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* IMAGE */}
              <div className="p-5 lg:p-7">

                <div
                  className="
                    relative overflow-hidden
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    shadow-xl

                    dark:border-white/10
                    dark:bg-[#0d1f17]
                  "
                >
                  <Image
                    src="/logo.svg"
                    alt="Monitor Patuh LH Dashboard"
                    width={1200}
                    height={800}
                    priority
                    className="
                      w-full h-auto
                      object-contain
                      p-10
                    "
                  />
                </div>

              </div>

            </div>

            {/* FLOATING CARD */}
            <div
              className="
                absolute
                -left-8 top-10
                hidden lg:flex
                items-center gap-3

                rounded-2xl
                px-5 py-4

                bg-white
                border border-slate-200
                shadow-2xl

                dark:bg-[#10271b]
                dark:border-white/10
                dark:text-white
              "
            >
              <div
                className="
                  flex items-center justify-center
                  w-12 h-12 rounded-xl
                  bg-green-100

                  dark:bg-green-500/10
                "
              >
                <ShieldCheck
                  className="
                    h-6 w-6
                    text-green-700
                    dark:text-green-300
                  "
                />
              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-white/60
                  "
                >
                  Monitoring
                </p>

                <h4 className="font-bold">
                  Kepatuhan LH
                </h4>

              </div>

            </div>

            {/* FLOATING STATUS */}
            <div
              className="
                absolute
                -right-6 bottom-10
                hidden lg:block

                rounded-2xl
                px-6 py-5
                shadow-2xl

                bg-green-700
                text-white

                dark:bg-yellow-400
                dark:text-black
              "
            >
              <p className="text-sm font-medium">
                Sistem Aktif
              </p>

              <h3 className="text-3xl font-black">
                24/7
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          BOTTOM WAVE
      ====================================== */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">

        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="
              fill-white
              dark:fill-[#020817]
            "
            d="M0 64L80 69.3C160 75 320 85 480 90.7C640 96 800 96 960 80C1120 64 1280 32 1360 16L1440 0V120H1360C1280 120 1120 120 960 120C800 120 640 120 480 120C320 120 160 120 80 120H0V64Z"
          />
        </svg>

      </div>

    </section>
  )
}
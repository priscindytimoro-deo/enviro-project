"use client"

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { Image3D } from "@/components/image-3d"

const sopTahapAwal = [
  {
    title: "Akses Website",
    description:
      "Pelaku usaha membuka website Monitor Patuh - LH melalui browser.",
  },
  {
    title: "Registrasi / Login",
    description:
      "Pengguna melakukan registrasi akun atau login ke sistem.",
  },
  {
    title: "Buat Laporan Baru",
    description:
      "Pelaku usaha membuat laporan kegiatan dan memilih jenis dokumen.",
  },
  {
    title: "Kirim Laporan",
    description:
      "Dokumen dan laporan dikirim melalui sistem untuk diverifikasi.",
  },
]

const sopTahapLanjutan = [
  {
    title: "Verifikasi",
    description:
      "Petugas melakukan verifikasi kelengkapan dan validasi laporan.",
  },
  {
    title: "Perbaikan Jika Diperlukan",
    description:
      "Pelaku usaha memperbaiki laporan apabila terdapat revisi.",
  },
  {
    title: "Pengesahan",
    description:
      "Laporan disahkan apabila seluruh persyaratan telah terpenuhi.",
  },
  {
    title: "Monitoring & Riwayat",
    description:
      "Pengguna dapat memantau status dan riwayat laporan secara berkala.",
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="
        bg-muted/30
        py-20
      "
    >
      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* HEADER */}
        <div
          className="
            mx-auto
            mb-16
            max-w-3xl
            text-center
          "
        >
          <Badge
            variant="outline"
            className="mb-4"
          >
            Standar Operasional Prosedur
          </Badge>

          <h2
            className="
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
            "
          >
            SOP Monitor Patuh - LH
          </h2>

          <p
            className="
              mt-4
              text-muted-foreground
            "
          >
            Alur pelaporan berkala lingkungan
            melalui sistem Monitor Patuh - LH.
          </p>
        </div>

        {/* =========================
            SOP 1 - 4
        ========================= */}
        <div
          className="
            mb-24
            grid
            items-center
            gap-12
            lg:grid-cols-2
          "
        >
          {/* IMAGE */}
          <Image3D
            lightSrc="/sop-light.png"
            darkSrc="/sop-dark.png"
            alt="SOP Tahap Awal"
            direction="left"
          />

          {/* CONTENT */}
          <div className="space-y-6">
            <div>
              <h3
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Tahapan Awal Pelaporan
              </h3>

              <p
                className="
                  mt-3
                  text-muted-foreground
                "
              >
                Berikut proses awal pelaporan
                berkala yang dilakukan pelaku
                usaha melalui sistem.
              </p>
            </div>

            <ul className="space-y-5">
              {sopTahapAwal.map(
                (item, index) => (
                  <li
                    key={index}
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-xl
                      border
                      bg-background
                      p-4
                      transition-colors
                      hover:bg-muted/50
                    "
                  >
                    <div
                      className="
                        mt-0.5
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                      "
                    >
                      <CheckCircle2
                        className="
                          h-5
                          w-5
                          text-primary
                        "
                      />
                    </div>

                    <div>
                      <h4
                        className="
                          font-semibold
                        "
                      >
                        {index + 1}. {item.title}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              )}
            </ul>

            <Button size="lg">
              Pelajari SOP
              <ArrowRight
                className="
                  ml-2
                  h-4
                  w-4
                "
              />
            </Button>
          </div>
        </div>

        {/* =========================
            SOP 5 - 8
        ========================= */}
        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-2
          "
        >
          {/* CONTENT */}
          <div
            className="
              order-2
              space-y-6
              lg:order-1
            "
          >
            <div>
              <h3
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  sm:text-3xl
                "
              >
                Tahapan Verifikasi dan Monitoring
              </h3>

              <p
                className="
                  mt-3
                  text-muted-foreground
                "
              >
                Setelah laporan dikirim,
                sistem akan melakukan proses
                verifikasi hingga monitoring
                laporan secara berkala.
              </p>
            </div>

            <ul className="space-y-5">
              {sopTahapLanjutan.map(
                (item, index) => (
                  <li
                    key={index}
                    className="
                      flex
                      items-start
                      gap-4
                      rounded-xl
                      border
                      bg-background
                      p-4
                      transition-colors
                      hover:bg-muted/50
                    "
                  >
                    <div
                      className="
                        mt-0.5
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-primary/10
                      "
                    >
                      <CheckCircle2
                        className="
                          h-5
                          w-5
                          text-primary
                        "
                      />
                    </div>

                    <div>
                      <h4
                        className="
                          font-semibold
                        "
                      >
                        {index + 5}. {item.title}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              )}
            </ul>

            <Button
              size="lg"
              variant="outline"
            >
              Lihat Panduan
            </Button>
          </div>

          {/* IMAGE */}
          <Image3D
            lightSrc="/sop-light.png"
            darkSrc="/sop-dark.png"
            alt="SOP Tahap Lanjutan"
            direction="right"
            className="order-1 lg:order-2"
          />
        </div>
      </div>
    </section>
  )
}
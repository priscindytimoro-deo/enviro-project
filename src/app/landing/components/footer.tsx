"use client"

import Image from "next/image"

import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"

import {
  Facebook,
  Instagram,
  MapPin,
} from "lucide-react"

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
]

const footerMenus = [
  {
    title: "Menu",
    links: [
      {
        name: "SOP",
        href: "#features",
      },
      {
        name: "Edukasi Lingkungan",
        href: "#faq",
      },
      {
        name: "Dokumen",
        href: "#",
      },
      {
        name: "Kontak",
        href: "#",
      },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-12
        "
      >
        {/* =========================
            MAIN FOOTER
        ========================= */}
        <div
          className="
            grid
            gap-10
            lg:grid-cols-3
          "
        >
          {/* BRAND */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Logo DLH"
                width={60}
                height={60}
                className="object-contain"
              />

              <div>
                <h2
                  className="
                    text-lg
                    font-bold
                    leading-tight
                  "
                >
                  Sistem Monitoring
                  Lingkungan Hidup
                </h2>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Kabupaten Timor Tengah Selatan
                </p>
              </div>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Sistem pelayanan dan informasi
              lingkungan hidup untuk mendukung
              pengelolaan dokumen, edukasi,
              dan pelayanan pelaku usaha secara
              digital.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* MENU */}
          <div>
            <h4
              className="
                mb-4
                text-base
                font-semibold
              "
            >
              Menu
            </h4>

            <ul className="space-y-3">
              {footerMenus[0].links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="
                      text-sm
                      text-muted-foreground
                      transition-colors
                      hover:text-primary
                    "
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* MAP */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />

              <h4
                className="
                  text-base
                  font-semibold
                "
              >
                Peta Lokasi
              </h4>
            </div>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
              "
            >
                
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d673.4121833493232!2d124.27443510697994!3d-9.85327534040423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2c55efb71f363997%3A0x9bef3cf5381afbcc!2sDinas%20LINGKUNGAN%20Hidup!5e1!3m2!1sen!2sid!4v1779680770486!5m2!1sen!2sid=embed"
                width="100%"
                height="250"
                loading="lazy"
                className="border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p
              className="
                text-sm
                leading-relaxed
                text-muted-foreground
              "
            >
              Dinas Lingkungan Hidup
              Kabupaten Timor Tengah Selatan,
              Soe, Nusa Tenggara Timur.
            </p>
          </div>
        </div>

        {/* SEPARATOR */}
        <Separator className="my-8" />

        {/* =========================
            BOTTOM FOOTER
        ========================= */}
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-3
            text-center
          "
        >
          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            © {new Date().getFullYear()} Sistem
            Monitoring Lingkungan Hidup
          </p>

          <p
            className="
              max-w-3xl
              text-sm
              leading-relaxed
              text-muted-foreground
            "
          >
            Dikelola oleh Dinas Lingkungan
            Hidup Kab. Timor Tengah Selatan
            Bidang Penataan dan Penaatan
            PPLH
          </p>

          <p
            className="
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            Design by Priscindy Q. Timoro, S.T
          </p>
        </div>
      </div>
    </footer>
  )
}
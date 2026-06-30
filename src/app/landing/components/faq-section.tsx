"use client"

import { CircleHelp, FileCheck2, ShieldCheck, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "@/components/ui/badge"

type FaqItem = {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: "item-1",
    question: "Apa itu Persetujuan Lingkungan?",
    answer:
      "Persetujuan Lingkungan adalah keputusan kelayakan lingkungan hidup atau pernyataan kesanggupan pengelolaan lingkungan hidup yang menjadi prasyarat penerbitan Perizinan Berusaha atau persetujuan pemerintah bagi suatu usaha dan/atau kegiatan. Persetujuan ini diberikan sebagai bentuk pengakuan bahwa pelaku usaha telah memenuhi kewajiban perlindungan dan pengelolaan lingkungan hidup sesuai tingkat risiko dan dampak usahanya.",
  },

  {
    value: "item-2",
    question: "Apa perbedaan SPPL, UKL-UPL, dan AMDAL?",
    answer:
      "SPPL diperuntukkan bagi usaha berisiko rendah yang tidak wajib menyusun UKL-UPL maupun AMDAL. UKL-UPL diperuntukkan bagi usaha yang memiliki potensi dampak lingkungan namun tidak berdampak penting. Sedangkan AMDAL diperuntukkan bagi usaha dan/atau kegiatan yang berpotensi menimbulkan dampak penting terhadap lingkungan hidup.",
  },

  {
    value: "item-3",
    question: "Siapa yang wajib memiliki Persetujuan Lingkungan?",
    answer:
      "Setiap pelaku usaha dan/atau kegiatan yang berpotensi menimbulkan dampak terhadap lingkungan hidup wajib memiliki Persetujuan Lingkungan sebelum memulai kegiatan usahanya. Kewajiban ini berlaku bagi usaha mikro, kecil, menengah, maupun besar sesuai tingkat risiko dan jenis kegiatan.",
  },

  {
    value: "item-4",
    question: "Apa kewajiban setelah memperoleh Persetujuan Lingkungan?",
    answer:
      "Pelaku usaha wajib melaksanakan pengelolaan dan pemantauan lingkungan hidup, menyampaikan laporan berkala, menjaga ketaatan terhadap baku mutu lingkungan hidup, serta menindaklanjuti hasil pengawasan atau pembinaan dari pemerintah apabila ditemukan ketidaksesuaian.",
  },

  {
    value: "item-5",
    question: "Apa itu laporan berkala?",
    answer:
      "Laporan berkala adalah laporan yang disampaikan secara rutin oleh pelaku usaha kepada instansi lingkungan hidup sebagai bentuk pelaporan atas pelaksanaan kewajiban pengelolaan dan pemantauan lingkungan hidup sesuai Persetujuan Lingkungan yang dimiliki.",
  },

  {
    value: "item-6",
    question: "Siapa yang wajib melapor?",
    answer:
      "Setiap pelaku usaha dan/atau kegiatan yang telah memiliki Persetujuan Lingkungan, baik SPPL, UKL-UPL, maupun AMDAL wajib menyampaikan laporan berkala sesuai ketentuan yang berlaku.",
  },

  {
    value: "item-7",
    question: "Dokumen apa yang harus disiapkan?",
    answer:
      "Dokumen yang perlu disiapkan meliputi Persetujuan Lingkungan (SPPL, UKL-UPL, atau AMDAL), data identitas usaha, laporan pelaksanaan pengelolaan lingkungan, hasil pemantauan lingkungan, hasil uji laboratorium (jika diwajibkan), foto dokumentasi kegiatan, serta dokumen pendukung lainnya dalam format digital PDF/JPG/PNG.",
  },

  {
    value: "item-8",
    question: "Bagaimana cara upload laporan?",
    answer:
      "Login ke akun pelaku usaha, pilih menu Pelaporan Berkala, lengkapi formulir data laporan, unggah dokumen pendukung, periksa kembali kelengkapan data, lalu klik Kirim/Submit Laporan. Status laporan dapat dipantau melalui dashboard.",
  },

  {
    value: "item-9",
    question: "Kapan batas waktu pelaporan?",
    answer:
      "Pada umumnya laporan disampaikan setiap 6 (enam) bulan atau per semester sesuai ketentuan dalam Persetujuan Lingkungan masing-masing usaha. Pelaku usaha disarankan melapor sebelum tenggat waktu berakhir.",
  },

  {
    value: "item-10",
    question: "Bagaimana cek status kepatuhan?",
    answer:
      "Status kepatuhan dapat dilihat melalui dashboard Monitor Patuh-LH setelah login. Pengguna dapat melihat status laporan, riwayat pelaporan, tingkat kepatuhan usaha, serta notifikasi atau catatan tindak lanjut dari Dinas Lingkungan Hidup.",
  },

  {
    value: "item-11",
    question: "Apa akibat jika tidak melapor?",
    answer:
      "Pelaku usaha yang tidak menyampaikan laporan berkala dapat dinilai tidak patuh terhadap kewajiban Persetujuan Lingkungan dan dapat dikenakan pembinaan, pengawasan lanjutan, hingga sanksi administratif sesuai ketentuan peraturan perundang-undangan.",
  },
]

const FaqSection = () => {
  return (
    <section
      id="faq"
      className="
        relative overflow-hidden
        py-24 sm:py-32

        bg-gradient-to-b
        from-white
        via-green-50/50
        to-white

        dark:from-[#020817]
        dark:via-[#041b11]
        dark:to-[#020817]
      "
    >
      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div
          className="
            absolute top-0 left-0
            w-80 h-80
            bg-green-300/20
            rounded-full blur-3xl

            dark:bg-green-500/10
          "
        />

        <div
          className="
            absolute bottom-0 right-0
            w-[28rem] h-[28rem]
            bg-emerald-300/20
            rounded-full blur-3xl

            dark:bg-emerald-500/10
          "
        />

      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================
            SECTION HEADER
        ====================================== */}
        <div className="mx-auto max-w-3xl text-center mb-16">

          <Badge
            variant="outline"
            className="
              mb-5
              border-green-200
              bg-green-50
              text-green-700

              dark:border-green-500/20
              dark:bg-green-500/10
              dark:text-green-300
            "
          >
            Edukasi Lingkungan • Monitor Patuh LH
          </Badge>

          <h2
            className="
              text-3xl sm:text-4xl lg:text-5xl
              font-black tracking-tight
              text-slate-900
              dark:text-white
              mb-5
            "
          >
            Edukasi
            <span className="text-green-700 dark:text-green-400">
              {" "}Lingkungan
            </span>
          </h2>

          <p
            className="
              text-lg
              leading-relaxed
              text-slate-600
              dark:text-white/70
            "
          >
            Informasi mengenai Persetujuan Lingkungan,
            pelaporan berkala, dokumen lingkungan,
            dan penggunaan sistem Monitor Patuh-LH.
          </p>

        </div>

        {/* ======================================
            FAQ CONTENT
        ====================================== */}
        <div className="max-w-5xl mx-auto">

          <Accordion
            type="single"
            collapsible
            className="space-y-5"
          >

            {faqItems.map((item) => (

              <AccordionItem
                key={item.value}
                value={item.value}
                className="
                  overflow-hidden
                  rounded-2xl

                  border border-green-100
                  bg-white/90
                  backdrop-blur-md
                  shadow-sm

                  transition-all duration-300

                  hover:shadow-xl
                  hover:-translate-y-1

                  dark:border-white/10
                  dark:bg-white/5
                "
              >

                <AccordionTrigger
                  className="
                    cursor-pointer
                    px-5 py-5
                    hover:no-underline
                    data-[state=open]:border-b

                    border-green-100
                    dark:border-white/10
                  "
                >

                  <div className="flex items-start gap-4 text-left">

                    <div
                      className="
                        flex items-center justify-center
                        size-11 shrink-0
                        rounded-full

                        bg-green-100
                        text-green-700

                        dark:bg-green-500/10
                        dark:text-green-300
                      "
                    >
                      <CircleHelp className="size-5" />
                    </div>

                    <span
                      className="
                        text-base sm:text-lg
                        font-bold
                        leading-relaxed

                        text-slate-800
                        dark:text-white
                      "
                    >
                      {item.question}
                    </span>

                  </div>

                </AccordionTrigger>

                <AccordionContent
                  className="
                    px-5 pb-6
                    pt-2
                  "
                >

                  <div className="pl-[3.7rem]">

                    <p
                      className="
                        leading-8
                        text-slate-600
                        dark:text-white/75
                      "
                    >
                      {item.answer}
                    </p>

                  </div>

                </AccordionContent>

              </AccordionItem>

            ))}

          </Accordion>

          {/* ======================================
              CTA SECTION
          ====================================== */}
          <div
            className="
              mt-16
              rounded-3xl
              border border-green-100

              bg-gradient-to-r
              from-green-600
              via-green-700
              to-emerald-700

              p-10
              text-center
              text-white
              shadow-2xl

              dark:border-white/10
            "
          >

            <div
              className="
                mx-auto
                flex items-center justify-center
                size-16
                rounded-2xl
                bg-white/10
                mb-5
              "
            >
              <UploadCloud className="size-8" />
            </div>

            <h3 className="text-2xl font-black mb-4">
              Butuh Bantuan Pelaporan?
            </h3>

            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Hubungi Dinas Lingkungan Hidup atau admin
              Monitor Patuh-LH apabila mengalami kendala
              dalam proses pelaporan maupun verifikasi data.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">

              <Button
                asChild
                size="lg"
                className="
                  bg-white
                  text-green-700
                  hover:bg-green-50
                  font-bold
                  rounded-xl
                  cursor-pointer
                "
              >
                <a
                  href="https://wa.me/+6282236611208?text=Halo%20Admin%20DLH,%20saya%20ingin%20bertanya%20tentang%20pelaporan%20lingkungan."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Admin
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="
                  border-white/20
                  bg-white/10
                  text-white
                  hover:bg-white/20
                  hover:text-white
                  rounded-xl
                  cursor-pointer
                "
              >
                <a href="#hero">
                  Kembali ke Atas
                </a>
              </Button>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export { FaqSection }
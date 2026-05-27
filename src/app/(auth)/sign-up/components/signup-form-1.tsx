"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function SignupForm2({ className, ...props }: React.ComponentProps<"form">) {

  const router = useRouter()

  const [hasDocument, setHasDocument] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")

  const [isChecking, setIsChecking] = useState(false)
  const [message, setMessage] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [error, setError] = useState("")

  // =========================
  // HANDLE CEK DATA (RPC)
  // =========================
  const handleCheck = async () => {

    setIsChecking(true)

    // reset state
    setMessage("")
    setIsValid(false)
    setShowCreateAccount(false)

    const cleanNumber = documentNumber.trim()

    const { data, error } = await supabase.rpc("cek_dokumen", {
      p_nomor: cleanNumber,
      p_jenis: documentType,
    })

    const result = Array.isArray(data) ? data[0] : null

    setIsChecking(false)

    // ERROR SUPABASE
    if (error) {
      setMessage("❌ Terjadi kesalahan sistem")
      return
    }

    // DATA DITEMUKAN
    if (result) {

      setMessage(`✅ Data ditemukan atas nama ${result.nama_usaha || "-"}`)
      setIsValid(true)

      localStorage.setItem(
        "documentData",
        JSON.stringify(result)
      )

      return
    }

    // DATA TIDAK DITEMUKAN
    setMessage(
      "❌ Data tidak ditemukan di sistem kami. Silakan buat akun baru untuk melanjutkan proses."
    )

    setIsValid(false)
    setShowCreateAccount(true)
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Registrasi Persetujuan Lingkungan
        </h1>
        <p className="text-muted-foreground text-sm">
          Silakan lakukan pengecekan dokumen terlebih dahulu
        </p>
      </div>

      {/* PERTANYAAN */}
      <div className="grid gap-3">
        <Label>Apakah anda sudah memiliki dokumen persetujuan lingkungan?</Label>

        <Select onValueChange={(val) => {
          setHasDocument(val)
          setDocumentType("")
          setDocumentNumber("")
          setMessage("")
          setShowCreateAccount(false)
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jawaban" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Ya</SelectItem>
            <SelectItem value="no">Tidak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TIDAK PUNYA DOKUMEN */}
      {hasDocument === "no" && (
        <div className="border p-4 rounded-lg space-y-3">
          <p>Anda belum memiliki dokumen persetujuan lingkungan.</p>

          <Button type="button" onClick={() => router.push("/sign-up-2")}>
            Buat Akun
          </Button>
        </div>
      )}

      {/* SUDAH PUNYA DOKUMEN */}
      {hasDocument === "yes" && (
        <>
          {/* JENIS */}
          <div className="grid gap-3">
            <Label>Jenis Dokumen</Label>

            <Select onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPPL">SPPL</SelectItem>
                <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NOMOR */}
          {documentType && (
            <>
              <div className="grid gap-3">
                <Label>Nomor Terbit Dokumen</Label>

                <Input
                  placeholder="DLH.17.02/01/84/2023"
                  value={documentNumber}
                  maxLength={25}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z0-9./]/g, "")
                    setDocumentNumber(value)

                    if (value.length < 20) {
                      setError("Minimal 20 karakter")
                    } else if (!/[A-Za-z]/.test(value)) {
                      setError("Harus mengandung huruf")
                    } else if (!value.includes(".")) {
                      setError("Harus mengandung titik (.)")
                    } else if (!value.includes("/")) {
                      setError("Harus mengandung slash (/)")
                    } else {
                      setError("")
                    }
                  }}
                />

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleCheck}
                disabled={
                  !documentType ||
                  !documentNumber ||
                  error !== "" ||
                  isChecking
                }
                className="w-full"
              >
                {isChecking ? "Memeriksa..." : "Cek Data"}
              </Button>
            </>
          )}
        </>
      )}

      {/* HASIL */}
      {message && (
        <div className="border p-4 rounded-lg space-y-3">
          <p>{message}</p>

          {isValid && (
            <Button onClick={() => router.push("/sign-up-3")}>
              Lanjut Aktivasi
            </Button>
          )}

          {showCreateAccount && !isValid && (
            <Button onClick={() => router.push("/sign-up-2")}>
              Buat Akun Baru
            </Button>
          )}
        </div>
      )}
    </form>
  )
}
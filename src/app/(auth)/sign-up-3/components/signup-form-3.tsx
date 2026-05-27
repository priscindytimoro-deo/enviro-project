"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export function SignupForm3({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // =========================
  // VALIDASI PASSWORD
  // =========================
  const validatePassword = (value: string) => {

    if (value.length < 8) {
      return "Password minimal 8 karakter"
    }

    if (!/[A-Z]/.test(value)) {
      return "Password harus mengandung huruf besar"
    }

    if (!/[0-9]/.test(value)) {
      return "Password harus mengandung angka"
    }

    return ""
  }

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setSuccess(false)

    // validasi password
    const passwordError = validatePassword(password)

    if (passwordError) {
      setError(passwordError)
      return
    }

    // validasi konfirmasi password
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      return
    }

    // simulasi berhasil
    setSuccess(true)
  }

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-6">

              {/* LOGO */}
              <div className="flex justify-center mb-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-medium"
                >
                  <div className="flex size-10 items-center justify-center rounded-md overflow-hidden">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  <span className="text-xl">
                    MONITOR PATUH - LH
                  </span>
                </Link>
              </div>

              {/* TITLE */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Aktivasi Akun
                </h1>

                <p className="text-muted-foreground text-balance">
                  Silakan masukkan email dan password
                  untuk aktivasi akun
                </p>
              </div>

              {/* EMAIL */}
              <div className="grid gap-3">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              {/* PASSWORD */}
              <div className="grid gap-3">
                <Label htmlFor="password">
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <p className="text-muted-foreground text-xs">
                  Password minimal 8 karakter,
                  mengandung huruf besar dan angka
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">
                  Konfirmasi Password
                </Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  required
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-md border border-green-500 bg-green-50 p-3 text-sm text-green-600">
                  Aktivasi akun berhasil.

                  <br />

                  Silakan cek email Anda untuk proses verifikasi akun.
                </div>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
              >
                Aktivasi Akun
              </Button>

              {/* LOGIN */}
              <div className="text-center text-sm">
                Sudah memiliki akun?{" "}

                <a
                  href="/auth/sign-in-3"
                  className="underline underline-offset-4"
                >
                  Masuk
                </a>
              </div>
            </div>
          </form>

          {/* IMAGE */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/logo.svg"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        MONITOR PATUH - LH © 2026
      </div>
    </div>
  )
}
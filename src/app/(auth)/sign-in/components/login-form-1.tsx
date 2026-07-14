"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setLoading(true)
    setError("")

    // LOGIN SUPABASE
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

    if (authError || !authData.user) {
      setError("Email atau password salah")
      setLoading(false)
      return
    }



    const user = authData.user

    // AMBIL PROFILE
    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    if (profileError || !profile) {
      await supabase.auth.signOut()
      setError("Profil tidak ditemukan")
      setLoading(false)
      return
    }

    // CEK VERIFIKASI

    if (!user.email_confirmed_at) {
      await supabase.auth.signOut()

      setError(
        "Email belum diverifikasi. Silakan cek inbox email Anda."
      )

      setLoading(false)
      return
    }

    if (profile.status_verifikasi !== "approved") {
      await supabase.auth.signOut()
      setError("Akun belum diverifikasi admin")
      setLoading(false)
      return
    }

    // CEK AKTIF
    if (!profile.is_active) {
      await supabase.auth.signOut()
      setError("Akun belum aktif")
      setLoading(false)
      return
    }

    // REDIRECT ROLE
  switch (profile.role) {
    case "admin":
      router.push("/admin/dashboard")
      break

    case "kadis":
      router.push("/kadis/dashboard")
      break

    case "kabid":
      router.push("/kabid/dashboard")
      break

    case "pengawas":
      router.push("/pengawas/dashboard")
      break

    case "user":
    default:
      router.push("/dashboard")
      break
  }

    setLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Masuk ke akun Anda</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">

                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Contoh: valerossi@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PASSWORD WITH EYE */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        {/* <a
                          href="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Lupa password?
                        </a> */}
                      </div>

                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ERROR */}
                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </Button>

                {/* SIGN UP */}
                <div className="text-center text-sm">
                  Belum punya akun?{" "}
                  <a
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Daftar
                  </a>
                </div>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
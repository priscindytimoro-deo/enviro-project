"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase-client"

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

import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

/* =========================
   VALIDATION
========================= */
const signupFormSchema = z
  .object({
    namaPenanggungJawab: z.string().min(3),

    username: z
      .string()
      .min(3)
      .regex(/^[A-Za-z]+$/, "Username hanya huruf"),

    nohp: z.string().min(10),

    email: z.string().email(),

    password: z
      .string()
      .min(8)
      .refine((val) => /[A-Z]/.test(val), {
        message: "Harus ada huruf besar",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "Harus ada simbol",
      }),

    confirmPassword: z.string(),

    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui syarat dan ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupFormSchema>

/* =========================
   COMPONENT
========================= */
export function SignupForm1({
  className,
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      namaPenanggungJawab: "",
      username: "",
      nohp: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  /* =========================
     SUBMIT SIGNUP
  ========================= */
  async function onSubmit(data: SignupFormValues) {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // 1. cek username
      const { data: existing } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", data.username)
        .maybeSingle()

      if (existing) {
        setError("Username sudah digunakan")
        setLoading(false)
        return
      }

      // 2. signup auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // 3. insert profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            nama_penanggung_jawab: data.namaPenanggungJawab,
            username: data.username,
            no_hp: data.nohp,
            role: "user",
          })

        if (profileError) {
          setError(profileError.message)
          setLoading(false)
          return
        }
      }

      // 4. success
      setSuccess("Pendaftaran berhasil, silakan login")

      form.reset()

      setTimeout(() => {
        router.push("/sign-in")
      }, 1200)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className={cn("w-full", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Registrasi Akun</CardTitle>
          <CardDescription>
            Daftarkan akun untuk mengakses sistem
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* NAMA */}
              <FormField
                control={form.control}
                name="namaPenanggungJawab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Penanggung Jawab</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* USERNAME */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/[^A-Za-z]/g, "")
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NOHP */}
              <FormField
                control={form.control}
                name="nohp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No HP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                        className="absolute right-2 top-2"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-2 top-2"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TERMS */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel>
                      Saya menyetujui syarat dan ketentuan
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* SUCCESS */}
              {success && (
                <p className="text-green-600 text-sm">
                  {success}
                </p>
              )}

              {/* SUBMIT */}
              <Button className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Daftar"}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
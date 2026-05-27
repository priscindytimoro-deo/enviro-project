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

import { Textarea } from "@/components/ui/textarea"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"

const signupFormSchema = z
  .object({
    namaPelakuUsaha: z
      .string()
      .min(1, "Nama pelaku usaha wajib diisi"),

    penanggungJawab: z
      .string()
      .min(1, "Penanggung jawab wajib diisi"),

    alamatPenanggungJawab: z
      .string()
      .min(1, "Alamat wajib diisi"),

    namaBadanUsaha: z
      .string()
      .min(1, "Nama badan usaha wajib diisi"),

    jenisBadanHukum: z
      .string()
      .min(1, "Jenis badan hukum wajib dipilih"),

    nib: z
      .string()
      .min(13, "NIB harus 13 digit")
      .max(13, "NIB maksimal 13 digit")
      .regex(/^\d+$/, "NIB hanya boleh angka"),

    jumlahUsaha: z
      .string()
      .min(1, "Jumlah usaha wajib diisi"),

    noHp: z
      .string()
      .min(10, "Nomor HP tidak valid"),

    email: z
      .string()
      .email("Email tidak valid"),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter"),

    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password wajib diisi"),

    terms: z.boolean().refine(
      (val) => val === true,
      "Anda harus menyetujui syarat dan ketentuan"
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupFormSchema>

export function SignupForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),

    defaultValues: {
      namaPelakuUsaha: "",
      penanggungJawab: "",
      alamatPenanggungJawab: "",
      namaBadanUsaha: "",
      jenisBadanHukum: "",
      nib: "",
      jumlahUsaha: "",
      noHp: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  function onSubmit(data: SignupFormValues) {
    console.log("Signup data:", data)
  }

  return (
    <div
      className={cn(
        `
        w-full
        min-h-screen
        overflow-y-auto
        bg-background
        px-4
        py-8
        `,
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-2xl">
        <Card
          className="
            w-full
            overflow-hidden
            rounded-2xl
            border
            shadow-lg
          "
        >
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">
              Registrasi Pelaku Usaha
            </CardTitle>

            <CardDescription>
              Lengkapi data di bawah untuk membuat akun
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Nama Pelaku Usaha */}
                <FormField
                  control={form.control}
                  name="namaPelakuUsaha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Pelaku Usaha
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Masukkan nama pelaku usaha"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Penanggung Jawab */}
                <FormField
                  control={form.control}
                  name="penanggungJawab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Penanggung Jawab
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Nama penanggung jawab"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alamat */}
                <FormField
                  control={form.control}
                  name="alamatPenanggungJawab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Alamat Penanggung Jawab
                      </FormLabel>

                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alamat lengkap"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nama Badan Usaha */}
                <FormField
                  control={form.control}
                  name="namaBadanUsaha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Badan Usaha
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Masukkan nama badan usaha"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Jenis Badan Hukum */}
                <FormField
                  control={form.control}
                  name="jenisBadanHukum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Jenis Badan Hukum
                      </FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih badan hukum" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="pt">
                            PT
                          </SelectItem>

                          <SelectItem value="cv">
                            CV
                          </SelectItem>

                          <SelectItem value="koperasi">
                            Koperasi
                          </SelectItem>

                          <SelectItem value="yayasan">
                            Yayasan
                          </SelectItem>

                          <SelectItem value="perorangan">
                            Perorangan
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NIB */}
                <FormField
                  control={form.control}
                  name="nib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        NIB
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={13}
                          placeholder="Masukkan 13 digit NIB"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            field.onChange(value)
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Jumlah Usaha */}
                <FormField
                  control={form.control}
                  name="jumlahUsaha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Jumlah Usaha/Kegiatan
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan jumlah usaha"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* No HP */}
                <FormField
                  control={form.control}
                  name="noHp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        No. HP
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="08xxxxxxxxxx"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@contoh.com"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Masukkan password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Konfirmasi Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Konfirmasi Password
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ulangi password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem
                      className="
                        flex
                        items-start
                        space-x-3
                        rounded-lg
                        border
                        p-4
                      "
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Saya menyetujui syarat dan
                          ketentuan penggunaan sistem
                        </FormLabel>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Button */}
                <Button
                  type="submit"
                  className="h-11 w-full text-base"
                >
                  Daftar Akun
                </Button>

                {/* Login */}
                <div className="text-center text-sm text-muted-foreground">
                  Sudah memiliki akun?{" "}

                  <a
                    href="/auth/sign-in"
                    className="
                      font-medium
                      text-primary
                      underline-offset-4
                      hover:underline
                    "
                  >
                    Masuk
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
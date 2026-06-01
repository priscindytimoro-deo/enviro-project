"use client"

import { useState } from "react"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useForm } from "react-hook-form"

interface UserFormValues {
  name: string
  username: string
  phone: string
  role: string
  status: string
  verificationStatus: string
}

interface UserFormDialogProps {
  onAddUser: (userData: UserFormValues) => void
}

export function UserFormDialog({
  onAddUser,
}: UserFormDialogProps) {

  const [open, setOpen] = useState(false)

  const form = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      role: "",
      status: "Aktif",
      verificationStatus: "Belum Verifikasi",
    },
  })

  const onSubmit = (values: UserFormValues) => {

    onAddUser(values)

    form.reset()

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>

        <Button className="cursor-pointer">
          <Plus className="mr-2 size-4" />
          Tambah Pengguna
        </Button>

      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">

        <DialogHeader>

          <DialogTitle>
            Tambah Pengguna
          </DialogTitle>

          <DialogDescription>
            Tambahkan data pengguna baru ke sistem
          </DialogDescription>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* NAMA PENANGGUNG JAWAB */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Nama wajib diisi",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Nama Penanggung Jawab
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="Masukkan nama penanggung jawab"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* USERNAME */}
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: "Username wajib diisi",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Username
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="Masukkan username"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* NO HP */}
            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "Nomor HP wajib diisi",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Nomor HP
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

            {/* ROLE */}
            <FormField
              control={form.control}
              name="role"
              rules={{
                required: "Role wajib dipilih",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Role
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >

                    <FormControl>

                      <SelectTrigger className="cursor-pointer">

                        <SelectValue placeholder="Pilih role" />

                      </SelectTrigger>

                    </FormControl>

                    <SelectContent>

                      <SelectItem value="Admin">
                        Admin
                      </SelectItem>

                      <SelectItem value="Kepala Dinas">
                        Kepala Dinas
                      </SelectItem>

                      <SelectItem value="Kepala Bidang">
                        Kepala Bidang
                      </SelectItem>

                      <SelectItem value="Pengawas">
                        Pengawas
                      </SelectItem>

                      <SelectItem value="Pengguna">
                        Pengguna
                      </SelectItem>

                    </SelectContent>

                  </Select>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              rules={{
                required: "Status wajib dipilih",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Status
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >

                    <FormControl>

                      <SelectTrigger className="cursor-pointer">

                        <SelectValue placeholder="Pilih status" />

                      </SelectTrigger>

                    </FormControl>

                    <SelectContent>

                      <SelectItem value="Aktif">
                        Aktif
                      </SelectItem>

                      <SelectItem value="Pending">
                        Pending
                      </SelectItem>

                      <SelectItem value="Nonaktif">
                        Nonaktif
                      </SelectItem>

                    </SelectContent>

                  </Select>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* STATUS VERIFIKASI */}
            <FormField
              control={form.control}
              name="verificationStatus"
              rules={{
                required: "Status verifikasi wajib dipilih",
              }}
              render={({ field }) => (
                <FormItem>

                  <FormLabel>
                    Status Verifikasi
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >

                    <FormControl>

                      <SelectTrigger className="cursor-pointer">

                        <SelectValue placeholder="Pilih status verifikasi" />

                      </SelectTrigger>

                    </FormControl>

                    <SelectContent>

                      <SelectItem value="Terverifikasi">
                        Terverifikasi
                      </SelectItem>

                      <SelectItem value="Belum Verifikasi">
                        Belum Verifikasi
                      </SelectItem>

                    </SelectContent>

                  </Select>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* BUTTON */}
            <div className="flex justify-end gap-2 pt-2">

              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Batal
              </Button>

              <Button
                type="submit"
                className="cursor-pointer"
              >
                Simpan Pengguna
              </Button>

            </div>

          </form>

        </Form>

      </DialogContent>

    </Dialog>
  )
}
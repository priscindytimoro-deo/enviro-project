"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"

import type { UserFormValues } from "@/types/user"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
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

interface Props {
  onAddUser: (userData: UserFormValues) => void
}

export function UserFormDialog({ onAddUser }: Props) {
  const [open, setOpen] = useState(false)

  const form = useForm<UserFormValues>({
    defaultValues: {
      name: "",
      username: "", // ✅ FIX: tambah username
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
        <Button>
          <Plus className="mr-2 size-4" />
          Tambah Pengguna
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">

        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Wajib diisi" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* USERNAME ✅ NEW */}
            <FormField
              control={form.control}
              name="username"
              rules={{ required: "Wajib diisi" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: admin_sistem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              rules={{ required: "Wajib diisi" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ROLE */}
            <FormField
              control={form.control}
              name="role"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Pengawas">Pengawas</SelectItem>
                      <SelectItem value="Pengguna">Pengguna</SelectItem>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VERIFICATION STATUS */}
            <FormField
              control={form.control}
              name="verificationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Verifikasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terverifikasi">Terverifikasi</SelectItem>
                      <SelectItem value="Belum Verifikasi">Belum Verifikasi</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* BUTTON */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit">Simpan</Button>
            </div>

          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}
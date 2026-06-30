"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"

import type { UserFormValues } from "@/types/user"
import type { User } from "@/types/user"

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
  open: boolean
  onOpenChange: (open: boolean) => void

  user: User | null

  onEditUser: (data: UserFormValues & { id: string }) => Promise<void> | void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onEditUser,
}: Props) {

  const form = useForm<UserFormValues>({
    defaultValues: {
      email: "",

      name: "",
      username: "",
      phone: "",

      role: "user",

      is_active: false,

      verificationStatus: "pending",
    },
  })

  useEffect(() => {
    if (!user) return

    form.reset({
      email: user.email,

      name: user.name,
      username: user.username,
      phone: user.phone,

      role: user.role,

      is_active: user.is_active,

      verificationStatus: user.verificationStatus,
    })
  }, [user, form])

  const onSubmit = async (values: UserFormValues) => {
    if (!user) return

    await onEditUser({
      id: user.id,
      ...values,
    })

    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email wajib diisi" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@email.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NAMA */}
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Nama wajib diisi" }}
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
              rules={{ required: "Username wajib diisi" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PHONE */}
            <FormField
              control={form.control}
              name="phone"
              rules={{ required: "Nomor HP wajib diisi" }}
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

            {/* ROLE */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="kadis">Kadis</SelectItem>
                      <SelectItem value="kabid">Kabid</SelectItem>
                      <SelectItem value="pengawas">Pengawas</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* STATUS AKTIF */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Akun</FormLabel>

                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(value) =>
                      field.onChange(value === "true")
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="true">
                        Aktif
                      </SelectItem>

                      <SelectItem value="false">
                        Nonaktif
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* VERIFIKASI */}
            <FormField
              control={form.control}
              name="verificationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Verifikasi</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="approved">
                        Approved
                      </SelectItem>

                      <SelectItem value="pending">
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
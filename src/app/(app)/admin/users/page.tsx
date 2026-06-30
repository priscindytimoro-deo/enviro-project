"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

import type { User, UserFormValues } from "@/types/user"
import { DataTable } from "./components/data-table"
import { UserFormDialog } from "./components/user-form-dialog"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  const handleUpdateUser = async (userData: UserFormValues) => {
    if (!selectedUser) return

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Gagal update user")
      }

      alert("User berhasil diupdate")

      setEditOpen(false)
      setSelectedUser(null)

      await fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  // =========================
  // FETCH FROM SUPABASE
  // =========================
  const fetchUsers = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/admin/users")

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengambil data user")
      }

      const mapped: User[] = data.map((u: any) => ({
        id: u.id,

        email: u.email,

        name: u.name,

        username: u.username,

        phone: u.phone,

        role: u.role,

        is_active: u.is_active,

        verificationStatus: u.verificationStatus,

        avatar: generateAvatar(u.name || ""),

        createdAt: u.createdAt
          ? new Date(u.createdAt)
              .toISOString()
              .replace("T", " ")
              .slice(0, 16)
          : "-",
      }))

      setUsers(mapped)
    } catch (err) {
      console.error(err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // =========================
  // AVATAR
  // =========================
  const generateAvatar = (name: string) => {
    const parts = name.split(" ")

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    return name.substring(0, 2).toUpperCase()
  }

  // =========================
  // HANDLERS (UI ONLY)
  // =========================
  const handleAddUser = async (userData: UserFormValues) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Gagal membuat user")
      }

      alert("User berhasil dibuat")

      // 🔥 refresh data dari supabase
      await fetchUsers()
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleVerifyUser = async (user: User) => {

    const { error } = await supabase
      .from("profiles")
      .update({
        status_verifikasi: "approved",
        is_active: true,
      })
      .eq("id", user.id)


    if (error) return alert("Gagal verifikasi")

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, verificationStatus: "approved", is_active: true }
          : u
      )
    )
  }

  const handleRejectUser = async (user: User) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        status_verifikasi: "pending",
        is_active: false,
      })
      .eq("id", user.id)

    if (error) return alert("Gagal reject")

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, verificationStatus: "pending", is_active: false }
          : u
      )
    )
  }

const handleDeleteUser = async (user: User) => {
  const ok = confirm(`Hapus user ${user.username}?`)
  if (!ok) return

  const res = await fetch(`/api/admin/users/${user.id}`, {
    method: "DELETE",
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "Gagal menghapus user")
    return
  }

  setUsers((prev) => prev.filter((u) => u.id !== user.id))

  alert("User berhasil dihapus")
}


  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="px-6 py-6 text-muted-foreground">
        Memuat data pengguna...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="px-4 lg:px-6 space-y-1">
        <h1 className="text-3xl font-bold">
          Manajemen Pengguna
        </h1>
        <p className="text-muted-foreground">
          Kelola data pengguna sistem
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <DataTable
          users={users}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onVerifyUser={handleVerifyUser}
          onRejectUser={handleRejectUser}
        />
        <UserFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          user={selectedUser}
          onEditUser={handleUpdateUser}
        />
      </div>

    </div>
  )
}
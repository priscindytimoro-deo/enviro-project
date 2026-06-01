"use client"

import { useState } from "react"
import type { User, UserFormValues } from "@/types/user"
import initialUsersData from "./data.json"
import { DataTable } from "./components/data-table"

export default function UsersPage() {
  // FIX: langsung pakai tanpa cast berbahaya
  const [users, setUsers] = useState<User[]>(
    initialUsersData as User[]
  )

  const generateAvatar = (name: string) => {
    const parts = name.split(" ")

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    return name.substring(0, 2).toUpperCase()
  }

  const handleAddUser = (userData: UserFormValues) => {
    const newUser: User = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      name: userData.name,
      username: userData.username,
      phone: userData.phone,
      role: userData.role,
      status: userData.status,
      verificationStatus: userData.verificationStatus,
      avatar: generateAvatar(userData.name),
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    }

    setUsers((prev) => [newUser, ...prev])
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const handleEditUser = (user: User) => {
    console.log("edit:", user)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-6 space-y-1">
        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
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
        />
      </div>
    </div>
  )
}
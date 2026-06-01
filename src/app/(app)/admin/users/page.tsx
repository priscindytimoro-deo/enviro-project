"use client"

import { useState } from "react"

import { DataTable } from "./components/data-table"

import initialUsersData from "./data.json"

// ======================================
// INTERFACE USER
// ======================================
interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  usaha: string
  status: string
  joinedDate: string
  lastLogin: string
}

// ======================================
// FORM VALUES
// ======================================
interface UserFormValues {
  name: string
  email: string
  role: string
  usaha: string
  status: string
}

export default function UsersPage() {

  // ======================================
  // STATE USERS
  // ======================================
  const [users, setUsers] =
    useState<User[]>(initialUsersData)

  // ======================================
  // GENERATE AVATAR
  // ======================================
  const generateAvatar = (name: string) => {

    const names = name.split(" ")

    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`
        .toUpperCase()
    }

    return name.substring(0, 2).toUpperCase()
  }

  // ======================================
  // ADD USER
  // ======================================
  const handleAddUser = (
    userData: UserFormValues
  ) => {

    const newUser: User = {
      id:
        Math.max(...users.map((u) => u.id)) + 1,

      name: userData.name,

      email: userData.email,

      avatar: generateAvatar(userData.name),

      role: userData.role,

      usaha: userData.usaha,

      status: userData.status,

      joinedDate: new Date()
        .toISOString()
        .split("T")[0],

      lastLogin: new Date()
        .toISOString()
        .split("T")[0],
    }

    setUsers((prev) => [newUser, ...prev])
  }

  // ======================================
  // DELETE USER
  // ======================================
  const handleDeleteUser = (id: number) => {

    setUsers((prev) =>
      prev.filter((user) => user.id !== id)
    )
  }

  // ======================================
  // EDIT USER
  // ======================================
  const handleEditUser = (user: User) => {

    console.log("Edit user:", user)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="space-y-1 px-4 lg:px-6">

        <h1 className="text-3xl font-bold tracking-tight">
          Manajemen Pengguna
        </h1>

        <p className="text-muted-foreground">
          Kelola data pengguna sistem monitoring
          kepatuhan lingkungan hidup
        </p>

      </div>

      {/* ======================================
          DATA TABLE
      ====================================== */}
      <div className="@container/main px-4 lg:px-6">

        <DataTable
          users={users}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
          onAddUser={handleAddUser}
        />

      </div>

    </div>
  )
}
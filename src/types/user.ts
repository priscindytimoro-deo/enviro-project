export interface User {
  id: string

  email: string

  name: string
  username: string
  phone: string

  avatar: string

  role: string

  is_active: boolean

  verificationStatus: "approved" | "pending"

  createdAt: string
}

export interface UserFormValues {
  email: string

  name: string
  username: string
  phone: string

  role: string

  is_active: boolean

  verificationStatus: "approved" | "pending"
}
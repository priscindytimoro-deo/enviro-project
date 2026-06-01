export interface User {
  id: number
  name: string
  username: string
  phone: string
  avatar: string
  role: string
  status: string
  verificationStatus: string
  createdAt: string
}

export interface UserFormValues {
  name: string
  username: string
  phone: string
  role: string
  status: string
  verificationStatus: string
}
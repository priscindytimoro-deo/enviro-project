import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"


export async function GET() {
  try {
    // ===========================
    // AUTH USERS
    // ===========================

    const {
      data: authUsers,
      error: authError,
    } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message,
        },
        {
          status: 500,
        }
      )
    }

    // ===========================
    // PROFILES
    // ===========================

    const {
      data: profiles,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("*")

    if (profileError) {
      return NextResponse.json(
        {
          error: profileError.message,
        },
        {
          status: 500,
        }
      )
    }

    const users = profiles.map((profile) => {
      const authUser = authUsers.users.find(
        (u) => u.id === profile.id
      )

      return {
        id: profile.id,

        email: authUser?.email ?? "",

        name: profile.nama_penanggung_jawab,

        username: profile.username,

        phone: profile.no_hp,

        role: profile.role,

        is_active: profile.is_active,

        verificationStatus: profile.status_verifikasi,

        createdAt: profile.created_at,
      }
    })

    return NextResponse.json(users)

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    )
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      email,
      password,
      name,
      username,
      phone,
      role,
      is_active,
      verificationStatus,
    } = body

    // ===========================
    // VALIDASI
    // ===========================

    if (
      !email ||
      !password ||
      !name ||
      !username ||
      !phone ||
      !role
    ) {
      return NextResponse.json(
        {
          error: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      )
    }

    // ===========================
    // CREATE AUTH USER
    // ===========================

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,

      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json(
        {
          error: authError.message,
        },
        {
          status: 400,
        }
      )
    }

    const user = authData.user

    if (!user) {
      return NextResponse.json(
        {
          error: "User gagal dibuat",
        },
        {
          status: 400,
        }
      )
    }

    // ===========================
    // INSERT PROFILE
    // ===========================

    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,

          nama_penanggung_jawab: name,

          username,

          no_hp: phone,

          role,

          is_active,

          status_verifikasi:
            verificationStatus,
        })

    if (profileError) {
      // rollback auth jika insert profile gagal

      await supabaseAdmin.auth.admin.deleteUser(
        user.id
      )

      return NextResponse.json(
        {
          error: profileError.message,
        },
        {
          status: 400,
        }
      )
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil dibuat",
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    )
  }
}
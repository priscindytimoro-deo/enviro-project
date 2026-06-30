import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ===========================
// EDIT USER
// ===========================
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const body = await req.json()

    const {
      email,
      nama_penanggung_jawab,
      username,
      no_hp,
      role,
      is_active,
      status_verifikasi,
    } = body

    // ===========================
    // 1. UPDATE AUTH (EMAIL)
    // ===========================
    if (email) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email,
      })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    // ===========================
    // 2. UPDATE PROFILE (NO EMAIL)
    // ===========================
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        nama_penanggung_jawab,
        username,
        no_hp,
        role,
        is_active,
        status_verifikasi,
      })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil diperbarui",
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

// ===========================
// DELETE USER
// ===========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Hapus profile lebih dahulu
    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("id", id)

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      )
    }

    // Hapus auth
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
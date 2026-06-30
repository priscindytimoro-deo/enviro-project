import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const role = searchParams.get("role")

    let query = supabaseAdmin.from("reports").select("*")

    // =========================
    // ROLE-BASED FILTER
    // =========================

    if (role === "admin") {
      query = query.in("report_stage", [
        "admin_review",
        "admin_final_review",
      ])
    }

    if (role === "kadis") {
      query = query.eq("report_stage", "kadis_review")
    }

    if (role === "kabid") {
      query = query.eq("report_stage", "kabid_review")
    }

    if (role === "pengawas") {
      query = query.eq("report_stage", "pengawas_review")
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
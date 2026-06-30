import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getNextStage } from "../utils/workflow"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const body = await req.json()

    const { action, role, final_status } = body

    // =========================
    // GET CURRENT REPORT
    // =========================
    const { data: report, error: fetchError } =
      await supabaseAdmin
        .from("reports")
        .select("*")
        .eq("id", id)
        .single()

    if (fetchError || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    // =========================
    // 1. NORMAL WORKFLOW NEXT STAGE
    // =========================
    if (action === "next_stage") {
      const nextStage = getNextStage(report.report_stage)

      const { error } = await supabaseAdmin
        .from("reports")
        .update({
          report_stage: nextStage,
        })
        .eq("id", id)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Stage updated",
        nextStage,
      })
    }

    // =========================
    // 2. FINAL ACTION (ADMIN FINAL)
    // =========================
    if (action === "finalize") {
      const { error } = await supabaseAdmin
        .from("reports")
        .update({
          report_stage: "done",
          status_verifikasi: final_status,
        })
        .eq("id", id)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Report finalized",
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
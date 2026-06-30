const workflow = {
  admin_review: "kadis_review",
  kadis_review: "kabid_review",
  kabid_review: "pengawas_review",
  pengawas_review: "admin_final_review",
  admin_final_review: "done",
}

export function getNextStage(currentStage: string) {
  const workflow: Record<string, string> = {
    admin_review: "kadis_review",
    kadis_review: "kabid_review",
    kabid_review: "pengawas_review",
    pengawas_review: "admin_final_review",
    admin_final_review: "done",
  }

  return workflow[currentStage] || currentStage
}
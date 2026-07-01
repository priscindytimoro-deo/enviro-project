"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        let visitorId = localStorage.getItem("visitor_id");

        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("visitor_id", visitorId);
        }

        const lastVisit = localStorage.getItem("last_visit");

        // Sudah dihitung hari ini
        if (lastVisit === today) return;

        const { error } = await supabase.from("visitors").insert({
          visitor_id: visitorId,
        });

        if (!error) {
          localStorage.setItem("last_visit", today);
        }
      } catch (err) {
        console.error(err);
      }
    };

    trackVisitor();
  }, []);

  return null;
}
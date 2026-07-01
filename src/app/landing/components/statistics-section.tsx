"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import CountUp from "react-countup";
import {
  Users,
  Building2,
  FileText,
  Eye,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function StatisticsSection() {
  const [stats, setStats] = useState({
    users: 0,
    usaha: 0,
    reports: 0,
    visitors: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
  loadStats();

  const channel = supabase
      .channel("landing-statistics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => loadStats()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usaha_profile",
        },
        () => loadStats()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reports",
        },
        () => loadStats()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "visitors",
        },
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  async function loadStats() {
    const [
      users,
      usaha,
      reports,
      visitors,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", {
          head: true,
          count: "exact",
        }),

      supabase
        .from("usaha_profile")
        .select("*", {
          head: true,
          count: "exact",
        }),

      supabase
        .from("reports")
        .select("*", {
          head: true,
          count: "exact",
        }),

      supabase
        .from("visitors")
        .select("*", {
          head: true,
          count: "exact",
        }),
    ]);

    setStats({
      users: users.count ?? 0,
      usaha: usaha.count ?? 0,
      reports: reports.count ?? 0,
      visitors: visitors.count ?? 0,
    });
  }

  const items = [
    {
      icon: Users,
      label: "Pengguna",
      value: stats.users,
    },
    {
      icon: Building2,
      label: "Pelaku Usaha",
      value: stats.usaha,
    },
    {
      icon: FileText,
      label: "Laporan",
      value: stats.reports,
    },
    {
      icon: Eye,
      label: "Pengunjung",
      value: stats.visitors,
    },
  ];

  return (
    <section className="py-20">

      <div className="container mx-auto px-4">

        <div className="text-center mb-12">

          <h2 className="text-4xl font-bold">
            Statistik PATUH-LH
          </h2>

          <p className="text-muted-foreground mt-3">
            Data diperbarui secara real-time
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {items.map((item) => (
            <Card
              key={item.label}
              className="group p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">

                <item.icon className="h-8 w-8 text-primary" />

              </div>

                <h3 className="text-5xl font-extrabold text-primary">
                  <CountUp
                    end={item.value}
                    duration={1.5}
                    separator="."
                    preserveValue
                  />
                  +
                </h3>

              <p className="mt-3 text-muted-foreground">

                {item.label}

              </p>

            </Card>
          ))}

        </div>

      </div>

    </section>
  );
}
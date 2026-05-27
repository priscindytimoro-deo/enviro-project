import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MONITOR PATUH - LH | Authentication",
  description:
    "Sistem Monitoring Kepatuhan Lingkungan Hidup - Login dan Registrasi Pengguna",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

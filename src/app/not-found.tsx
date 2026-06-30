import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground mt-2">Halaman tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/landing">kembali Ke Beranda</Link>
        </Button>
      </div>
    </div>
  )
}

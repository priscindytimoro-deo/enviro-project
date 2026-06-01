import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  const isAuthRoute =
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up")

  const isPublicLanding = path === "/" || path.startsWith("/landing")

  // =========================
  // 1. BELUM LOGIN
  // =========================
  if (!user) {
    // kalau akses protected page
    if (
      path.startsWith("/admin") ||
      path.startsWith("/kadis") ||
      path.startsWith("/kabid") ||
      path.startsWith("/pengawas") ||
      path.startsWith("/dashboard")
    ) {
      return NextResponse.redirect(new URL("/landing", req.url))
    }

    return res
  }

  // =========================
  // 2. SUDAH LOGIN → CEK ROLE
  // =========================
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role

  // =========================
  // 3. AUTO REDIRECT SAAT DI LANDING / ROOT
  // =========================
  if (path === "/" || path.startsWith("/landing") || isAuthRoute) {
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (role) {
      return NextResponse.redirect(
        new URL(`/${role}/dashboard`, req.url)
      )
    }
  }

  // =========================
  // 4. ROLE PROTECTION
  // =========================
  if (role !== "admin" && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  if (role !== "kadis" && path.startsWith("/kadis")) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  if (role !== "kabid" && path.startsWith("/kabid")) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  if (role !== "pengawas" && path.startsWith("/pengawas")) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  if (role !== "user" && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/landing/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/kadis/:path*",
    "/kabid/:path*",
    "/pengawas/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
  ],
}
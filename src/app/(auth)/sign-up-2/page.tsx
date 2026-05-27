import Image from "next/image"
import Link from "next/link"

import { SignupForm1 } from "./components/signup-form-2"

export default function SignUpPage() {
  return (
    <div
      className="
        bg-muted
        flex min-h-svh
        flex-col items-center
        justify-center
        gap-6 p-6 md:p-10
      "
    >

      <div className="flex w-full max-w-sm flex-col gap-6">

        {/* ======================================
            LOGO
        ====================================== */}
        <Link
          href="/"
          className="
            flex items-center gap-3
            self-center font-semibold
          "
        >

          <div
            className="
              bg-primary/10
              flex size-11
              items-center justify-center
              rounded-xl
              border border-border
            "
          >

            <Image
              src="/logo.svg"
              alt="Monitor Patuh LH"
              width={28}
              height={28}
              priority
              className="object-contain"
            />

          </div>

          <div className="flex flex-col leading-none">

            <span className="font-bold tracking-tight">
              MONITOR PATUH LH
            </span>

            <span className="text-xs text-muted-foreground">
              Lingkungan Hidup
            </span>

          </div>

        </Link>

        {/* ======================================
            FORM
        ====================================== */}
        <SignupForm1 />

      </div>

    </div>
  )
}
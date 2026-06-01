import { LoginForm1 } from "./components/login-form-1"
import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* BRAND */}
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="text-primary-foreground flex size-9 items-center justify-center rounded-md">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={24}
              height={24}
              className="size-6"
            />
          </div>

          MONITOR PATUH - LH
        </Link>

        {/* LOGIN FORM */}
        <LoginForm1 />

      </div>
    </div>
  )
}
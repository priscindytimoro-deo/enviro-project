import { Leaf } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Leaf className="h-4 w-4 fill-green-500 text-green-500" />
            <span>by</span>
            <Link
              href="https://www.instagram.com/cindiitimoro?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Priscindy Q. Timoro, S.T
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="border-b border-border bg-background">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6" aria-label="Navigasi utama">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Petshop
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Beranda
            </Link>
            <a href="#layanan" className="transition-colors hover:text-foreground">
              Layanan
            </a>
          </div>
          <Link
            href="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <section className="flex flex-1 items-center justify-center bg-muted/40 px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Daftar</h1>
          <p className="text-sm text-muted-foreground">
            Buat akun untuk mulai mengelola kebutuhan petshop Anda.
          </p>
        </div>
        <RegisterForm />
      </div>
    </section>
  )
}

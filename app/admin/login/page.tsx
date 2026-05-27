import type { Metadata } from 'next'

import { Logo } from '@/components/logo'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'Logg inn',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Logo variant="stacked" />
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
            Driftssystem
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}

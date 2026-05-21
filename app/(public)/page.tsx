import { Logo } from '@/components/logo'

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-16 md:pt-20">
      <div className="flex max-w-3xl flex-col items-center gap-10 text-center">
        <Logo variant="full" />
        <p className="text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg">
          Nybygg, totalrenovering, rehabilitering og prosjektledelse.
          <br />
          Tømrermester i Bergen med over 20 års erfaring.
        </p>
        <p className="text-muted-foreground/60 mt-8 font-mono text-[10px] tracking-[0.3em] uppercase">
          Nettsiden er under utvikling
        </p>
      </div>
    </section>
  )
}

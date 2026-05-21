export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          Tømrer Ronny Osvaag AS
        </p>
        <h1 className="text-foreground text-5xl font-semibold tracking-tight md:text-7xl">
          Troas Bygg
        </h1>
        <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
          Kvalitet i hvert prosjekt. Nybygg, totalrenovering, rehabilitering og prosjektledelse.
        </p>
        <p className="text-muted-foreground/60 mt-12 font-mono text-xs">Under utvikling</p>
      </div>
    </main>
  )
}

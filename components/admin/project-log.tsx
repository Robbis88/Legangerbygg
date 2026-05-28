import { getProjectLog } from '@/lib/queries/project-log'
import { deleteLogEntry } from '@/lib/actions/project-log'
import { LogEntryForm } from '@/components/admin/log-entry-form'
import { Button } from '@/components/ui/button'

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeZone: 'UTC' })

export async function ProjectLog({ projectId }: { projectId: string }) {
  const entries = await getProjectLog(projectId)
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' })

  return (
    <section className="border-border bg-background space-y-5 rounded-2xl border p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Prosjekt-tidslinje</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Bilder og notater fra felt. Bare innloggede ser dette.
        </p>
      </div>

      <LogEntryForm projectId={projectId} today={today} />

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ingen oppføringer ennå.</p>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="border-border rounded-xl border p-4"
            >
              <header className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {dateFmt.format(new Date(`${entry.entry_date}T00:00:00Z`))}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {entry.author_name ?? 'Ukjent'}
                  </p>
                </div>
                <form action={deleteLogEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                    Slett
                  </Button>
                </form>
              </header>

              {entry.body ? (
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{entry.body}</p>
              ) : null}

              {entry.photos.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {entry.photos.map((photo) =>
                    photo.url ? (
                      <a
                        key={photo.path}
                        href={photo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted aspect-square overflow-hidden rounded-lg"
                      >
                        {/* Vi viser et raw img-tag for at signerte URLer skal kunne brukes uten next/image-domene-konfig */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </a>
                    ) : null,
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

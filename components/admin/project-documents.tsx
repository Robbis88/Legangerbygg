import { getProjectDocuments } from '@/lib/queries/documents'
import { documentKindLabels } from '@/lib/validators/document'
import { deleteDocument } from '@/lib/actions/document'
import { formatNok } from '@/lib/payroll'
import { DocumentUpload } from '@/components/admin/document-upload'
import { Button } from '@/components/ui/button'

const dateFmt = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeZone: 'UTC' })

export async function ProjectDocuments({ projectId }: { projectId: string }) {
  const documents = await getProjectDocuments(projectId)

  return (
    <section className="border-border bg-background space-y-5 rounded-2xl border p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Kvitteringer & faktura</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Last opp kvitteringer og fakturaer. Beløpene summeres som materialkost på prosjektet.
        </p>
      </div>

      <DocumentUpload projectId={projectId} />

      {documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">Ingen dokumenter lastet opp ennå.</p>
      ) : (
        <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {doc.supplier || doc.file_name || 'Dokument'}
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    {documentKindLabels[doc.kind]}
                  </span>
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {doc.doc_date ? dateFmt.format(new Date(`${doc.doc_date}T00:00:00Z`)) : 'Uten dato'}
                  {doc.note ? ` · ${doc.note}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-medium tabular-nums">
                  {doc.amount == null ? '—' : formatNok(doc.amount)}
                </span>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-foreground text-sm underline-offset-4 hover:underline"
                  >
                    Åpne
                  </a>
                ) : null}
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={doc.id} />
                  <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                    Slett
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

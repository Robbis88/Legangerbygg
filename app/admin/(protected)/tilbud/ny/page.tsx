import type { Metadata } from 'next'

import { getInquiryById } from '@/lib/queries/inquiries'
import { projectTypeLabels } from '@/lib/validators/inquiry'
import { QuoteForm, type QuoteFormInitial } from '@/components/admin/quote-form'

export const metadata: Metadata = {
  title: 'Nytt tilbud',
  robots: { index: false, follow: false },
}

export default async function NyttTilbudPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiry?: string }>
}) {
  const params = await searchParams
  let initial: QuoteFormInitial | undefined

  if (params.inquiry) {
    const inquiry = await getInquiryById(params.inquiry)
    if (inquiry) {
      initial = {
        inquiry_id: inquiry.id,
        customer_name: inquiry.name,
        customer_email: inquiry.email,
        customer_phone: inquiry.phone,
        customer_address: inquiry.address,
        title: inquiry.project_type
          ? `${projectTypeLabels[inquiry.project_type]}${inquiry.address ? ` — ${inquiry.address}` : ''}`
          : 'Tilbud',
      }
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">Nytt tilbud</h1>
      <QuoteForm initial={initial} />
    </div>
  )
}

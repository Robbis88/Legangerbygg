'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button type="button" onClick={() => window.print()} variant="outline">
      <Printer className="size-4" />
      Skriv ut / Lagre som PDF
    </Button>
  )
}

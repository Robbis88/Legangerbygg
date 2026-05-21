/**
 * Plassholder for auto-genererte Supabase-typer.
 *
 * Når databasen er provisjonert, regenerer med:
 *   npx supabase gen types typescript --project-id <id> > types/supabase.ts
 *
 * eller (lokalt med Supabase CLI lenket):
 *   npx supabase gen types typescript --linked > types/supabase.ts
 */
export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

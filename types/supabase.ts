/**
 * Manuelt skrevet for å matche supabase/migrations/20260521120000_mvp_offentlig_nettside.sql.
 * Format følger 'npx supabase gen types typescript', slik at vi kan bytte til auto-gen senere
 * uten endringer i forbrukende kode. Regenerer med:
 *
 *   npx supabase gen types typescript --project-id dwdllwrinqdobywdhzgm > types/supabase.ts
 *
 * (krever SUPABASE_ACCESS_TOKEN eller 'supabase login').
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: Database['public']['Enums']['user_role'] | null
          active: boolean
          hourly_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          active?: boolean
          hourly_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          active?: boolean
          hourly_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          type: Database['public']['Enums']['project_type']
          status: Database['public']['Enums']['project_status']
          address: string | null
          description: string | null
          start_date: string | null
          end_date: string | null
          estimated_hours: number | null
          is_public: boolean
          cover_image_url: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          type: Database['public']['Enums']['project_type']
          status?: Database['public']['Enums']['project_status']
          address?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          is_public?: boolean
          cover_image_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          type?: Database['public']['Enums']['project_type']
          status?: Database['public']['Enums']['project_status']
          address?: string | null
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          is_public?: boolean
          cover_image_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          url: string
          caption: string | null
          sort_order: number
          is_before: boolean
          is_after: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          url: string
          caption?: string | null
          sort_order?: number
          is_before?: boolean
          is_after?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          url?: string
          caption?: string | null
          sort_order?: number
          is_before?: boolean
          is_after?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_images_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      reviews: {
        Row: {
          id: string
          customer_name: string
          customer_image_url: string | null
          rating: number
          body: string
          project_id: string | null
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_image_url?: string | null
          rating: number
          body: string
          project_id?: string | null
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_image_url?: string | null
          rating?: number
          body?: string
          project_id?: string | null
          published?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          project_type: Database['public']['Enums']['project_type'] | null
          budget: string | null
          description: string
          image_urls: string[]
          status: Database['public']['Enums']['inquiry_status']
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          project_type?: Database['public']['Enums']['project_type'] | null
          budget?: string | null
          description: string
          image_urls?: string[]
          status?: Database['public']['Enums']['inquiry_status']
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          project_type?: Database['public']['Enums']['project_type'] | null
          budget?: string | null
          description?: string
          image_urls?: string[]
          status?: Database['public']['Enums']['inquiry_status']
          created_at?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          id: string
          project_id: string
          profile_id: string
          work_date: string
          hours: number
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          profile_id: string
          work_date: string
          hours: number
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          profile_id?: string
          work_date?: string
          hours?: number
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'time_entries_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'time_entries_profile_id_fkey'
            columns: ['profile_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      payroll_settings: {
        Row: {
          id: number
          employer_tax_pct: number
          holiday_pay_pct: number
          pension_pct: number
          updated_at: string
        }
        Insert: {
          id?: number
          employer_tax_pct?: number
          holiday_pay_pct?: number
          pension_pct?: number
          updated_at?: string
        }
        Update: {
          id?: number
          employer_tax_pct?: number
          holiday_pay_pct?: number
          pension_pct?: number
          updated_at?: string
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          id: string
          project_id: string
          kind: Database['public']['Enums']['document_kind']
          supplier: string | null
          amount: number | null
          doc_date: string | null
          note: string | null
          storage_path: string
          file_name: string | null
          mime_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          kind?: Database['public']['Enums']['document_kind']
          supplier?: string | null
          amount?: number | null
          doc_date?: string | null
          note?: string | null
          storage_path: string
          file_name?: string | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          kind?: Database['public']['Enums']['document_kind']
          supplier?: string | null
          amount?: number | null
          doc_date?: string | null
          note?: string | null
          storage_path?: string
          file_name?: string | null
          mime_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_documents_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      quotes: {
        Row: {
          id: string
          quote_number: string | null
          inquiry_id: string | null
          customer_name: string
          customer_email: string | null
          customer_phone: string | null
          customer_address: string | null
          title: string
          intro: string | null
          notes: string | null
          status: Database['public']['Enums']['quote_status']
          vat_rate: number
          valid_until: string | null
          sent_at: string | null
          public_token: string | null
          signed_at: string | null
          signed_name: string | null
          signed_ip: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_number?: string | null
          inquiry_id?: string | null
          customer_name: string
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          title: string
          intro?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['quote_status']
          vat_rate?: number
          valid_until?: string | null
          sent_at?: string | null
          public_token?: string | null
          signed_at?: string | null
          signed_name?: string | null
          signed_ip?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_number?: string | null
          inquiry_id?: string | null
          customer_name?: string
          customer_email?: string | null
          customer_phone?: string | null
          customer_address?: string | null
          title?: string
          intro?: string | null
          notes?: string | null
          status?: Database['public']['Enums']['quote_status']
          vat_rate?: number
          valid_until?: string | null
          sent_at?: string | null
          public_token?: string | null
          signed_at?: string | null
          signed_name?: string | null
          signed_ip?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quotes_inquiry_id_fkey'
            columns: ['inquiry_id']
            referencedRelation: 'inquiries'
            referencedColumns: ['id']
          },
        ]
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          description: string
          quantity: number
          unit: string | null
          unit_price: number
          sort_order: number
        }
        Insert: {
          id?: string
          quote_id: string
          description: string
          quantity?: number
          unit?: string | null
          unit_price?: number
          sort_order?: number
        }
        Update: {
          id?: string
          quote_id?: string
          description?: string
          quantity?: number
          unit?: string | null
          unit_price?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'quote_items_quote_id_fkey'
            columns: ['quote_id']
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          },
        ]
      }
      project_log: {
        Row: {
          id: string
          project_id: string
          author_id: string | null
          author_name: string | null
          entry_date: string
          body: string
          photo_paths: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          author_id?: string | null
          author_name?: string | null
          entry_date?: string
          body?: string
          photo_paths?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          author_id?: string | null
          author_name?: string | null
          entry_date?: string
          body?: string
          photo_paths?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_log_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_log_author_id_fkey'
            columns: ['author_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      hms_articles: {
        Row: {
          id: string
          title: string
          slug: string | null
          category: string | null
          body: string
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          category?: string | null
          body?: string
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          category?: string | null
          body?: string
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [key: string]: never }
    Functions: {
      has_admin_access: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_staff: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'eier' | 'ansatt' | 'regnskap' | 'visning'
      project_type:
        | 'nybygg'
        | 'rehabilitering'
        | 'totalrenovering'
        | 'flipp'
        | 'moske'
        | 'leilighet'
        | 'rekkehus'
        | 'prosjektledelse'
        | 'innvendig'
        | 'utvendig'
        | 'annet'
      project_status: 'planlegging' | 'pagaende' | 'pa_vent' | 'ferdig'
      inquiry_status: 'ny' | 'behandlet'
      document_kind: 'kvittering' | 'faktura' | 'annet'
      quote_status: 'utkast' | 'sendt' | 'akseptert' | 'avslaatt'
    }
    CompositeTypes: { [key: string]: never }
  }
}

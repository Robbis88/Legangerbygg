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
    }
    CompositeTypes: { [key: string]: never }
  }
}

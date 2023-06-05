export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          content: string
          created_at: string
          downvotes: number
          id: string
          title: string
          upvotes: number
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number
          id?: string
          title: string
          upvotes?: number
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number
          id?: string
          title?: string
          upvotes?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

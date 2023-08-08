export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      criteria: {
        Row: {
          created_at: string | null
          criteria_description: string | null
          criteria_name: string
          id: number
        }
        Insert: {
          created_at?: string | null
          criteria_description?: string | null
          criteria_name: string
          id?: number
        }
        Update: {
          created_at?: string | null
          criteria_description?: string | null
          criteria_name?: string
          id?: number
        }
        Relationships: []
      }
      measures: {
        Row: {
          created_at: string | null
          id: number
          measure_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          measure_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          measure_name?: string
        }
        Relationships: []
      }
      trial_item: {
        Row: {
          created_at: string | null
          id: number
          item_text: string | null
          trial_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_text?: string | null
          trial_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          item_text?: string | null
          trial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_item_trial_id_fkey"
            columns: ["trial_id"]
            referencedRelation: "trials"
            referencedColumns: ["id"]
          }
        ]
      }
      trial_item_with_criteria: {
        Row: {
          created_at: string | null
          criteria_id: number | null
          id: number
          max_value: number
          min_value: number
          trial_item_id: number | null
        }
        Insert: {
          created_at?: string | null
          criteria_id?: number | null
          id?: number
          max_value: number
          min_value: number
          trial_item_id?: number | null
        }
        Update: {
          created_at?: string | null
          criteria_id?: number | null
          id?: number
          max_value?: number
          min_value?: number
          trial_item_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_item_with_criteria_criteria_id_fkey"
            columns: ["criteria_id"]
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_item_with_criteria_trial_item_id_fkey"
            columns: ["trial_item_id"]
            referencedRelation: "trial_item"
            referencedColumns: ["id"]
          }
        ]
      }
      trial_items_answers: {
        Row: {
          created_at: string | null
          criteria_id: number | null
          id: number
          partecipant_id: number
          score: number
          trial_item_id: number
          turn: number
        }
        Insert: {
          created_at?: string | null
          criteria_id?: number | null
          id?: number
          partecipant_id: number
          score: number
          trial_item_id: number
          turn: number
        }
        Update: {
          created_at?: string | null
          criteria_id?: number | null
          id?: number
          partecipant_id?: number
          score?: number
          trial_item_id?: number
          turn?: number
        }
        Relationships: [
          {
            foreignKeyName: "trial_items_answers_criteria_id_fkey"
            columns: ["criteria_id"]
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_items_answers_partecipant_id_fkey"
            columns: ["partecipant_id"]
            referencedRelation: "trial_partecipant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_items_answers_trial_item_id_fkey"
            columns: ["trial_item_id"]
            referencedRelation: "trial_item"
            referencedColumns: ["id"]
          }
        ]
      }
      trial_measures: {
        Row: {
          created_at: string | null
          id: number
          measure_id: number
          score: number
          trial_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          measure_id: number
          score: number
          trial_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          measure_id?: number
          score?: number
          trial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_measures_measure_id_fkey"
            columns: ["measure_id"]
            referencedRelation: "measures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_measures_trial_id_fkey"
            columns: ["trial_id"]
            referencedRelation: "trials"
            referencedColumns: ["id"]
          }
        ]
      }
      trial_partecipant: {
        Row: {
          created_at: string | null
          id: number
          isPresent: boolean | null
          partecipant_id: string | null
          trial_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          isPresent?: boolean | null
          partecipant_id?: string | null
          trial_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          isPresent?: boolean | null
          partecipant_id?: string | null
          trial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_partecipant_trial_id_fkey"
            columns: ["trial_id"]
            referencedRelation: "trials"
            referencedColumns: ["id"]
          }
        ]
      }
      trials: {
        Row: {
          created_at: string | null
          exported: boolean
          exported_at: string | null
          id: string
          owner_id: string
          status: number
        }
        Insert: {
          created_at?: string | null
          exported?: boolean
          exported_at?: string | null
          id: string
          owner_id: string
          status?: number
        }
        Update: {
          created_at?: string | null
          exported?: boolean
          exported_at?: string | null
          id?: string
          owner_id?: string
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "trials_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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


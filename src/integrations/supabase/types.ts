export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admission_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          message: string
          start_date: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          message: string
          start_date: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          message?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          category: string
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      cap_rounds: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          required_documents: string[] | null
          round_name: string
          round_number: number
          start_date: string
          year: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          required_documents?: string[] | null
          round_name: string
          round_number: number
          start_date: string
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          required_documents?: string[] | null
          round_name?: string
          round_number?: number
          start_date?: string
          year?: number
        }
        Relationships: []
      }
      colleges: {
        Row: {
          campus_area: string | null
          city: string
          created_at: string | null
          established_year: number | null
          fees_per_year: number | null
          hostel_available: boolean | null
          id: string
          location: string
          naac_rating: string | null
          name: string
          nirf_rank: number | null
          type: string
          university: string
        }
        Insert: {
          campus_area?: string | null
          city: string
          created_at?: string | null
          established_year?: number | null
          fees_per_year?: number | null
          hostel_available?: boolean | null
          id?: string
          location: string
          naac_rating?: string | null
          name: string
          nirf_rank?: number | null
          type: string
          university: string
        }
        Update: {
          campus_area?: string | null
          city?: string
          created_at?: string | null
          established_year?: number | null
          fees_per_year?: number | null
          hostel_available?: boolean | null
          id?: string
          location?: string
          naac_rating?: string | null
          name?: string
          nirf_rank?: number | null
          type?: string
          university?: string
        }
        Relationships: []
      }
      cutoff_data: {
        Row: {
          branch_id: string | null
          category: string
          college_id: string | null
          created_at: string | null
          cutoff_rank: number
          id: string
          quota: string
          round: number
          seats_available: number | null
          year: number
        }
        Insert: {
          branch_id?: string | null
          category: string
          college_id?: string | null
          created_at?: string | null
          cutoff_rank: number
          id?: string
          quota: string
          round: number
          seats_available?: number | null
          year: number
        }
        Update: {
          branch_id?: string | null
          category?: string
          college_id?: string | null
          created_at?: string | null
          cutoff_rank?: number
          id?: string
          quota?: string
          round?: number
          seats_available?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "cutoff_data_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutoff_data_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_data: {
        Row: {
          average_package: number | null
          branch_id: string | null
          college_id: string | null
          created_at: string | null
          highest_package: number | null
          id: string
          placement_percentage: number | null
          top_recruiters: string[] | null
          year: number
        }
        Insert: {
          average_package?: number | null
          branch_id?: string | null
          college_id?: string | null
          created_at?: string | null
          highest_package?: number | null
          id?: string
          placement_percentage?: number | null
          top_recruiters?: string[] | null
          year: number
        }
        Update: {
          average_package?: number | null
          branch_id?: string | null
          college_id?: string | null
          created_at?: string | null
          highest_package?: number | null
          id?: string
          placement_percentage?: number | null
          top_recruiters?: string[] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "placement_data_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_data_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: number | null
          application_link: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          eligibility_category: string[] | null
          id: string
          income_limit: number | null
          name: string
          provider: string | null
        }
        Insert: {
          amount?: number | null
          application_link?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligibility_category?: string[] | null
          id?: string
          income_limit?: number | null
          name: string
          provider?: string | null
        }
        Update: {
          amount?: number | null
          application_link?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligibility_category?: string[] | null
          id?: string
          income_limit?: number | null
          name?: string
          provider?: string | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          branch_id: string | null
          college_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          branch_id?: string | null
          college_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          branch_id?: string | null
          college_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

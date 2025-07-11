export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      movers: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          email: string | null
          hourly_rate: number | null
          id: string
          insurance_number: string | null
          is_active: boolean | null
          license_number: string | null
          phone: string | null
          profile_image_url: string | null
          rating: number | null
          service_areas: string[] | null
          total_jobs: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_number?: string | null
          is_active?: boolean | null
          license_number?: string | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          hourly_rate?: number | null
          id?: string
          insurance_number?: string | null
          is_active?: boolean | null
          license_number?: string | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message: string
          order_id: string | null
          recipient: string
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"] | null
          subject: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          order_id?: string | null
          recipient: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          order_id?: string | null
          recipient?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          category: Database["public"]["Enums"]["order_item_category"]
          created_at: string
          fragile: boolean | null
          id: string
          name: string
          order_id: string
          price: number | null
          quantity: number
          requires_disassembly: boolean | null
          volume_cubic_ft: number | null
          weight_lbs: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["order_item_category"]
          created_at?: string
          fragile?: boolean | null
          id?: string
          name: string
          order_id: string
          price?: number | null
          quantity?: number
          requires_disassembly?: boolean | null
          volume_cubic_ft?: number | null
          weight_lbs?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["order_item_category"]
          created_at?: string
          fragile?: boolean | null
          id?: string
          name?: string
          order_id?: string
          price?: number | null
          quantity?: number
          requires_disassembly?: boolean | null
          volume_cubic_ft?: number | null
          weight_lbs?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking: {
        Row: {
          created_at: string
          created_by: string | null
          estimated_arrival: string | null
          id: string
          location: string | null
          message: string | null
          order_id: string
          status: Database["public"]["Enums"]["move_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          estimated_arrival?: string | null
          id?: string
          location?: string | null
          message?: string | null
          order_id: string
          status: Database["public"]["Enums"]["move_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          estimated_arrival?: string | null
          id?: string
          location?: string | null
          message?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["move_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          additional_services_price: number | null
          assigned_mover_id: string | null
          base_price: number
          created_at: string
          destination_address: string
          destination_coordinates: unknown | null
          distance_miles: number | null
          estimated_hours: number | null
          id: string
          move_date: string
          move_time: string
          move_type: Database["public"]["Enums"]["move_type"]
          order_number: string
          origin_address: string
          origin_coordinates: unknown | null
          payment_status: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["move_status"]
          stripe_payment_intent_id: string | null
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_services_price?: number | null
          assigned_mover_id?: string | null
          base_price: number
          created_at?: string
          destination_address: string
          destination_coordinates?: unknown | null
          distance_miles?: number | null
          estimated_hours?: number | null
          id?: string
          move_date: string
          move_time: string
          move_type: Database["public"]["Enums"]["move_type"]
          order_number: string
          origin_address: string
          origin_coordinates?: unknown | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["move_status"]
          stripe_payment_intent_id?: string | null
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_services_price?: number | null
          assigned_mover_id?: string | null
          base_price?: number
          created_at?: string
          destination_address?: string
          destination_coordinates?: unknown | null
          distance_miles?: number | null
          estimated_hours?: number | null
          id?: string
          move_date?: string
          move_time?: string
          move_type?: Database["public"]["Enums"]["move_type"]
          order_number?: string
          origin_address?: string
          origin_coordinates?: unknown | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["move_status"]
          stripe_payment_intent_id?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing_rates: {
        Row: {
          base_hourly_rate: number
          base_rate_per_mile: number
          created_at: string
          disassembly_rate: number | null
          fragile_handling_rate: number | null
          fuel_surcharge_rate: number | null
          id: string
          is_active: boolean | null
          move_type: Database["public"]["Enums"]["move_type"]
          packing_service_rate: number | null
          rush_service_rate: number | null
          storage_rate_per_day: number | null
          updated_at: string
          weekend_surcharge_rate: number | null
        }
        Insert: {
          base_hourly_rate: number
          base_rate_per_mile: number
          created_at?: string
          disassembly_rate?: number | null
          fragile_handling_rate?: number | null
          fuel_surcharge_rate?: number | null
          id?: string
          is_active?: boolean | null
          move_type: Database["public"]["Enums"]["move_type"]
          packing_service_rate?: number | null
          rush_service_rate?: number | null
          storage_rate_per_day?: number | null
          updated_at?: string
          weekend_surcharge_rate?: number | null
        }
        Update: {
          base_hourly_rate?: number
          base_rate_per_mile?: number
          created_at?: string
          disassembly_rate?: number | null
          fragile_handling_rate?: number | null
          fuel_surcharge_rate?: number | null
          id?: string
          is_active?: boolean | null
          move_type?: Database["public"]["Enums"]["move_type"]
          packing_service_rate?: number | null
          rush_service_rate?: number | null
          storage_rate_per_day?: number | null
          updated_at?: string
          weekend_surcharge_rate?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      move_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      move_type: "local" | "long_distance" | "international"
      notification_status: "pending" | "sent" | "failed"
      notification_type: "email" | "sms" | "push"
      order_item_category:
        | "furniture"
        | "boxes"
        | "appliances"
        | "fragile"
        | "other"
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
    Enums: {
      move_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      move_type: ["local", "long_distance", "international"],
      notification_status: ["pending", "sent", "failed"],
      notification_type: ["email", "sms", "push"],
      order_item_category: [
        "furniture",
        "boxes",
        "appliances",
        "fragile",
        "other",
      ],
    },
  },
} as const

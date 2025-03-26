export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contractors: {
        Row: {
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          name: string
          rate: number
          skills: string[] | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          image_url?: string | null
          name: string
          rate: number
          skills?: string[] | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          rate?: number
          skills?: string[] | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          category: string
          createdat: number
          description: string
          id: string
          imageurl: string | null
          language: string
          previewcode: string
          price: number
          selleraddress: string
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          createdat: number
          description: string
          id: string
          imageurl?: string | null
          language: string
          previewcode: string
          price: number
          selleraddress: string
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          createdat?: number
          description?: string
          id?: string
          imageurl?: string | null
          language?: string
          previewcode?: string
          price?: number
          selleraddress?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          contractor_id: string | null
          created_at: string | null
          id: string
          memo: string | null
          metadata: Json | null
          payee_id: string | null
          payment_method: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          memo?: string | null
          metadata?: Json | null
          payee_id?: string | null
          payment_method?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          memo?: string | null
          metadata?: Json | null
          payee_id?: string | null
          payment_method?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyeraddress: string
          id: string
          listingid: string
          selleraddress: string
          status: string
          timestamp: number
          txhash: string
        }
        Insert: {
          amount: number
          buyeraddress: string
          id: string
          listingid: string
          selleraddress: string
          status: string
          timestamp: number
          txhash: string
        }
        Update: {
          amount?: number
          buyeraddress?: string
          id?: string
          listingid?: string
          selleraddress?: string
          status?: string
          timestamp?: number
          txhash?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listingid_fkey"
            columns: ["listingid"]
            isOneToOne: false
            referencedRelation: "listings"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

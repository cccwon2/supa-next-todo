export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          encrypted_password: string;
          email_confirmed_at: string | null;
          invited_at: string | null;
          confirmation_token: string;
          confirmation_sent_at: string | null;
          recovery_token: string;
          recovery_sent_at: string | null;
          email_change_token_new: string;
          email_change: string;
          email_change_sent_at: string | null;
          last_sign_in_at: string | null;
          raw_app_meta_data: Record<string, any>;
          raw_user_meta_data: Record<string, any>;
          is_super_admin: boolean | null;
          created_at: string;
          updated_at: string;
          phone: string | null;
          phone_confirmed_at: string | null;
          phone_change: string;
          phone_change_token: string;
          phone_change_sent_at: string | null;
          confirmed_at: string | null;
          email_change_token_current: string;
          email_change_confirm_status: number;
          banned_until: string | null;
          reauthentication_token: string;
          reauthentication_sent_at: string | null;
          is_sso_user: boolean;
          deleted_at: string | null;
          is_anonymous: boolean;
        };
      };
      todos: {
        Row: {
          id: number;
          inserted_at: string;
          is_complete: boolean | null;
          task: string | null;
          user_id: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          is_complete?: boolean | null;
          task?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

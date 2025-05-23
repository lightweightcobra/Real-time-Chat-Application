export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          created_by: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          added_by: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          added_by: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          added_by?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          type: string
          file_name: string | null
          file_size: string | null
          file_url: string | null
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          type: string
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          type?: string
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          created_at?: string
          is_read?: boolean
        }
      }
      chats: {
        Row: {
          id: string
          is_group: boolean
          group_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          is_group: boolean
          group_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          is_group?: boolean
          group_id?: string | null
          created_at?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}

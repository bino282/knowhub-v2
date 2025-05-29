export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bots: {
        Row: {
          id: string;
          name: string;
          description: string;
          avatarUrl: string | null;
          settings: Json;
          userId: string;
          dataSetId: string;
          chatId: string;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          avatarUrl: string | null;
          settings: Json;
          userId: string;
          dataSetId: string;
          chatId: string;
          createdAt: Date;
          updatedAt: Date;
        };
        Update: {
          id?: string;
          name: string;
          description: string;
          avatarUrl: string | null;
          settings: Json;
          userId: string;
          dataSetId: string;
          chatId: string;
          createdAt: Date;
          updatedAt: Date;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string;
          size: number;
          status: string;
          url: string;
          bot_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          size: number;
          status: string;
          url: string;
          bot_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          size?: number;
          status?: string;
          url?: string;
          bot_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          role: string;
          content: string;
          bot_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          role: string;
          content: string;
          bot_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: string;
          content?: string;
          bot_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}

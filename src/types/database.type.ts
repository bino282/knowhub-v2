import { $Enums } from "@/generated/prisma";

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
          dataset: DatasetInfo | null;
          sessionId: string | null;
          isActive: boolean;
          chatInfo: any;
          totalMessages?: number;
        };
        Insert: {
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
          dataset: DatasetInfo | null;
          sessionId: string | null;
          isActive: boolean;
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
export interface DatasetInfo {
  avatar: string | null;
  chunk_count: number;
  chunk_method: string;
  create_date: string;
  create_time: number;
  created_by: string;
  createdBy: string;
  createdById: string;
  description: string | null;
  document_count: number;
  embedding_model: string;
  id: string;
  language: string;
  name: string;
  pagerank: number;
  parser_config: {
    chunk_token_num: number;
    delimiter: string;
    html4excel: boolean;
    layout_recognize: string;
    raptor: Record<string, any>;
  };
  permission: string;
  similarity_threshold: number;
  status: string;
  tenant_id: string;
  token_num: number;
  update_date: string;
  update_time: number;
  vector_similarity_weight: number;
  totalMembers: number;
}
export interface FileInfo {
  chunk_count: number;
  chunk_method: string;
  create_date: string; // ISO date string or formatted date
  create_time: number; // timestamp in ms
  created_by: string;
  dataset_id: string;
  id: string;
  location: string;
  meta_fields: Record<string, unknown>; // empty object or any meta info
  name: string;
  parser_config: {
    chunk_token_num: number;
    delimiter: string;
    html4excel: boolean;
    layout_recognize: string;
    raptor: Record<string, unknown>; // could define more if you know structure
  };
  process_begin_at: number | null;
  process_duation: number; // maybe typo: process_duration?
  progress: number;
  progress_msg: string;
  run: string;
  size: number;
  source_type: string;
  status: string;
  thumbnail: string;
  token_count: number;
  type: string;
  update_date: string;
  update_time: number;
  createdByName: string;
}
export type Reference = {
  chunks: {
    vector_similarity: number;
    content: string;
    document_name?: string;
  }[];
  doc_aggs: {
    doc_name: string;
  }[];
};
export type FolderFile = {
  name: string | null;
  count: number;
};
export type Activity = {
  id: string;
  userId: string;
  createdAt: Date;
  action: $Enums.ActivityType;
  targetType: string;
  targetName: string;
  user: {
    name: string | null;
  };
};
export interface TeamMember {
  id: string;
  adminId: string;
  memberId: string;
  member: {
    id: string;
    name: string;
    email: string;
  };
  status: $Enums.InviteTeamStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface TeamJoined {
  id: string;
  adminId: string;
  memberId: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  status: $Enums.InviteTeamStatus;
  createdAt: Date;
  updatedAt: Date;
}

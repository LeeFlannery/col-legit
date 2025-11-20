// Re-export all database types
export * from "./database";

// Additional utility types can be added here
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

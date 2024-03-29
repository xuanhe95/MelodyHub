  // album.model.ts
  export interface Album {
    id: string;
    title: string;
    cover_art: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }
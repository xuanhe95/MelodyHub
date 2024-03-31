  import { Track } from './track';
  
  // album.model.ts
  export interface Album {
    id: string;
    title: string;
    tracks?: Track[];
  }


export interface Track {
    id: string;
    title: string;
    tempo?: number;
    danceability?: number;
    release_date?: Date;
    energy?: number;
    duration?: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}

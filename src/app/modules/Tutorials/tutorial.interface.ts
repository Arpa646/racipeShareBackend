export interface Tutorial {
  _id?: string;
  title: string;
  youtubeUrl: string;
  category?: string; // Optional category field (e.g., "Recommendation", "Tutorial", etc.)
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

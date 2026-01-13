export interface Genre {
  _id?: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

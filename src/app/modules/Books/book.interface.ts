export interface User {
  _id?: string;
  name: string;
  email: string;
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  coverImage?: string;
  publishedDate?: Date;
  genre?: string; // Genre ID reference
  pages?: number;
  user: string; // User ID who created/added the book
  isDeleted: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

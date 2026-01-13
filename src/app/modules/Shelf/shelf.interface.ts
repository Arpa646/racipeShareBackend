export interface Shelf {
  _id?: string;
  userId: string; // User ID
  bookId: string; // Book ID
  status: "want" | "reading" | "read"; // Reading status
  progress?: number; // Reading progress (0-100)
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

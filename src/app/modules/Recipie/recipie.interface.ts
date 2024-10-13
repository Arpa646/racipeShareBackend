// interfaces/User.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  user: User; // Reference to the User interface
  comment?: string; // Optional comment
  // Optional rating, e.g., 1 to 5
  date: Date;
}

export interface Rating {
  user: User; // Reference to the User interface
  rating?: number; // Optional comment
  // Optional rating, e.g., 1 to 5
  date: Date;
}




export interface Recipe {
  _id: string;
  title: string;
  time: string;
  image?: string; // Image is optional
  recipe: string;
  user: User; // Reference to the User interface
  comments?: Comment[];
  rating?: Rating[]; // Array of comments, can be empty
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isPublished:boolean;

  likedBy: string[]; // Array of user IDs who liked the recipe
  dislikedBy: string[]; // Array of user IDs who disliked the recipe

}

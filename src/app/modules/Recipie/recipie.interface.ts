// interfaces/User.ts
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;

}

export interface Comment {
  _id?: string;
  userId: User; // Reference to the User interface
  comment?: string; // Optional comment
  // Optional rating, e.g., 1 to 5

}

export interface Rating {
  userId: User; // Reference to the User interface
  rating?: number; // Optional comment
  // Optional rating, e.g., 1 to 5

}




export interface Recipe {
  _id?: string;
  title: string;
  time: string;
  image?: string; // Image is optional
  recipe: string;
  user: User; // Reference to the User interface
  comments?: Comment[];
  ratings?: Rating[]; // Array of comments, can be empty
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  isPublished:boolean;
  rating?:number;
  likedBy: string[]; // Array of user IDs who liked the recipe
  dislikedBy: string[]; // Array of user IDs who disliked the recipe

}

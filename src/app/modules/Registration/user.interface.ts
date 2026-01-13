export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  address: string;
  image?: string; // User profile image URL
  isPremium: boolean;
  isDeleted: boolean;
  isBlock: boolean;

  // New fields for follow/following system
  followers: string[];  // Array of user IDs representing followers
  following: string[];  // Array of user IDs representing the users this user is following
}

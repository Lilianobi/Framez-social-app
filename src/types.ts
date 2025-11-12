export interface Post {
  id: string;
  userId: string;
  userName: string;    // required for PostCard
  caption: string;
  imageUrl: string;    // always a string for TS safety
  likes?: string[];
  createdAt: number;
  userEmail?: string;
}

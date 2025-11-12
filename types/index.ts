import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  caption: string;
  imageUrl: string | null;
  likes: string[];
  createdAt: number | Timestamp;
  updatedAt?: number | Timestamp;
}

export interface User {
  displayName: string | null;
  email: string | null;
  uid: string;
  photoURL?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

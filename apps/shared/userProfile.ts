export interface UserProfile {
    name: string;
    surname: string;
    profilePicture?: string | null;
    createdAt: Date;
    lastSeen: Date;
    profileText: string;
  }
  
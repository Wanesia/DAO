import { InstrumentName, Genre } from "enums";

export interface Instrument {
  name: InstrumentName;
  level: number;
  genres: Genre[];
}

export interface Location {
  city: string;
  postCode: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  authProvider: "local" | "facebook";
  phone?: string;
  location?: Location;
  createdAt: Date;
  lastSeen: Date;
  dateOfBirth?: Date;
  profileText?: string;
  profilePicture?: string | null;
  isSeeking?: boolean;
  isSubscribedToNewsletter: boolean;
  instruments: Instrument[];
  ensembleIds?: string[];
  facebookId?: string;
  slug: string;
}
export interface UpdateSettingsDto {
  password?: string;
  newPassword?: string;
  isSubscribedToNewsletter?: boolean;
}
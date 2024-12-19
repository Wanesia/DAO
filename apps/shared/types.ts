import { Types } from "mongoose";
import { MusicianCount, PracticeFrequency, EnsembleType, Genre, InstrumentName, JoinRequestStatus } from "./enums";
import { FieldValues } from "react-hook-form";

export interface User {
  id: number;
  email: string;
  name: string;
};

export interface LoginResponse {
  accessToken: string;
  user: User;
};

export interface LoginPayload {
  email: string;
  password: string;
};

export interface RegisterUserPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  isSubscribedToNewsletter: boolean;
};

export interface Location {
  city: string;
  postCode: string;
};

export interface JoinRequest {
  userId: string;
  status: JoinRequestStatus;
  _id: string;
};


export type Ensemble = {
  _id: string;
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  homepageUrl?: string;
  location: Location;
  number_of_musicians: MusicianCount;
  practice_frequency: PracticeFrequency;
  genres: Genre[];
  type: EnsembleType;
  member_ids: string[];
  creator: string;
  joinRequests: JoinRequest[];
};

export interface EnsembleDto extends FieldValues {
  name: string;
  image: File;
  description?: string;
  homepageUrl?: string;
  location: Location;
  number_of_musicians: MusicianCount;
  practice_frequency: PracticeFrequency;
  genres: Genre[];
  type: EnsembleType;
}

export interface Instrument {
  name: InstrumentName;
  level: number;
  genres: Genre[];
}
export interface FakeUser {
  _id: Types.ObjectId;
  name: string;
  surname: string;
  email: string;
  slug: string;
  password?: string;
  authProvider: "local";
  phone: string;
  location: Location;
  createdAt: Date;
  lastSeen: Date;
  dateOfBirth: Date;
  profileText: string;
  profilePicture: string;
  isSeeking: boolean;
  isSubscribedToNewsletter: boolean;
  instruments: Instrument[];
  ensembleIds: Types.ObjectId[];
}
export interface FakeEnsemble {
  _id: Types.ObjectId;
  name: string;
  imageUrl: string;
  description: string;
  homepageUrl: string;
  location: Location;
  number_of_musicians: MusicianCount;
  practice_frequency: PracticeFrequency;
  genres: Genre[];
  type: EnsembleType;
  member_ids: Types.ObjectId[];
  creator: Types.ObjectId;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  instrument: Instrument;
  location: Location;
  ensemble: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    accessToken: string;
  };
}

export class PostWithEnsembleDTO {
  _id: string;
  title: string;
  description: string;
  createdAt?: Date;
  ensemble: {
    _id: string;
    name: string;
    imageUrl?: string;
    number_of_musicians?: number;
    creator: string;
    member_ids: string[];
  };
  location: {
    city: string;
    postCode: string;
  };
  instrument: {
    name: InstrumentName;
    level: number;
    genres: Genre[];
  };
}

export interface FakePost {
  _id: Types.ObjectId;
  title: string;
  description: string;
  ensemble: Types.ObjectId; 
  instrument: Instrument;
  location: Location;
}

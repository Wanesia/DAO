import { Types } from "mongoose";
import { MusicianCount, PracticeFrequency, EnsembleType, Genre, InstrumentName } from "./enums";
import { FieldValues } from "react-hook-form";

export type User = {
  id: number;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterUserPayload = {
  name: string;
  surname: string;
  email: string;
  password: string;
  isSubscribedToNewsletter: boolean;
};

export type Location = {
  city: string;
  postCode: string;
};

export type Ensemble = {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  homepageUrl?: string;
  location: Location;
  number_of_musicians: MusicianCount;
  practice_frequency: PracticeFrequency;
  genres: Genre[];
  type: EnsembleType;
};

export type EnsembleDto = FieldValues & {
  name: string;
  image: File;
  description?: string;
  homepageUrl?: string;
  location: Location;
  number_of_musicians: MusicianCount;
  practice_frequency: PracticeFrequency;
  genres: Genre[];
  type: EnsembleType;
};

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

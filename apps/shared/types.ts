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


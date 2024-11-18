export type User = {
  id: number;
  email: string;
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

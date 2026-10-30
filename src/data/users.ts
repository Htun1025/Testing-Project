
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;

  role: "ADMIN" | "USER";
};

export const users: User[] = [
  {
    id: 1,
    name: "Admin",
    username: "admin123",
    email: "admin@gmail.com",
    role: "ADMIN",
  },
  {
    id: 2,
    name: "Test User",
    username: "user123",
    email: "user@gmail.com",
    role: "USER",
  },
];

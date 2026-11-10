import type { User ,FakeLoginUser } from "@/types";

// User Management Table အတွက် Fake Data
export const initialUsers: User[] = [
  {
    id: 1,
    name: "Administrator",
    username: "admin",
    email: "admin@gmail.com",
    phone: "09123456789",
    nrc: "12/ABC(N)123456",
    address: "Yangon",
    status: "Active",
    role: "ADMIN",
  },
  {
    id: 2,
    name: "John Doe",
    username: "john",
    email: "john@gmail.com",
    phone: "09234567890",
    nrc: "12/ABC(N)234567",
    address: "Mandalay",
    status: "Active",
    role: "USER",
  },
  {
    id: 3,
    name: "Jane Smith",
    username: "jane",
    email: "jane@gmail.com",
    phone: "09345678901",
    nrc: "12/ABC(N)345678",
    address: "Naypyidaw",
    status: "Inactive",
    role: "USER",
  },
];


export const initialLoginUsers: FakeLoginUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@gmail.com",
    password: "admin123",
    status: "Active",
    role: "ADMIN",
  },
  {
    id: 2,
    username: "user",
    email: "user@gmail.com",
    password: "user123",
    status: "Active",
    role: "USER",
  },
];
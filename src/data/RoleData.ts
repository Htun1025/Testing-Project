import { Role } from "@/types";

export const initialRoles: Role[] = [
  {
    id: 1,
    name: "ADMIN",
    description: "Full system access and management",
    status: "Active",
    users: 1,
    permissions: 17,
  },
  {
    id: 2,
    name: "MAKER",
    description: "Create and submit requests",
    status: "Active",
    users: 3,
    permissions: 5,
  },
  {
    id: 3,
    name: "CHECKER",
    description: "Review and check submitted requests",
    status: "Active",
    users: 2,
    permissions: 6,
  },
  {
    id: 4,
    name: "APPROVER",
    description: "Approve or reject requests",
    status: "Active",
    users: 2,
    permissions: 7,
  },
];


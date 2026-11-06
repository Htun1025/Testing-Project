
import type { Role , RoleForm } from "@/types";

export const initialRoles: Role[] = [
  {
    id: 1,
    name: "ADMIN",
    code: "ADMIN",
    description: "Full system access and management",
    status: "ACTIVE",
    createdAt: "2026-11-01T09:00:00.000Z",
    updatedAt: "2026-11-01T09:00:00.000Z",
    _count: {
      users: 1,
      rolePermissions: 17,
    },
  },
  {
    id: 2,
    name: "MAKER",
    code: "MAKER",
    description: "Create and submit requests",
    status: "ACTIVE",
    createdAt: "2026-11-02T09:00:00.000Z",
    updatedAt: "2026-11-02T09:00:00.000Z",
    _count: {
      users: 3,
      rolePermissions: 5,
    },
  },
  {
    id: 3,
    name: "CHECKER",
    code: "CHECKER",
    description: "Review and check submitted requests",
    status: "ACTIVE",
    createdAt: "2026-11-03T09:00:00.000Z",
    updatedAt: "2026-11-03T09:00:00.000Z",
    _count: {
      users: 2,
      rolePermissions: 6,
    },
  },
  {
    id: 4,
    name: "APPROVER",
    code: "APPROVER",
    description: "Approve or reject requests",
    status: "ACTIVE",
    createdAt: "2026-11-04T09:00:00.000Z",
    updatedAt: "2026-11-04T09:00:00.000Z",
    _count: {
      users: 2,
      rolePermissions: 7,
    },
  },
  {
    id: 5,
    name: "SUPER_ADMIN",
    code: "SUPER_ADMIN",
    description: "Complete control over all system modules",
    status: "ACTIVE",
    createdAt: "2026-11-05T09:00:00.000Z",
    updatedAt: "2026-11-05T09:00:00.000Z",
    _count: {
      users: 1,
      rolePermissions: 20,
    },
  },
  {
    id: 6,
    name: "MANAGER",
    code: "MANAGER",
    description: "Manage users, teams and department operations",
    status: "ACTIVE",
    createdAt: "2026-11-05T10:00:00.000Z",
    updatedAt: "2026-11-05T10:00:00.000Z",
    _count: {
      users: 3,
      rolePermissions: 12,
    },
  },
  {
    id: 7,
    name: "SUPERVISOR",
    code: "SUPERVISOR",
    description: "Monitor team activities and performance",
    status: "ACTIVE",
    createdAt: "2026-11-05T11:00:00.000Z",
    updatedAt: "2026-11-05T11:00:00.000Z",
    _count: {
      users: 4,
      rolePermissions: 9,
    },
  },
  {
    id: 8,
    name: "EDITOR",
    code: "EDITOR",
    description: "Edit and update assigned records",
    status: "ACTIVE",
    createdAt: "2026-11-05T12:00:00.000Z",
    updatedAt: "2026-11-05T12:00:00.000Z",
    _count: {
      users: 5,
      rolePermissions: 4,
    },
  },
  {
    id: 9,
    name: "VIEWER",
    code: "VIEWER",
    description: "View system information without editing",
    status: "ACTIVE",
    createdAt: "2026-11-05T13:00:00.000Z",
    updatedAt: "2026-11-05T13:00:00.000Z",
    _count: {
      users: 8,
      rolePermissions: 3,
    },
  },
  {
    id: 10,
    name: "GUEST",
    code: "GUEST",
    description: "Limited access to basic system features",
    status: "INACTIVE",
    createdAt: "2026-11-05T14:00:00.000Z",
    updatedAt: "2026-11-05T14:00:00.000Z",
    _count: {
      users: 0,
      rolePermissions: 1,
    },
  },
];


//database in calling use data
/* 
export const initialForm: RoleForm = {
  name: "",
  code: "",
  status: "ACTIVE",
};
*/

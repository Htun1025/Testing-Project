import type { Role, Permission ,PermissionForm } from "@/types";

// Default permission form
export const defaultForm: PermissionForm = {
  name: "",
  module: "User",
  action: "Read",
  description: "",
  status: "Active",
};

// Create initial role permission matrix
export const createInitialMatrix = (
  roles: Role[],
  permissions: Permission[],
): Record<number, number[]> => {
  return Object.fromEntries(
    roles.map((role) => [
      role.id,
      role.name.toLowerCase() === "admin"
        ? permissions
            .filter((permission) => permission.status === "Active")
            .map((permission) => permission.id)
        : [],
    ]),
  ) as Record<number, number[]>;
};
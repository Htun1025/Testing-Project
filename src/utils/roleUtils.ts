import type { RoleForm, Role } from "@/types";
import type { Permission } from "@/types";
import { initialPermissions } from "@/data/PermissionData";

export const DRAFT_ROLE_ID = -1;

// Default role form
export const initialForm: RoleForm = {
  name: "",
  code: "",
  status: "ACTIVE",
};

// Create initial permission matrix
export const createInitialRoleMatrix = (
  roles: Role[],
  permissions: Permission[] = initialPermissions,
): Record<number, number[]> => {
  const activePermissionIds = permissions
    .filter((permission) => permission.status === "ACTIVE")
    .map((permission) => permission.id);

  return Object.fromEntries(
    roles.map((role) => [
      role.id,
      role.code === "ADMIN" ? [...activePermissionIds] : [],
    ]),
  ) as Record<number, number[]>;
};
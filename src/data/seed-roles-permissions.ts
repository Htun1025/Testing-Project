
import "dotenv/config";

import {
  PrismaClient,
  UserRole,
  UserStatus,
  PermissionStatus,
} from "../../generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const roles = [
  { name: "Admin", code: UserRole.ADMIN },
  { name: "User", code: UserRole.USER },
  { name: "Checker", code: UserRole.CHECKER },
  { name: "Maker", code: UserRole.MAKER },
  { name: "Approver", code: UserRole.APPROVER },
];

const permissions = [
  {
    name: "Dashboard Read",
    module: "Dashboard",
    action: "Read",
    description: "View dashboard information",
  },
  {
    name: "User Create",
    module: "User",
    action: "Create",
    description: "Create new users",
  },
  {
    name: "User Read",
    module: "User",
    action: "Read",
    description: "View user information",
  },
  {
    name: "User Update",
    module: "User",
    action: "Update",
    description: "Update user information",
  },
  {
    name: "User Delete",
    module: "User",
    action: "Delete",
    description: "Delete users",
  },
  {
    name: "Role Create",
    module: "Role",
    action: "Create",
    description: "Create new roles",
  },
  {
    name: "Role Read",
    module: "Role",
    action: "Read",
    description: "View roles",
  },
  {
    name: "Role Update",
    module: "Role",
    action: "Update",
    description: "Update roles",
  },
  {
    name: "Role Delete",
    module: "Role",
    action: "Delete",
    description: "Delete roles",
  },
  {
    name: "Permission Create",
    module: "Permission",
    action: "Create",
    description: "Create permissions",
  },
  {
    name: "Permission Read",
    module: "Permission",
    action: "Read",
    description: "View permissions",
  },
  {
    name: "Permission Update",
    module: "Permission",
    action: "Update",
    description: "Update permissions",
  },
  {
    name: "Permission Delete",
    module: "Permission",
    action: "Delete",
    description: "Delete permissions",
  },
  {
    name: "Settings Read",
    module: "Settings",
    action: "Read",
    description: "View application settings",
  },
];

async function main() {
  console.log("Seeding roles...");

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: {
        name: role.name,
        code: role.code,
        status: UserStatus.ACTIVE,
      },
    });
  }

  console.log("Roles created.");

  console.log("Seeding permissions...");

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        module_action: {
          module: permission.module,
          action: permission.action,
        },
      },
      update: {},
      create: {
        ...permission,
        status: PermissionStatus.ACTIVE,
      },
    });
  }

  console.log("Permissions created.");

  const adminRole = await prisma.role.findUnique({
    where: { code: UserRole.ADMIN },
  });

  const activePermissions = await prisma.permission.findMany({
    where: { status: PermissionStatus.ACTIVE },
    select: { id: true },
  });

  if (adminRole) {
    await prisma.rolePermission.createMany({
      data: activePermissions.map((permission) => ({
        roleId: adminRole.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log("Admin permissions assigned.");
  console.log("Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

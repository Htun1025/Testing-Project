
import "dotenv/config";
import { db } from "../src/lib/db";
import { hash } from "bcryptjs";
import { Prisma } from "../generated/prisma/client";

async function main() {
  console.log("Starting database seed...");

  // 1. Create default dynamic roles
  const roleData = [
    { name: "Admin", code: "ADMIN" },
    { name: "User", code: "USER" },
    { name: "Checker", code: "CHECKER" },
    { name: "Maker", code: "MAKER" },
    { name: "Approver", code: "APPROVER" },
  ];

  const roleMap = new Map<string, number>();

  for (const item of roleData) {
    const role = await db.role.upsert({
      where: {
        code: item.code,
      },
      update: {
        name: item.name,
      },
      create: {
        name: item.name,
        code: item.code,
        status: "ACTIVE",
      },
    });

    roleMap.set(item.code, role.id);

    console.log("Role ready:", role.name);
  }

  // 2. User seed data
  const users = [
    {
      name: "Admin User",
      username: "admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      phone: "09123456789",
      nrc: "12/ABC(N)123456",
      address: "Yangon, Myanmar",
      roleCode: "ADMIN",
    },
    {
      name: "Test User",
      username: "user",
      email: "user@gmail.com",
      password: "User@123",
      phone: "09987654321",
      nrc: "12/XYZ(N)654321",
      address: "Mandalay, Myanmar",
      roleCode: "USER",
    },
    {
      name: "Test Checker",
      username: "checker",
      email: "checker@gmail.com",
      password: "Checker@123",
      phone: "09111222333",
      nrc: "12/YK(N)654321",
      address: "Yangon, Myanmar",
      roleCode: "CHECKER",
    },
    {
      name: "Test Maker",
      username: "maker",
      email: "maker@gmail.com",
      password: "Maker@123",
      phone: "09222333444",
      nrc: "12/TKT(N)654321",
      address: "Yangon, Myanmar",
      roleCode: "MAKER",
    },
    {
      name: "Test Approver",
      username: "approver",
      email: "approver@gmail.com",
      password: "Approver@123",
      phone: "09333444555",
      nrc: "12/TGG(N)654321",
      address: "Yangon, Myanmar",
      roleCode: "APPROVER",
    },
  ];

  // 3. Create users and connect roles
  for (const user of users) {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username: user.username },
          { email: user.email },
          { nrc: user.nrc },
        ],
      },
    });

    if (existingUser) {
      console.log("Already exists:", user.username);
      continue;
    }

    const roleId = roleMap.get(user.roleCode);

    if (!roleId) {
      throw new Error(`Role not found: ${user.roleCode}`);
    }

    const hashedPassword = await hash(user.password, 12);

    const { password, roleCode, ...userData } = user;

    const createdUser = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        status: "ACTIVE",
        role: {
          connect: {
            id: roleId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    console.log(
      `Created: ${createdUser.username} (${createdUser.role.name})`
    );
  }

  console.log("--------------------------------");
  console.log("Total users:", await db.user.count());
  console.log("Total roles:", await db.role.count());
  console.log("Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });

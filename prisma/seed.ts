
import "dotenv/config";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { Prisma } from "../generated/prisma/client";

async function main() {
  const users = [
    {
      name: "Admin User",
      username: "admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      phone: "09123456789",
      nrc: "12/ABC(N)123456",
      address: "Yangon, Myanmar",
      status: "ACTIVE",
      role: "ADMIN",
    },
    {
      name: "Test User",
      username: "user",
      email: "user@gmail.com",
      password: "User@123",
      phone: "09987654321",
      nrc: "12/XYZ(N)654321",
      address: "Mandalay, Myanmar",
      status: "ACTIVE",
      role: "USER",
    },
    {
      name: "Test Checker",
      username: "checker",
      email: "checker@gmail.com",
      password: "Checker@123",
      phone: "09111222333",
      nrc: "12/YK(N)654321",
      address: "Yangon, Myanmar",
      status: "ACTIVE",
      role: "CHECKER",
    },
    {
      name: "Test Maker",
      username: "maker",
      email: "maker@gmail.com",
      password: "Maker@123",
      phone: "09222333444",
      nrc: "12/TKT(N)654321",
      address: "Yangon, Myanmar",
      status: "ACTIVE",
      role: "MAKER",
    },
    {
      name: "Test Approver",
      username: "approver",
      email: "approver@gmail.com",
      password: "Approver@123",
      phone: "09333444555",
      nrc: "12/TGG(N)654321",
      address: "Yangon, Myanmar",
      status: "ACTIVE",
      role: "APPROVER",
    },
  ] satisfies Prisma.UserCreateInput[];

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

    const hashedPassword = await hash(user.password, 12);

    const { password, ...userData } = user;

    const createdUser = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        status: true,
        role: true,
      },
    });

    console.log("Created:", createdUser.username);
  }

  console.log("Total users:", await db.user.count());
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });

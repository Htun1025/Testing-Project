
import "dotenv/config";
import { db } from "../lib/db";
import { hash } from "bcryptjs";
import { Prisma } from "../../generated/prisma/client";

async function main() {
  const hashedPassword = await hash("Admin@123", 10);

  const users: Prisma.UserCreateInput[] = [
    {
      name: "Admin User",
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "09123456789",
      nrc: "12/ABC(N)123456",
      address: "Yangon, Myanmar",
      status: "ACTIVE",
    },
    {
      name: "Test User",
      username: "user123",
      email: "user@gmail.com",
      password: hashedPassword,
      phone: "09987654321",
      nrc: "12/XYZ(N)654321",
      address: "Mandalay, Myanmar",
      status: "ACTIVE",
    },
  ];

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

    const createdUser = await db.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        nrc: true,
        address: true,
        status: true,
      },
    });

    console.log("Created:", createdUser);
  }

  const totalUsers = await db.user.count();

  console.log("Total users in database:", totalUsers);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });

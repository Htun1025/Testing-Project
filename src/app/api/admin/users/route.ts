import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

// GET: Database ထဲက User အားလုံးကို ရယူရန်
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        nrc: true,
        address: true,
        status: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET Users Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: User အသစ်ထည့်ရန်
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      username,
      email,
      password,
      phone,
      nrc,
      address,
      status,
      roleId,
    } = body;

    // Required fields စစ်ဆေးခြင်း
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof nrc !== "string" ||
      !nrc.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      !status ||
      !roleId
    ) {
      return NextResponse.json(
        { message: "All fields are required, including role" },
        { status: 400 }
      );
    }

    // Status validation
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid user status" },
        { status: 400 }
      );
    }

    // Role ID validation
    const parsedRoleId = Number(roleId);

    if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
      return NextResponse.json(
        { message: "Please select a valid role" },
        { status: 400 }
      );
    }

    // Role ရှိ၊ မရှိ စစ်ဆေးခြင်း
    const role = await db.role.findUnique({
      where: {
        id: parsedRoleId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        { message: "Selected role does not exist" },
        { status: 404 }
      );
    }

    if (role.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Cannot assign an inactive role" },
        { status: 400 }
      );
    }

    // Duplicate username, email, NRC စစ်ဆေးခြင်း
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanNrc = nrc.trim();

    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanEmail },
          { nrc: cleanNrc },
        ],
      },
      select: {
        username: true,
        email: true,
        nrc: true,
      },
    });

    if (existingUser) {
      let message = "User information already exists";

      if (existingUser.username === cleanUsername) {
        message = "Username already exists";
      } else if (existingUser.email === cleanEmail) {
        message = "Email already exists";
      } else if (existingUser.nrc === cleanNrc) {
        message = "NRC already exists";
      }

      return NextResponse.json({ message }, { status: 409 });
    }

    // Password ကို hash လုပ်ခြင်း
    const hashedPassword = await hash(password, 12);

    // Database ထဲသို့ User အသစ်ထည့်ရန်
    const user = await db.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone.trim(),
        nrc: cleanNrc,
        address: address.trim(),
        status,
        role: {
          connect: {
            id: parsedRoleId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        nrc: true,
        address: true,
        status: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST User Error:", error);

    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

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
    } = body;

    // Required fields စစ်ဆေးခြင်း
    if (
      !name?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password?.trim() ||
      !phone?.trim() ||
      !nrc?.trim() ||
      !address?.trim() ||
      !status
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Duplicate username, email, NRC စစ်ဆေးခြင်း
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: email.trim() },
          { nrc: nrc.trim() },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username, email or NRC already exists" },
        { status: 409 }
      );
    }

    // Password ကို hash လုပ်ခြင်း
    const hashedPassword = await hash(password, 10);

    // Database ထဲသို့ User အသစ်ထည့်ခြင်း
    const user = await db.user.create({
      data: {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword,
        phone: phone.trim(),
        nrc: nrc.trim(),
        address: address.trim(),
        status,
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
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

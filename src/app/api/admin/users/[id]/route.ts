
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH: ရှိပြီးသား User ကို Update လုပ်ရန်
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);

    // ID စစ်ဆေးခြင်း
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      username,
      email,
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

    // User ရှိမရှိ စစ်ဆေးခြင်း
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Username, Email, NRC တူညီနေသော အခြား User ရှိမရှိ စစ်ဆေးခြင်း
    const duplicateUser = await db.user.findFirst({
      where: {
        id: { not: userId },
        OR: [
          { username: username.trim() },
          { email: email.trim() },
          { nrc: nrc.trim() },
        ],
      },
    });

    if (duplicateUser) {
      return NextResponse.json(
        {
          message: "Username, email or NRC already exists",
        },
        { status: 409 }
      );
    }

    // User Update လုပ်ခြင်း
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
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
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH User Error:", error);

    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

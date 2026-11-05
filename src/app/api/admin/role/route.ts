
import { NextResponse } from "next/server";
import { UserStatus } from "../../../../../generated/prisma/client";
import { db } from "@/lib/db";

// GET: Get all roles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status");

    const roles = await db.role.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    code: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},
          status === "ACTIVE" || status === "INACTIVE"
            ? { status: status as UserStatus }
            : {},
        ],
      },
      include: {
        _count: {
          select: {
            users: true,
            rolePermissions: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: roles,
      total: roles.length,
    });
  } catch (error) {
    console.error("GET ROLES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch roles.",
      },
      { status: 500 }
    );
  }
}

// POST: Create new role
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim().toUpperCase().replace(/\s+/g, "_")
        : "";

    const status = body.status ?? "ACTIVE";

    // Required validation
    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Role name and code are required.",
        },
        { status: 400 }
      );
    }

    // Code format validation
    if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Role code must start with a letter and contain only uppercase letters, numbers, and underscores.",
        },
        { status: 400 }
      );
    }

    // Status validation
    if (!Object.values(UserStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role status.",
        },
        { status: 400 }
      );
    }

    // Duplicate validation
    const existingRole = await db.role.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { code }],
      },
      select: {
        id: true,
      },
    });

    if (existingRole) {
      return NextResponse.json(
        {
          success: false,
          message: "Role name or code already exists.",
        },
        { status: 409 }
      );
    }

    // Create role
    const role = await db.role.create({
      data: {
        name,
        code,
        status,
      },
      include: {
        _count: {
          select: {
            users: true,
            rolePermissions: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Role created successfully.",
        data: role,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("CREATE ROLE ERROR:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Role name or code already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create role.",
      },
      { status: 500 }
    );
  }
}

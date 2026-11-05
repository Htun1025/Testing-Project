
import { NextResponse } from "next/server";
import { UserStatus } from "../../../../../../generated/prisma/client";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getRoleId(context: RouteContext) {
  const { id } = await context.params;
  const roleId = Number(id);

  if (!Number.isSafeInteger(roleId) || roleId <= 0) {
    return null;
  }

  return roleId;
}

// GET: Get role by ID
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const id = await getRoleId(context);

    if (id === null) {
      return NextResponse.json(
        { success: false, message: "Invalid role ID." },
        { status: 400 }
      );
    }

    const role = await db.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
            rolePermissions: true,
          },
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("GET ROLE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch role." },
      { status: 500 }
    );
  }
}

// PATCH: Update role
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const id = await getRoleId(context);

    if (id === null) {
      return NextResponse.json(
        { success: false, message: "Invalid role ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingRole = await db.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json(
        { success: false, message: "Role not found." },
        { status: 404 }
      );
    }

    const data: {
      name?: string;
      code?: string;
      status?: UserStatus;
    } = {};

    // Role name validation
    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid role name." },
          { status: 400 }
        );
      }

      data.name = body.name.trim();
    }

    // Dynamic role code validation
    if (body.code !== undefined) {
      if (typeof body.code !== "string") {
        return NextResponse.json(
          { success: false, message: "Invalid role code." },
          { status: 400 }
        );
      }

      const newCode = body.code
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

      if (!/^[A-Z][A-Z0-9_]*$/.test(newCode)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Role code must start with a letter and contain only uppercase letters, numbers, and underscores.",
          },
          { status: 400 }
        );
      }

      // Check duplicate code
      const duplicateCode = await db.role.findFirst({
        where: {
          code: newCode,
          NOT: { id },
        },
        select: { id: true },
      });

      if (duplicateCode) {
        return NextResponse.json(
          { success: false, message: "Role code already exists." },
          { status: 409 }
        );
      }

      data.code = newCode;
    }

    // Status validation
    if (body.status !== undefined) {
      if (
        typeof body.status !== "string" ||
        !Object.values(UserStatus).includes(body.status as UserStatus)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid role status." },
          { status: 400 }
        );
      }

      data.status = body.status as UserStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update." },
        { status: 400 }
      );
    }

    const role = await db.role.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            users: true,
            rolePermissions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Role updated successfully.",
      data: role,
    });
  } catch (error: unknown) {
    console.error("UPDATE ROLE ERROR:", error);

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
      { success: false, message: "Failed to update role." },
      { status: 500 }
    );
  }
}

// DELETE: Delete role
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const id = await getRoleId(context);

    if (id === null) {
      return NextResponse.json(
        { success: false, message: "Invalid role ID." },
        { status: 400 }
      );
    }

    const role = await db.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role not found." },
        { status: 404 }
      );
    }

    // Check assigned users using roleId
    const assignedUsers = await db.user.count({
      where: {
        roleId: id,
      },
    });

    if (assignedUsers > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete this role. ${assignedUsers} user(s) are assigned to it.`,
        },
        { status: 409 }
      );
    }

    await db.role.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ROLE ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete role." },
      { status: 500 }
    );
  }
}

import { randomBytes, createHash } from "crypto";

import { db } from "./db";

const ACCESS_TOKEN_EXPIRES = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function createToken() {
  return randomBytes(32).toString("hex");
}

export async function generateTokens(userId: number) {
  const accessToken = createToken();
  const refreshToken = createToken();

  const now = Date.now();

  await db.userToken.createMany({
    data: [
      {
        userId,
        tokenHash: hashToken(accessToken),
        token_type: "ACCESS_TOKEN",
        expires_at: new Date(now + ACCESS_TOKEN_EXPIRES),
      },
      {
        userId,
        tokenHash: hashToken(refreshToken),
        token_type: "REFRESH_TOKEN",
        expires_at: new Date(now + REFRESH_TOKEN_EXPIRES),
      },
    ],
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function verifyAccessToken(token: string) {
  const tokenHash = hashToken(token);

  const storedToken = await db.userToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });

  if (!storedToken) {
    return null;
  }

  if (storedToken.token_type !== "ACCESS_TOKEN") {
    return null;
  }

  if (storedToken.revoked) {
    return null;
  }

  if (storedToken.expires_at.getTime() < Date.now()) {
    return null;
  }

  return storedToken.user;
}

export async function revokeUserToken(userId: number) {
  await db.userToken.updateMany({
    where: {
      userId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
}

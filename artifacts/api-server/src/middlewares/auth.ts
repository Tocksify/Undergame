import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, sessionsTable } from "@workspace/db";

declare global {
  namespace Express {
    interface Request {
      accountId?: number;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.token, token));

  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.accountId = session.accountId;
  next();
}

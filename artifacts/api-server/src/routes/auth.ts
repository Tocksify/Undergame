import { Router, type IRouter } from "express";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, accountsTable, sessionsTable } from "@workspace/db";
import {
  RegisterAccountBody,
  RegisterAccountResponse,
  LoginAccountBody,
  LoginAccountResponse,
  GetCurrentAccountResponse,
} from "@workspace/api-zod";
import { hashPassword, verifyPassword } from "../lib/password";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function issueToken(): string {
  return randomBytes(32).toString("hex");
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;

  const [existing] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.username, username));
  if (existing) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  const [account] = await db
    .insert(accountsTable)
    .values({ username, passwordHash: hashPassword(password) })
    .returning();

  const token = issueToken();
  await db.insert(sessionsTable).values({ token, accountId: account.id });

  res
    .status(201)
    .json(
      RegisterAccountResponse.parse({
        token,
        account: { id: account.id, username: account.username },
      }),
    );
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginAccountBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;

  const [account] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.username, username));
  if (!account || !verifyPassword(password, account.passwordHash)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = issueToken();
  await db.insert(sessionsTable).values({ token, accountId: account.id });

  res.json(
    LoginAccountResponse.parse({
      token,
      account: { id: account.id, username: account.username },
    }),
  );
});

router.post("/auth/logout", requireAuth, async (req, res): Promise<void> => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.sendStatus(204);
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [account] = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.id, req.accountId!));
  if (!account) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(
    GetCurrentAccountResponse.parse({
      id: account.id,
      username: account.username,
    }),
  );
});

export default router;

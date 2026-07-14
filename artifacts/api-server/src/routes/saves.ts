import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, saveSlotsTable } from "@workspace/db";
import {
  ListSaveSlotsResponse,
  PutSaveSlotParams,
  PutSaveSlotBody,
  PutSaveSlotResponse,
  DeleteSaveSlotParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/saves", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(saveSlotsTable)
    .where(eq(saveSlotsTable.accountId, req.accountId!));

  res.json(
    ListSaveSlotsResponse.parse(
      rows.map((r) => ({
        slot: r.slot,
        name: r.name,
        summary: r.summary,
        state: r.state,
        updatedAt: r.updatedAt,
      })),
    ),
  );
});

router.put("/saves/:slot", requireAuth, async (req, res): Promise<void> => {
  const params = PutSaveSlotParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = PutSaveSlotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(saveSlotsTable)
    .where(
      and(
        eq(saveSlotsTable.accountId, req.accountId!),
        eq(saveSlotsTable.slot, params.data.slot),
      ),
    );

  const values = {
    accountId: req.accountId!,
    slot: params.data.slot,
    name: parsed.data.name,
    summary: parsed.data.summary ?? "",
    state: parsed.data.state,
  };

  const [row] = existing
    ? await db
        .update(saveSlotsTable)
        .set(values)
        .where(eq(saveSlotsTable.id, existing.id))
        .returning()
    : await db.insert(saveSlotsTable).values(values).returning();

  res.json(
    PutSaveSlotResponse.parse({
      slot: row.slot,
      name: row.name,
      summary: row.summary,
      state: row.state,
      updatedAt: row.updatedAt,
    }),
  );
});

router.delete("/saves/:slot", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteSaveSlotParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .delete(saveSlotsTable)
    .where(
      and(
        eq(saveSlotsTable.accountId, req.accountId!),
        eq(saveSlotsTable.slot, params.data.slot),
      ),
    );
  res.sendStatus(204);
});

export default router;

import { validateExpenseForm } from "@/expenses/components/ExpenseForm/validation";
import type { DraftExpense } from "@/expenses/components/BulkImportModal/types";
import type { CreateUpdateExpenseBody } from "@/expenses/services/expenseService";
import { keysToCreateBody } from "@/expenses/utils/expensePayload";
import type { UnauthorizedUserBrief, TripMemberBrief } from "@/trips/types";
import {
  isNonEmptyString,
  isPositiveDecimalString,
} from "@/shared/utils/validators";

export type MemberKey = `u:${string}` | `au:${string}`;

/** RFC-style CSV: commas, quoted fields, escaped quotes as "" */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");

  while (i < s.length) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  row.push(field);
  rows.push(row);

  while (rows.length > 0) {
    const last = rows[rows.length - 1];
    if (last.every((cell) => cell.trim() === "")) {
      rows.pop();
    } else {
      break;
    }
  }

  return rows;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, "_");
}

export function buildNameResolutionMap(
  members: TripMemberBrief[],
  unauthorizedUsers: UnauthorizedUserBrief[],
): Map<string, MemberKey[]> {
  const map = new Map<string, MemberKey[]>();
  const add = (displayName: string, key: MemberKey) => {
    const norm = displayName.trim().toLowerCase();
    if (!norm) return;
    const existing = map.get(norm) ?? [];
    if (!existing.some((k) => k === key)) {
      existing.push(key);
    }
    map.set(norm, existing);
  };
  for (const m of members) {
    add(m.display_name, `u:${m.user_id}`);
  }
  for (const u of unauthorizedUsers) {
    add(u.display_name, `au:${u.id}`);
  }
  return map;
}

function resolveDisplayName(
  raw: string,
  map: Map<string, MemberKey[]>,
): { ok: true; key: MemberKey } | { ok: false; reason: "unknown" | "ambiguous" } {
  const norm = raw.trim().toLowerCase();
  if (!norm) {
    return { ok: false, reason: "unknown" };
  }
  const keys = map.get(norm);
  if (!keys?.length) {
    return { ok: false, reason: "unknown" };
  }
  if (keys.length > 1) {
    return { ok: false, reason: "ambiguous" };
  }
  return { ok: true, key: keys[0] };
}

function defaultPayerKey(members: TripMemberBrief[]): string {
  return members[0] ? `u:${members[0].user_id}` : "";
}

function defaultParticipantKeys(members: TripMemberBrief[]): string[] {
  return members.map((m) => `u:${m.user_id}`);
}

export function parseExpenseCsv(
  rawText: string,
  members: TripMemberBrief[],
  unauthorizedUsers: UnauthorizedUserBrief[],
): DraftExpense[] {
  const rows = parseCsv(rawText);
  if (rows.length < 2) {
    return [];
  }

  const header = rows[0].map((h) => normalizeHeader(h));
  const col = (name: string): number => {
    const i = header.indexOf(name);
    return i;
  };

  const iName = col("name");
  const iDesc = col("description");
  const iAmount = col("amount");
  const iPayer = col("payer");
  const iParticipants = col("participants");

  if (
    iName === -1 ||
    iDesc === -1 ||
    iAmount === -1 ||
    iPayer === -1 ||
    iParticipants === -1
  ) {
    throw new Error(
      'CSV must include header columns: name, description, amount, payer, participants (order can vary)',
    );
  }

  const nameMap = buildNameResolutionMap(members, unauthorizedUsers);
  const out: DraftExpense[] = [];

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (idx: number) => (idx < cells.length ? cells[idx] : "").trim();

    const name = get(iName);
    const description = get(iDesc);
    const amount = get(iAmount);
    const payerRaw = get(iPayer);
    const participantsRaw = get(iParticipants);

    const errors: string[] = [];

    if (!isNonEmptyString(name)) {
      errors.push("Name is required");
    }
    if (!isPositiveDecimalString(amount)) {
      errors.push("Enter a valid amount greater than zero");
    }

    let payerKey = "";
    if (isNonEmptyString(payerRaw)) {
      const res = resolveDisplayName(payerRaw, nameMap);
      if (!res.ok) {
        if (res.reason === "ambiguous") {
          errors.push(`Ambiguous payer name: "${payerRaw}" (matches multiple people)`);
        } else {
          errors.push(`Unknown payer: "${payerRaw}"`);
        }
      } else {
        payerKey = res.key;
      }
    } else {
      payerKey = defaultPayerKey(members);
      if (!payerKey) {
        errors.push("No trip members to use as default payer");
      }
    }

    let participantKeys: string[] = [];
    if (isNonEmptyString(participantsRaw)) {
      const parts = participantsRaw
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const p of parts) {
        const res = resolveDisplayName(p, nameMap);
        if (!res.ok) {
          if (res.reason === "ambiguous") {
            errors.push(`Ambiguous participant "${p}" (matches multiple people)`);
          } else {
            errors.push(`Unknown participant: "${p}"`);
          }
        } else {
          participantKeys.push(res.key);
        }
      }
    } else {
      participantKeys = defaultParticipantKeys(members);
    }

    if (!participantKeys.length && !errors.some((e) => e.includes("participant"))) {
      errors.push("Select at least one participant");
    }

    const body = keysToCreateBody(
      name,
      description,
      amount,
      payerKey,
      participantKeys,
    );

    out.push({
      ...body,
      _id: crypto.randomUUID(),
      _errors: errors.length ? errors : undefined,
    });
  }

  return out;
}

/** New blank row for “Add expense” inside the modal. */
export function createEmptyDraft(
  members: TripMemberBrief[],
  _unauthorizedUsers: UnauthorizedUserBrief[],
): DraftExpense {
  const payerKey = defaultPayerKey(members);
  const participantKeys = defaultParticipantKeys(members);

  const body = keysToCreateBody(
    "",
    "",
    "",
    payerKey,
    participantKeys,
  );

  const errs: string[] = [
    "Name is required",
    "Enter a valid amount greater than zero",
  ];
  if (!payerKey) {
    errs.push("No trip members to use as default payer");
  }
  if (!participantKeys.length) {
    errs.push("Select at least one participant");
  }

  return {
    ...body,
    _id: crypto.randomUUID(),
    _errors: errs,
  };
}

/** Re-run validation after inline edits (same rules as single expense form). */
export function revalidateDraft(body: CreateUpdateExpenseBody): string[] | undefined {
  const payerKey =
    body.payer_type === "user" && body.payer_id
      ? `u:${body.payer_id}`
      : body.payer_type === "unauthorized_user" && body.payer_unauthorized_user_id
        ? `au:${body.payer_unauthorized_user_id}`
        : "";
  const participantKeys = body.participants.map((p) =>
    p.type === "user" ? `u:${p.user_id}` : `au:${p.unauthorized_user_id}`,
  );
  const msg = validateExpenseForm({
    name: body.name,
    description: body.description,
    amount: body.amount,
    payerKey,
    participantKeys,
  });
  return msg ? [msg] : undefined;
}

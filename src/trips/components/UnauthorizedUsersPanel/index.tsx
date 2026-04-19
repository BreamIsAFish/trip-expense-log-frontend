import type { FC } from "react";
import { useState } from "react";

import { useAddUnauthorizedUser } from "@/trips/hooks/useAddUnauthorizedUser";
import { useDeleteUnauthorizedUser } from "@/trips/hooks/useDeleteUnauthorizedUser";
import { useUnauthorizedUsers } from "@/trips/hooks/useUnauthorizedUsers";
import { Input } from "@/ui/components/Input";
import { Button } from "@/ui/components/Button";

export const UnauthorizedUsersPanel: FC<{ tripId: string }> = ({ tripId }) => {
  const q = useUnauthorizedUsers(tripId);
  const add = useAddUnauthorizedUser(tripId);
  const del = useDeleteUnauthorizedUser(tripId);
  const [name, setName] = useState("");

  const onAdd = () => {
    const n = name.trim();
    if (!n) {
      return;
    }
    add.mutate(n, {
      onSuccess: () => setName(""),
    });
  };

  const list = q.data?.unauthorized_users ?? [];

  return (
    <section className="rounded-xl border border-violet-200/80 bg-white/80 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-800">
        People not in the app
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        Add names for people who haven&apos;t joined this trip. They can appear
        as payer or in the split.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Input
          name="unauthorized_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="min-w-[12rem] flex-1"
        />
        <Button
          type="button"
          onClick={() => void onAdd()}
          disabled={add.isPending || !name.trim()}
        >
          Add
        </Button>
      </div>
      {add.error ? (
        <p className="mt-2 text-sm text-rose-600">
          {add.error instanceof Error ? add.error.message : "Failed to add"}
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {list.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-2 rounded-md border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm text-stone-700"
          >
            <span>{u.display_name}</span>
            <Button
              variant="danger"
              type="button"
              className="!py-1 !text-xs"
              onClick={() => del.mutate(u.id)}
              disabled={del.isPending}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      {q.isLoading ? (
        <p className="mt-2 text-xs text-stone-400">Loading…</p>
      ) : null}
    </section>
  );
};

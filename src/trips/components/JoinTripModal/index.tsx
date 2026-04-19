import type { FC, FormEvent } from "react";
import { useState } from "react";

import { useJoinTrip } from "@/trips/hooks/useJoinTrip";
import { Button } from "@/ui/components/Button";
import { Input } from "@/ui/components/Input";
import { Modal } from "@/ui/components/Modal";
import { isNonEmptyString } from "@/shared/utils/validators";

import type { JoinTripModalProps } from "./types";

export const JoinTripModal: FC<JoinTripModalProps> = ({ open, onClose }) => {
  const [inviteCode, setInviteCode] = useState("");
  const joinTrip = useJoinTrip();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isNonEmptyString(inviteCode)) {
      return;
    }
    joinTrip.mutate(
      { inviteCode: inviteCode.trim() },
      {
        onSuccess: () => {
          setInviteCode("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title="Join trip"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="join-trip-form"
            disabled={joinTrip.isPending}
          >
            {joinTrip.isPending ? "Joining…" : "Join"}
          </Button>
        </>
      }
    >
      <form id="join-trip-form" className="space-y-4" onSubmit={onSubmit}>
        <p className="text-sm text-stone-500">
          Enter the invite code shared by the organizer.
        </p>
        <Input
          label="Invite code"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
        {joinTrip.error ? (
          <p className="text-sm text-rose-600">
            {joinTrip.error instanceof Error
              ? joinTrip.error.message
              : "Could not join trip"}
          </p>
        ) : null}
      </form>
    </Modal>
  );
};

import type { FC, FormEvent } from "react";
import { useState } from "react";

import { useJoinTrip } from "@/trips/hooks/useJoinTrip";
import { Button } from "@/ui/components/Button";
import { Input } from "@/ui/components/Input";
import { Modal } from "@/ui/components/Modal";
import { isNonEmptyString } from "@/shared/utils/validators";

import type { JoinTripModalProps } from "./types";

export const JoinTripModal: FC<JoinTripModalProps> = ({ open, onClose }) => {
  const [tripId, setTripId] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const joinTrip = useJoinTrip();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isNonEmptyString(tripId) || !isNonEmptyString(inviteCode)) {
      return;
    }
    joinTrip.mutate(
      { tripId: tripId.trim(), inviteCode: inviteCode.trim() },
      {
        onSuccess: () => {
          setTripId("");
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
        <p className="text-sm text-slate-400">
          Enter the trip ID and invite code shared by the organizer.
        </p>
        <Input
          label="Trip ID"
          name="tripId"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          required
        />
        <Input
          label="Invite code"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
        {joinTrip.error ? (
          <p className="text-sm text-red-400">
            {joinTrip.error instanceof Error
              ? joinTrip.error.message
              : "Could not join trip"}
          </p>
        ) : null}
      </form>
    </Modal>
  );
};

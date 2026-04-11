import type { FC, FormEvent } from "react";
import { useState } from "react";

import { useCreateTrip } from "@/trips/hooks/useCreateTrip";
import { Button } from "@/ui/components/Button";
import { Input } from "@/ui/components/Input";
import { Modal } from "@/ui/components/Modal";
import { isNonEmptyString } from "@/shared/utils/validators";

import type { CreateTripModalProps } from "./types";

export const CreateTripModal: FC<CreateTripModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createTrip = useCreateTrip();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isNonEmptyString(name)) {
      return;
    }
    createTrip.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title="Create trip"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-trip-form"
            disabled={createTrip.isPending}
          >
            {createTrip.isPending ? "Creating…" : "Create"}
          </Button>
        </>
      }
    >
      <form id="create-trip-form" className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Trip name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {createTrip.error ? (
          <p className="text-sm text-red-400">
            {createTrip.error instanceof Error
              ? createTrip.error.message
              : "Could not create trip"}
          </p>
        ) : null}
      </form>
    </Modal>
  );
};

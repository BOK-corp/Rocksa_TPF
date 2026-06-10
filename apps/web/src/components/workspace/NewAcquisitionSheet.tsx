import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetFooter,
} from "@rocksa/ui";
import type { Category } from "@rocksa/domain";
import { useCreateAcquisition } from "../../data/api-inventory.ts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: Category[] = [
  "igneous",
  "metamorphic",
  "sedimentary",
  "crystals",
];

export const NewAcquisitionSheet = ({ open, onOpenChange }: Props) => {
  const create = useCreateAcquisition();
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [category, setCategory] = useState<Category>("crystals");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setName("");
    setOrigin("");
    setCategory("crystals");
    setValue("");
    setNotes("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedValueCents = Math.round(Number(value) * 100);
    if (!name.trim() || !origin.trim() || !Number.isFinite(estimatedValueCents)) {
      return;
    }
    await create.mutateAsync({
      name: name.trim(),
      origin: origin.trim(),
      category,
      estimatedValueCents,
      notes: notes.trim() || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="New Acquisition"
        description="Log an inbound acquisition and open a shipment track."
      >
        <form className="space-y-4" onSubmit={(e) => void submit(e)}>
          <div>
            <Label htmlFor="acq-name">Specimen name</Label>
            <Input
              id="acq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="acq-origin">Origin</Label>
            <Input
              id="acq-origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="acq-value">Estimated value (USD)</Label>
            <Input
              id="acq-value"
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="acq-notes">Notes</Label>
            <Input
              id="acq-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {create.isError && (
            <p className="text-sm text-rose-600">Unable to record acquisition.</p>
          )}
          <SheetFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Submitting…" : "Submit intake"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

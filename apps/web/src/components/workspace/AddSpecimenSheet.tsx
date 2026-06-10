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
import { useCreateSpecimen } from "../../data/api-inventory.ts";

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

export const AddSpecimenSheet = ({ open, onOpenChange }: Props) => {
  const create = useCreateSpecimen();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("crystals");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originCountry, setOriginCountry] = useState("");

  const reset = () => {
    setName("");
    setCategory("crystals");
    setDescription("");
    setPrice("");
    setOriginCountry("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(Number(price) * 100);
    if (!name.trim() || !description.trim() || !Number.isFinite(priceCents)) return;
    await create.mutateAsync({
      name: name.trim(),
      category,
      description: description.trim(),
      priceCents,
      originCountry: originCountry.trim() || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="Add New Specimen"
        description="Catalog a new piece into your curated inventory."
      >
        <form className="space-y-4" onSubmit={(e) => void submit(e)}>
          <div>
            <Label htmlFor="specimen-name">Name</Label>
            <Input
              id="specimen-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Label htmlFor="specimen-description">Description</Label>
            <Input
              id="specimen-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="specimen-price">Value (USD)</Label>
            <Input
              id="specimen-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="specimen-origin">Origin country</Label>
            <Input
              id="specimen-origin"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
            />
          </div>
          {create.isError && (
            <p className="text-sm text-rose-600">Unable to save specimen.</p>
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
              {create.isPending ? "Saving…" : "Add specimen"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

import { Badge } from "@rocksa/ui";
import type { ShipmentStatus } from "@rocksa/domain";

const LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  pending_customs: "Pending Customs",
  customs_hold: "Customs Hold",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const TONES: Record<
  ShipmentStatus,
  "brand" | "neutral" | "success" | "warning" | "danger"
> = {
  pending: "neutral",
  in_transit: "brand",
  pending_customs: "warning",
  customs_hold: "danger",
  out_for_delivery: "success",
  delivered: "success",
};

export const ShipmentStatusBadge = ({ status }: { status: string }) => {
  const key = status as ShipmentStatus;
  const label = LABELS[key] ?? status.replaceAll("_", " ");
  const tone = TONES[key] ?? "neutral";
  return <Badge tone={tone}>{label}</Badge>;
};

import { Badge } from "@rocksa/ui";
import type { OrderStatus } from "@rocksa/domain";

const LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  fulfilling: "Fulfilling",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TONES: Record<
  OrderStatus,
  "brand" | "neutral" | "success" | "warning" | "danger"
> = {
  pending_payment: "warning",
  paid: "success",
  fulfilling: "brand",
  shipped: "brand",
  delivered: "success",
  cancelled: "danger",
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => (
  <Badge tone={TONES[status]}>{LABELS[status]}</Badge>
);

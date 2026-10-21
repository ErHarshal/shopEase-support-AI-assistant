import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "../paths.js";

export type OrderItem = { name: string; price: number; category: string };
export type Order = {
  id: string;
  customerName: string;
  status: string;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
  deliveredDaysAgo?: number;
  carrier?: string;
  trackingId?: string;
  estimatedDelivery?: string;
};
export type Product = { id: string; name: string; category: string; price: number; inStock: boolean };

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8")) as T;

export function getOrder(orderId: string): Order | null {
  const id = orderId.trim().toUpperCase();
  return readJson<Order[]>("orders.json").find((o) => o.id === id) ?? null;
}

export function searchProducts(query: string, limit = 3): Product[] {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  return readJson<Product[]>("products.json")
    .filter((p) => words.some((w) => `${p.name} ${p.category}`.toLowerCase().includes(w)))
    .slice(0, limit);
}

export function createRefund(input: { orderId: string; amount: number; reason: string }) {
  const order = getOrder(input.orderId);
  if (!order) return { error: `Order ${input.orderId} not found` };
  if (input.amount > order.total) return { error: `Amount exceeds order total (Rs ${order.total})` };

  const file = path.join(DATA_DIR, "refunds.json");
  const existing = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as unknown[]) : [];
  const refund = {
    refundId: `RF-${Date.now().toString().slice(-6)}`,
    ...input,
    status: "approved",
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(file, JSON.stringify([...existing, refund], null, 2));
  return refund;
}

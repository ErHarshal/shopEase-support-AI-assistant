import { z } from "zod";
import { getOrder, searchProducts } from "../data/store.js";
import { tool } from "langchain";

export const getOrderStatus = tool(
  async ({ orderId }) => JSON.stringify(getOrder(orderId) ?? { error: `Order ${orderId} not found` }),
  {
    name: "get_order_status",
    description: "Look up an order by its order number and return status, items, total and delivery info.",
    schema: z.object({ orderId: z.string().describe("Order number such as ORD-1042") })
  }
);

export const searchProductsTool = tool(
  async ({ query }) => JSON.stringify(searchProducts(query)),
  {
    name: "search_products",
    description: "Search the product catalogue by keyword and return matching products with price and stock.",
    schema: z.object({ query: z.string().describe("Product keyword, e.g. headphones") }),
  }
);

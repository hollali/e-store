import { pgTable, text, integer, decimal, timestamp } from "drizzle-orm/pg-core";

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("GHS"),
  image: text("image"),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  orderRef: text("order_ref").notNull().unique(),
  status: text("status").default("completed"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  items: text("items").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

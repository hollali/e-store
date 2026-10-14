import { pgTable, text, integer, decimal, timestamp, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
}, (t) => [
  index("cart_items_user_idx").on(t.userId),
  uniqueIndex("cart_items_user_product_uq").on(t.userId, t.productId),
  check("cart_items_qty_chk", sql`${t.quantity} >= 1 AND ${t.quantity} <= 99`),
]);

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  slug: text("slug"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("wishlist_items_user_idx").on(t.userId),
  uniqueIndex("wishlist_items_user_product_uq").on(t.userId, t.productId),
]);

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  productId: text("product_id").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("reviews_product_idx").on(t.productId),
  index("reviews_user_idx").on(t.userId),
  uniqueIndex("reviews_user_product_uq").on(t.userId, t.productId),
  check("reviews_rating_chk", sql`${t.rating} >= 1 AND ${t.rating} <= 5`),
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  orderRef: text("order_ref").notNull().unique(),
  status: text("status").default("paid"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  items: text("items").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("orders_user_idx").on(t.userId),
  index("orders_created_idx").on(t.createdAt),
]);

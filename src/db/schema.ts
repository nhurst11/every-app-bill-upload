import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  uuid,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Auth Tables ────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // hashed password for credentials auth
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

// ─── App Tables (Phase 2 placeholder) ──────────────────────

export const bills = pgTable("bills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  utilityProvider: varchar("utility_provider", { length: 255 }),
  accountNumber: varchar("account_number", { length: 100 }),
  billingPeriodStart: timestamp("billing_period_start", { mode: "date" }),
  billingPeriodEnd: timestamp("billing_period_end", { mode: "date" }),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
  totalKwh: numeric("total_kwh", { precision: 12, scale: 2 }),
  supplyRatePerKwh: numeric("supply_rate_per_kwh", { precision: 8, scale: 4 }),
  deliveryCharges: numeric("delivery_charges", { precision: 10, scale: 2 }),
  demandKw: numeric("demand_kw", { precision: 10, scale: 2 }),
  demandCharges: numeric("demand_charges", { precision: 10, scale: 2 }),
  taxesAndFees: numeric("taxes_and_fees", { precision: 10, scale: 2 }),
  rateClass: varchar("rate_class", { length: 50 }),
  analysisJson: text("analysis_json"),
  insights: text("insights"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  uploadedAt: timestamp("uploaded_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Call Requests ──────────────────────────────────────────

export const callRequests = pgTable("call_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

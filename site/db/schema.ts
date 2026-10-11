import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const meetings = sqliteTable("meetings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date"),
  time: text("time"),
  location: text("location").notNull().default(""),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("draft"),
  registrationOpen: integer("registration_open", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("meetings_status_date_idx").on(table.status, table.date),
]);

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  normalizedContact: text("normalized_contact").notNull(),
  consentAt: text("consent_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("contacts_normalized_contact_unique").on(table.normalizedContact),
]);

export const registrations = sqliteTable("registrations", {
  id: text("id").primaryKey(),
  meetingId: text("meeting_id").notNull().references(() => meetings.id),
  contactId: text("contact_id").notNull().references(() => contacts.id),
  status: text("status").notNull().default("received"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("registrations_meeting_contact_unique").on(table.meetingId, table.contactId),
  index("registrations_meeting_status_idx").on(table.meetingId, table.status),
]);

export const interests = sqliteTable("interests", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").notNull().references(() => contacts.id),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("interests_contact_unique").on(table.contactId),
]);

export const adminProfiles = sqliteTable("admin_profiles", {
  id: text("id").primaryKey(),
  bio: text("bio").notNull().default(""),
  handle: text("handle").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

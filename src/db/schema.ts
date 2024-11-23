import { relations } from 'drizzle-orm';
import { pgTable,pgEnum, varchar, timestamp, uuid, text, integer, serial, primaryKey, boolean, real } from 'drizzle-orm/pg-core';

// Existing tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  imageUrl: varchar('image_url', { length: 200 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const households = pgTable('households', {
  id: text('id').primaryKey(),
  admin_id: text('admin_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 6 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const household_members = pgTable('household_members', {
  household_id: text('household_id').notNull().references(() => households.id),
  user_id: text('user_id').notNull().references(() => users.id),
}, (t) => ({
  primaryKey: [t.household_id, t.user_id],
}));

// New tables for Shopping List feature
export const shoppingLists = pgTable('shopping_lists', {
  id: text('id').primaryKey(),
  household_id: text('household_id').notNull().references(() => households.id),
  createdAt: timestamp('created_at').defaultNow()
});

export const categoryEnum = pgEnum('category', ['Fruits', 'Vegetables', 'Meat/Eggs', 'Dairy', 'Grains', 'Bread', 'Cleaning','Beverages','Pasta','Condiments','Snacks','Frozen','Canned','Other']);
export const priorityEnum = pgEnum('priority', ['Low', 'Medium', 'High']);

export const shoppingListItems = pgTable('shopping_list_items', {
  id: text('id').primaryKey().notNull(),
  shopping_list_id: text('shopping_list_id').notNull().references(() => shoppingLists.id),
  name: varchar('name', { length: 100 }).notNull(),
  unit: varchar('unit', { length: 50 }),
  quantity: integer('quantity').notNull(),
  category: categoryEnum('category').notNull(),
  priority: priorityEnum('priority').notNull(),
  checked: boolean('checked').notNull(),
  addedBy : text('added_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey().notNull(),
  household_id: text('household_id').notNull().references(() => households.id),
});

export const inventoryItems = pgTable('inventory_items', {
  id: text('id').primaryKey().notNull(),
  inventory_id: text('inventory_id').notNull().references(() => inventory.id),
  name: varchar('name', { length: 100 }).notNull(),
  unit: varchar('unit', { length: 50 }),
  quantity: real('quantity').notNull(),
  category: categoryEnum('category').notNull(),
  addedAt: timestamp('added_at').defaultNow(),
  expiryDate: timestamp('expiry_date', { mode: "date" }).defaultNow().notNull(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  household_members: many(household_members),
}));

export const householdRelations = relations(households, ({ many }) => ({
  household_members: many(household_members),
  shopping_lists: many(shoppingLists),
  inventory: many(inventory),
}));

export const shoppingListRelations = relations(shoppingLists, ({ one, many }) => ({
  household: one(households, {
    fields: [shoppingLists.household_id],
    references: [households.id],
  }),
  items: many(shoppingListItems),
}));

export const shoppingListItemRelations = relations(shoppingListItems, ({ one }) => ({
  shopping_list: one(shoppingLists, {
    fields: [shoppingListItems.shopping_list_id],
    references: [shoppingLists.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({one, many }) => ({
  household: one(households, {
    fields: [inventory.household_id],
    references: [households.id],
  }),
  items: many(inventoryItems),
}));

export const inventoryItemRelations = relations(inventoryItems, ({ one }) => ({
  inventory: one(inventory, {
    fields: [inventoryItems.inventory_id],
    references: [inventory.id],
  }),
}));

export const usersToHouseholds = relations(household_members, ({ one }) => ({
  household: one(households, {
    fields: [household_members.household_id],
    references: [households.id],
  }),
  user: one(users, {
    fields: [household_members.user_id],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type Household = typeof households.$inferSelect;
export type HouseholdMember = typeof household_members.$inferSelect;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type ShoppingListItem = typeof shoppingListItems.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;

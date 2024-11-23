ALTER TYPE "category" ADD VALUE 'Pasta';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'Condiments';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'Snacks';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'Frozen';--> statement-breakpoint
ALTER TYPE "category" ADD VALUE 'Canned';--> statement-breakpoint
ALTER TABLE "inventory_items" ALTER COLUMN "quantity" SET DATA TYPE real;
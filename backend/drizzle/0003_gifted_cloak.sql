ALTER TABLE "users" ADD COLUMN "active_status" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "account_status";
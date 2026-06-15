ALTER TABLE "tenants" ALTER COLUMN "package_tier" SET DEFAULT 'lite';--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "configuration_payload";--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_email_unique" UNIQUE("email");
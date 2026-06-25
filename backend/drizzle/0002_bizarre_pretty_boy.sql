ALTER TABLE "users" ALTER COLUMN "security_role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "security_role" SET DEFAULT 'borrower'::text;--> statement-breakpoint
DROP TYPE "public"."security_role";--> statement-breakpoint
CREATE TYPE "public"."security_role" AS ENUM('admin', 'loan_officer', 'borrower');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "security_role" SET DEFAULT 'borrower'::"public"."security_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "security_role" SET DATA TYPE "public"."security_role" USING "security_role"::"public"."security_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tracking_status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "customer_profiles" ALTER COLUMN "national_identity_number" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "customer_profiles" ALTER COLUMN "credit_score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "loan_products" ALTER COLUMN "interest_calculation_type" SET DEFAULT 'flat';--> statement-breakpoint
ALTER TABLE "loan_products" ALTER COLUMN "base_percentage" SET DEFAULT '0.0000';--> statement-breakpoint
ALTER TABLE "loan_products" ALTER COLUMN "fine_rules" SET DEFAULT "{}"::jsonb;--> statement-breakpoint
ALTER TABLE "loan_products" ALTER COLUMN "min_loan_amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "principal_amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "balance_outstanding" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "loans" ALTER COLUMN "disbursed_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "repayments" ALTER COLUMN "amount_paid" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "repayments" ALTER COLUMN "principal_component" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "repayments" ALTER COLUMN "interest_component" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "repayments" ALTER COLUMN "payment_method" SET DEFAULT 'm_pesa';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" SET DEFAULT 'repayment';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "metadata" SET DEFAULT "{}"::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_status" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_national_identity_number_unique" UNIQUE("national_identity_number");
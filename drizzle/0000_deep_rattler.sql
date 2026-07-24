CREATE TYPE "public"."package_tier" AS ENUM('lite', 'growth', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."security_role" AS ENUM('admin', 'loan_officer', 'auditor', 'borrower');--> statement-breakpoint
CREATE TYPE "public"."tracking_status" AS ENUM('active', 'suspended', 'pending_kyc');--> statement-breakpoint
CREATE TYPE "public"."interest_calculation_type" AS ENUM('flat', 'reducing_balance', 'compound');--> statement-breakpoint
CREATE TYPE "public"."loan_status" AS ENUM('pending_approval', 'active', 'fully_repaid', 'defaulted', 'written_off');--> statement-breakpoint
CREATE TYPE "public"."repayment_method" AS ENUM('m_pesa', 'bank_transfer', 'ach', 'card', 'internal_wallet');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed', 'reversed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('disbursement', 'repayment', 'penalty_charge', 'interest_accrual', 'waiver', 'write_off');--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"business_name" varchar(200),
	"package_tier" "package_tier" NOT NULL,
	"configuration_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"full_name" varchar(150) NOT NULL,
	"email_address" varchar(254) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"security_role" "security_role" NOT NULL,
	"tracking_status" "tracking_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_address_unique" UNIQUE("email_address")
);
--> statement-breakpoint
CREATE TABLE "customer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"national_identity_number" text NOT NULL,
	"phone_number" text NOT NULL,
	"encryption_key_vector" text NOT NULL,
	"credit_score" smallint,
	"date_of_birth" timestamp,
	"kyc_verified_at" timestamp with time zone,
	CONSTRAINT "customer_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "credit_score_check" CHECK ("customer_profiles"."credit_score" BETWEEN 0 AND 1000)
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"reference_title" varchar(120) NOT NULL,
	"interest_calculation_type" "interest_calculation_type" NOT NULL,
	"base_percentage" numeric(6, 4) NOT NULL,
	"fine_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"min_loan_amount" numeric(15, 2) NOT NULL,
	"max_loan_amount" numeric(15, 2) NOT NULL,
	"max_term_days" integer NOT NULL,
	CONSTRAINT "base_percentage_check" CHECK ("loan_products"."base_percentage" > 0)
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"borrower_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"principal_amount" numeric(15, 2) NOT NULL,
	"balance_outstanding" numeric(15, 2) NOT NULL,
	"status" "loan_status" DEFAULT 'pending_approval' NOT NULL,
	"term_days" integer NOT NULL,
	"disbursed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "principal_check" CHECK ("loans"."principal_amount" > 0),
	CONSTRAINT "balance_check" CHECK ("loans"."balance_outstanding" >= 0)
);
--> statement-breakpoint
CREATE TABLE "repayments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"amount_paid" numeric(15, 2) NOT NULL,
	"principal_component" numeric(15, 2) NOT NULL,
	"interest_component" numeric(15, 2) NOT NULL,
	"penalty_component" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"payment_method" "repayment_method" NOT NULL,
	"external_reference" varchar(100),
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "repayments_external_reference_unique" UNIQUE("external_reference"),
	CONSTRAINT "amount_paid_check" CHECK ("repayments"."amount_paid" > 0)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_products" ADD CONSTRAINT "loan_products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_id_users_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_product_id_loan_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."loan_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repayments" ADD CONSTRAINT "repayments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repayments" ADD CONSTRAINT "repayments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tenants_tier" ON "tenants" USING btree ("package_tier");--> statement-breakpoint
CREATE INDEX "idx_tenants_active" ON "tenants" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_users_tenant" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email_address");--> statement-breakpoint
CREATE INDEX "idx_cust_user" ON "customer_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_lp_tenant" ON "loan_products" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_loans_tenant" ON "loans" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_loans_borrower" ON "loans" USING btree ("borrower_id");--> statement-breakpoint
CREATE INDEX "idx_loans_status" ON "loans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_repayments_tenant" ON "repayments" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_repayments_loan" ON "repayments" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "idx_repayments_ref" ON "repayments" USING btree ("external_reference");--> statement-breakpoint
CREATE INDEX "idx_transactions_tenant" ON "transactions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_loan" ON "transactions" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_type_status" ON "transactions" USING btree ("type","status");
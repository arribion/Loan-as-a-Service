CREATE TYPE "public"."package_tier" AS ENUM('lite', 'growth', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."security_role" AS ENUM('admin', 'loan_officer', 'auditor', 'borrower');--> statement-breakpoint
CREATE TYPE "public"."tracking_status" AS ENUM('active', 'suspended', 'pending_kyc');--> statement-breakpoint
CREATE TYPE "public"."interest_calculation_type" AS ENUM('flat', 'reducing_balance', 'compound');--> statement-breakpoint
CREATE TYPE "public"."lifecycle_state" AS ENUM('pending', 'active', 'overdue', 'restructured', 'closed');--> statement-breakpoint
CREATE TYPE "public"."schedule_state" AS ENUM('pending', 'partial', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."ledger_direction" AS ENUM('debit', 'credit');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('disbursement', 'repayment', 'penalty', 'reversal');--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar(200) NOT NULL,
	"package_tier" "package_tier" DEFAULT 'lite' NOT NULL,
	"configuration_payload" jsonb DEFAULT "{}"::jsonb NOT NULL,
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
	"security_role" "security_role" DEFAULT 'borrower' NOT NULL,
	"tracking_status" "tracking_status" DEFAULT 'active' NOT NULL,
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
	"credit_score" smallint DEFAULT 0,
	"date_of_birth" timestamp,
	"kyc_verified_at" timestamp with time zone,
	CONSTRAINT "customer_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "customer_profiles_national_identity_number_unique" UNIQUE("national_identity_number"),
	CONSTRAINT "credit_score_check" CHECK ("customer_profiles"."credit_score" BETWEEN 0 AND 1000)
);
--> statement-breakpoint
CREATE TABLE "loan_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"reference_title" varchar(120) NOT NULL,
	"interest_calculation_type" "interest_calculation_type" DEFAULT 'flat' NOT NULL,
	"base_percentage" numeric(6, 4) DEFAULT '1.0000' NOT NULL,
	"fine_rules" jsonb DEFAULT "{}"::jsonb NOT NULL,
	"min_loan_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"max_loan_amount" numeric(15, 2) NOT NULL,
	"min_term_days" integer NOT NULL,
	CONSTRAINT "base_percentage_check" CHECK ("loan_products"."base_percentage" > 0)
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"customer_profile_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"principal_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"active_balance" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"lifecycle_state" "lifecycle_state" DEFAULT 'pending' NOT NULL,
	"term_days" integer NOT NULL,
	"maturity_date" timestamp with time zone NOT NULL,
	"disbursed_at" timestamp with time zone,
	"hostpay_reference" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "principal_check" CHECK ("loans"."principal_amount" > 0),
	CONSTRAINT "balance_check" CHECK ("loans"."active_balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "repayment_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"installment_no" smallint NOT NULL,
	"scheduled_amount" numeric(15, 2) NOT NULL,
	"principal_portion" numeric(15, 2) NOT NULL,
	"interest_portion" numeric(15, 2) NOT NULL,
	"target_due_date" date NOT NULL,
	"payment_state_flag" "schedule_state" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"loan_id" uuid NOT NULL,
	"external_receipt_reference" varchar(100),
	"ledger_direction" "ledger_direction" NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"raw_amount" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"penalty_portion" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"interest_portion" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"principal_portion" numeric(15, 2) DEFAULT '0.00' NOT NULL,
	"log_timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_external_receipt_reference_unique" UNIQUE("external_receipt_reference")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_products" ADD CONSTRAINT "loan_products_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_customer_profile_id_customer_profiles_id_fk" FOREIGN KEY ("customer_profile_id") REFERENCES "public"."customer_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_product_id_loan_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."loan_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repayment_schedules" ADD CONSTRAINT "repayment_schedules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repayment_schedules" ADD CONSTRAINT "repayment_schedules_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tenants_tier" ON "tenants" USING btree ("package_tier");--> statement-breakpoint
CREATE INDEX "idx_tenants_active" ON "tenants" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_users_tenant" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email_address");--> statement-breakpoint
CREATE INDEX "idx_cust_user" ON "customer_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_lp_tenant" ON "loan_products" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_loans_tenant" ON "loans" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_loans_customer" ON "loans" USING btree ("customer_profile_id");--> statement-breakpoint
CREATE INDEX "idx_loans_state" ON "loans" USING btree ("lifecycle_state");--> statement-breakpoint
CREATE INDEX "idx_sched_tenant" ON "repayment_schedules" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_sched_loan" ON "repayment_schedules" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "idx_sched_due" ON "repayment_schedules" USING btree ("target_due_date");--> statement-breakpoint
CREATE INDEX "idx_txn_tenant" ON "transactions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_txn_loan" ON "transactions" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "idx_txn_ref" ON "transactions" USING btree ("external_receipt_reference");--> statement-breakpoint
CREATE INDEX "idx_txn_time" ON "transactions" USING btree ("log_timestamp");
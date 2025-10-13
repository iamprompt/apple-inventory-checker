CREATE TABLE "product_families" (
	"id" serial PRIMARY KEY NOT NULL,
	"locale" varchar(10) NOT NULL,
	"family" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_locale_family" UNIQUE("locale","family")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "family" SET NOT NULL;
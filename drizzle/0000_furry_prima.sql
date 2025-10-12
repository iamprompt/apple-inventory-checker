CREATE TABLE "product_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"locale" varchar NOT NULL,
	"product_id" integer,
	"part_number" varchar NOT NULL,
	"store_id" integer NOT NULL,
	"store_pick_eligible" boolean DEFAULT false,
	"pickup_search_quote" varchar,
	"pickup_type" varchar,
	"pickup_display" varchar,
	"buyability" boolean DEFAULT false,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_locale_part_store" UNIQUE("locale","part_number","store_id")
);
--> statement-breakpoint
CREATE TABLE "product_availability_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"locale" varchar NOT NULL,
	"product_id" integer,
	"part_number" varchar NOT NULL,
	"store_id" integer NOT NULL,
	"store_pick_eligible" boolean DEFAULT false,
	"pickup_search_quote" varchar,
	"pickup_type" varchar,
	"pickup_display" varchar,
	"buyability" boolean DEFAULT false,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"locale" varchar(10) NOT NULL,
	"base_part_number" varchar(10) NOT NULL,
	"part_number" varchar(20) NOT NULL,
	"capacity" varchar NOT NULL,
	"capacity_key" varchar,
	"screen_size" varchar NOT NULL,
	"screen_size_key" varchar,
	"color" varchar NOT NULL,
	"color_key" varchar,
	"carrier_model" varchar,
	"carrier_model_key" varchar,
	"image_key" varchar,
	"image_url" varchar,
	"price" varchar NOT NULL,
	"url" varchar,
	"name" varchar NOT NULL,
	"is_updating" boolean DEFAULT false NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_locale_part_number" UNIQUE("locale","part_number")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_store_id" UNIQUE("store_id")
);
--> statement-breakpoint
ALTER TABLE "product_availability" ADD CONSTRAINT "product_availability_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_availability" ADD CONSTRAINT "product_availability_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_availability_history" ADD CONSTRAINT "product_availability_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_availability_history" ADD CONSTRAINT "product_availability_history_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;
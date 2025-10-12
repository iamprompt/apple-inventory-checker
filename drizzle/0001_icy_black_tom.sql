ALTER TABLE "product_availability" ADD COLUMN "is_available" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "product_availability_history" ADD COLUMN "is_available" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "product_availability" DROP COLUMN "store_pick_eligible";--> statement-breakpoint
ALTER TABLE "product_availability" DROP COLUMN "pickup_search_quote";--> statement-breakpoint
ALTER TABLE "product_availability" DROP COLUMN "pickup_type";--> statement-breakpoint
ALTER TABLE "product_availability" DROP COLUMN "buyability";--> statement-breakpoint
ALTER TABLE "product_availability_history" DROP COLUMN "store_pick_eligible";--> statement-breakpoint
ALTER TABLE "product_availability_history" DROP COLUMN "pickup_search_quote";--> statement-breakpoint
ALTER TABLE "product_availability_history" DROP COLUMN "pickup_type";--> statement-breakpoint
ALTER TABLE "product_availability_history" DROP COLUMN "buyability";
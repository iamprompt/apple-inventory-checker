ALTER TABLE "notification_channels" ALTER COLUMN "targets" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "notification_channels" ALTER COLUMN "targets" SET DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "notification_channels" ALTER COLUMN "products" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "notification_channels" ALTER COLUMN "products" SET DEFAULT '[]';
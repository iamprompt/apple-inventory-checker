CREATE TYPE "public"."NotificationChannelType" AS ENUM('TELEGRAM', 'BARK');--> statement-breakpoint
CREATE TABLE "notification_channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "NotificationChannelType" NOT NULL,
	"is_active" boolean DEFAULT true,
	"token" varchar(255),
	"targets" json DEFAULT '[]' NOT NULL,
	"products" json DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

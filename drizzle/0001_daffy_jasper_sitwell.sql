PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`base_part_number` text NOT NULL,
	`part_number` text NOT NULL,
	`capacity` text NOT NULL,
	`screen_size` text NOT NULL,
	`color` text NOT NULL,
	`carrier_model` text,
	`image_key` text,
	`image_url` text,
	`price` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "locale", "base_part_number", "part_number", "capacity", "screen_size", "color", "carrier_model", "image_key", "image_url", "price", "name", "created_at", "updated_at") SELECT "id", "locale", "base_part_number", "part_number", "capacity", "screen_size", "color", "carrier_model", "image_key", "image_url", "price", "name", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
CREATE TABLE `product_availability` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`product_id` integer,
	`part_number` text NOT NULL,
	`store_id` integer NOT NULL,
	`store_pick_eligible` integer DEFAULT false,
	`pickup_search_quote` text,
	`pickup_type` text,
	`pickup_display` text,
	`buyability` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_locale_part_store` ON `product_availability` (`locale`,`part_number`,`store_id`);--> statement-breakpoint
CREATE TABLE `product_availability_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`product_id` integer,
	`part_number` text NOT NULL,
	`store_id` integer NOT NULL,
	`store_pick_eligible` integer DEFAULT false,
	`pickup_search_quote` text,
	`pickup_type` text,
	`pickup_display` text,
	`buyability` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`locale` text NOT NULL,
	`base_part_number` text NOT NULL,
	`part_number` text NOT NULL,
	`capacity` text NOT NULL,
	`capacity_key` text,
	`screen_size` text NOT NULL,
	`screen_size_key` text,
	`color` text NOT NULL,
	`color_key` text,
	`carrier_model` text,
	`carrier_model_key` text,
	`image_key` text,
	`image_url` text,
	`price` text NOT NULL,
	`url` text,
	`name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_locale_part_number` ON `products` (`locale`,`part_number`);--> statement-breakpoint
CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text NOT NULL,
	`name` text NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_store_id` ON `stores` (`store_id`);
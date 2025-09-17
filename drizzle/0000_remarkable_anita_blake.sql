CREATE TABLE `products` (
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
	`price` numeric NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

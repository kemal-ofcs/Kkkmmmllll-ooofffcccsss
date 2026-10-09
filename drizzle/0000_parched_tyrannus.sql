CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`visual` text NOT NULL,
	`backend` text NOT NULL,
	`addons` text DEFAULT '[]' NOT NULL,
	`timeline` text NOT NULL,
	`estimated_price` integer NOT NULL,
	`ip_hash` text,
	`source` text DEFAULT 'estimator_wa_click' NOT NULL,
	`created_at` integer NOT NULL,
	`notified_at` integer
);
--> statement-breakpoint
CREATE INDEX `leads_ip_created_idx` ON `leads` (`ip_hash`,`created_at`);
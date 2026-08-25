CREATE TABLE `consultationAttachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`fileSize` int NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultationAttachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultationReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`body` text NOT NULL,
	`adminUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultationReplies_id` PRIMARY KEY(`id`),
	CONSTRAINT `consultationReplies_postId_unique` UNIQUE(`postId`)
);
--> statement-breakpoint
ALTER TABLE `consultationPosts` ADD `status` enum('pending','answered') DEFAULT 'pending' NOT NULL;
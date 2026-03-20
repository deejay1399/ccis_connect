CREATE TABLE IF NOT EXISTS `alumni_featured_media` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `featured_id` int(11) unsigned NOT NULL,
  `media_type` varchar(20) NOT NULL,
  `media_path` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `featured_id` (`featured_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

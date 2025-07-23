CREATE TABLE
  `collection_data` (
    `id` int NOT NULL,
    `slug` varchar(255) DEFAULT NULL,
    `collection_id` varchar(100) NOT NULL,
    `parent_id` int NOT NULL,
    `website_id` varchar(200) CHARACTER
    SET
      utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
      `company_id` int NOT NULL,
      `created_by` int NOT NULL,
      `updated_by` int NOT NULL,
      `data` json NOT NULL,
      `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
      `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

--
-- Dumping data for table `collection_data`
--
INSERT INTO
  `collection_data` (
    `id`,
    `slug`,
    `collection_id`,
    `parent_id`,
    `website_id`,
    `company_id`,
    `created_by`,
    `updated_by`,
    `data`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Workwear\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527879_f38b0fc4.jpg\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:39:58'
  ),
  (
    2,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Printing Machines\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527638_314683c2.png\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    3,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Printing\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527613_02a7032a.png\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    4,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Promo Gifts\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748540941_dcff308a.webp\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 19:49:02'
  ),
  (
    5,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Branding Services\", \"image\": \"http://localhost:8080/api//upload/uploads/img_1748512259_83dbc0d7.png\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    6,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"DTF Printing\", \"image\": \"http://localhost:8080/api//upload/uploads/img_1748512029_aa2d5477.png\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    7,
    NULL,
    'categories',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"General Printing\", \"image\": \"http://localhost:8080/api//upload/uploads/img_1748512072_ab2e2acc.png\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    8,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Navy Rain Jacket\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526053_965ca5b6.jpg\", \"price\": \"500\", \"category\": 1, \"variations\": \"\", \"description\": \"Premium water-resistant rain jacket for workwear.\"}',
    '2025-05-29 12:14:17',
    '2025-05-30 22:30:57'
  ),
  (
    9,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Yellow/Navy Two-Tone Polo Shirt\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748525715_7e0630a3.jpg\", \"price\": \"250\", \"category\": 1, \"description\": \"Comfortable two-tone polo for high visibility.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    10,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Orange/Navy Two-Tone Polo Shirt\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526596_df0d259c.png\", \"price\": \"300\", \"category\": 1, \"description\": \"Bright orange and navy polo for work teams.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    11,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Orange Reflective Safety Jacket\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748525776_3bbfe549.jpg\", \"price\": \"500\", \"category\": 1, \"description\": \"Reflective jacket for safety and visibility.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    12,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"High-Visibility Reflective Jacket\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748525817_45e623ad.jpg\", \"price\": \"500\", \"category\": 1, \"description\": \"Workwear with high-visibility reflective stripes.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    13,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Black Safety Boot\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748525888_b38a6f60.webp\", \"price\": \"200\", \"category\": 1, \"description\": \"Durable black safety boot for tough environments.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    14,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Brown Chelsea Boot\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748525975_57633cbd.jpg\", \"price\": \"1200\", \"category\": 1, \"description\": \"Classic Chelsea boot with rugged sole.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    15,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Formal Safety Shoes\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526114_43e03ec1.webp\", \"price\": \"2500\", \"category\": 1, \"description\": \"Formal safety shoe, comfortable and protective.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    16,
    NULL,
    'products',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Brown Ankle Boot\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526174_83cddc86.webp\", \"price\": \"2000\", \"category\": 1, \"description\": \"Comfortable ankle boot for workwear.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    17,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Mini Heat Press\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526255_141102dd.jpg\", \"price\": 850, \"category\": 2, \"description\": \"Compact heat press machine\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    18,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Vynil Cutter\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526338_a6a09352.jpg\", \"price\": 7500, \"category\": 2, \"description\": \"Vinyl cutting machine\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    19,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"8-in-1 Heat Press\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526400_bffa49bb.webp\", \"price\": 6500, \"category\": 2, \"description\": \"Multifunction heat press\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    20,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Tumbler Press\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526209_1045cffd.jpg\", \"price\": 3000, \"category\": 2, \"description\": \"Heat press for tumblers\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    21,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Heat Press Swing\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526298_9d81a122.png\", \"price\": 3500, \"category\": 2, \"description\": \"Swing-away heat press\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    22,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"DTF Printer\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526374_21f9f17a.jpg\", \"price\": 130000, \"category\": 2, \"description\": \"Direct-to-film printer\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    23,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"5-in-1 Heat Press\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526430_f0d94b88.jpg\", \"price\": 5500, \"category\": 2, \"description\": \"Multi-function heat press\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    24,
    NULL,
    'products',
    2,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Automatic Cap Press\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526459_bf02e249.jpg\", \"price\": 3500, \"category\": 2, \"description\": \"Electric/automatic cap heat press\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    25,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Printed Water Bottle\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527120_fd9c9e08.jpg\", \"price\": 55, \"category\": 3, \"description\": \"Personalized bottles for events and branding. Min order: 10 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    27,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Printed Mug\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527223_819dc44c.jpg\", \"price\": 45, \"category\": 3, \"description\": \"Full-color ceramic mug for events or gifts. Min order: 10 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    28,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Printed Cap\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527252_4372c532.webp\", \"price\": 70, \"category\": 3, \"description\": \"Branded caps for teams, promotions, and gifts. Min order: 10 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    30,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Branded Pens\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527310_2c1a8d82.png\", \"price\": 6, \"category\": 3, \"description\": \"Branded pens for offices, schools, and events. Min order: 50 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    31,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Branded Diary\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527373_af250e35.webp\", \"price\": 65, \"category\": 3, \"description\": \"Diaries and notebooks personalized for your brand. Min order: 20 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    32,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Branded Keyring\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527409_f0b80ab7.png\", \"price\": 8, \"category\": 3, \"description\": \"Printed keyrings for events and promos. Min order: 50 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    33,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Soccer Kit\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527515_7c27b2c1.webp\", \"price\": 260, \"category\": 3, \"description\": \"Branded soccer kit for teams and clubs. Min order: 10 sets.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    34,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Printed Shirt\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527553_227e987d.jpg\", \"price\": 120, \"category\": 3, \"description\": \"Custom shirts for teams, staff, or events. Min order: 10 units.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    35,
    NULL,
    'printable',
    3,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Custom Display Banner\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748527447_5978e0ef.jpg\", \"price\": 390, \"category\": 3, \"description\": \"Indoor/outdoor display banners for marketing events. Min order: 1 unit.\"}',
    '2025-05-29 12:14:17',
    '2025-05-29 16:40:07'
  ),
  (
    36,
    NULL,
    'projects',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Project 1\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748541003_8e5cd4ab.jpg\", \"description\": \"\"}',
    '2025-05-29 16:41:46',
    '2025-05-29 19:50:05'
  ),
  (
    37,
    NULL,
    'projects',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Project 2\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748541015_121d29f6.webp\", \"description\": \"\"}',
    '2025-05-29 16:41:57',
    '2025-05-29 19:50:16'
  ),
  (
    38,
    NULL,
    'projects',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Project 3\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748541026_c9ce8363.png\", \"description\": \"\"}',
    '2025-05-29 16:42:06',
    '2025-05-29 19:50:29'
  ),
  (
    39,
    NULL,
    'variations',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Size\"}',
    '2025-05-30 15:38:07',
    '2025-05-30 15:38:27'
  ),
  (
    40,
    NULL,
    'variations',
    0,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Color\"}',
    '2025-05-30 15:38:07',
    '2025-05-30 15:38:35'
  ),
  (
    41,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"XXS\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    42,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"XS\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    43,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"S\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    44,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"M\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    45,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"L\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    46,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"XL\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    47,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"XXL\"}',
    '2025-05-30 15:39:38',
    '2025-05-30 15:39:38'
  ),
  (
    48,
    NULL,
    'variation_options',
    40,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Red\"}',
    '2025-05-30 15:39:46',
    '2025-05-30 15:39:46'
  ),
  (
    49,
    NULL,
    'variation_options',
    40,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Blue\"}',
    '2025-05-30 15:39:46',
    '2025-05-30 15:39:46'
  ),
  (
    50,
    NULL,
    'variation_options',
    40,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Green\"}',
    '2025-05-30 15:39:46',
    '2025-05-30 15:39:46'
  ),
  (
    51,
    NULL,
    'variation_options',
    40,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Black\"}',
    '2025-05-30 15:39:46',
    '2025-05-30 15:39:46'
  ),
  (
    52,
    NULL,
    'variation_options',
    40,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"White\"}',
    '2025-05-30 15:39:46',
    '2025-05-30 15:39:46'
  ),
  (
    54,
    NULL,
    'variation_options',
    53,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Leather\"}',
    '2025-05-30 21:12:02',
    '2025-05-30 21:25:01'
  ),
  (
    55,
    NULL,
    'variation_options',
    53,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Skuba\"}',
    '2025-05-30 21:12:02',
    '2025-05-30 21:26:11'
  ),
  (
    56,
    NULL,
    'variation_options',
    53,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"Soft shell\"}',
    '2025-05-30 21:15:05',
    '2025-05-30 21:26:29'
  ),
  (
    58,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"7\"}',
    '2025-05-30 23:01:42',
    '2025-05-30 23:01:42'
  ),
  (
    59,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"8\"}',
    '2025-05-30 23:01:42',
    '2025-05-30 23:01:42'
  ),
  (
    60,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"9\"}',
    '2025-05-30 23:01:42',
    '2025-05-30 23:01:42'
  ),
  (
    61,
    NULL,
    'variation_options',
    39,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"10\"}',
    '2025-05-30 23:01:42',
    '2025-05-30 23:01:42'
  ),
  (
    62,
    NULL,
    'categories',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Formal Safety Shoes\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526114_43e03ec1.webp\", \"price\": \"2500\", \"category\": 1, \"variations\": \"\", \"description\": \"Formal safety shoe, comfortable and protective.\"}',
    '2025-05-30 23:35:11',
    '2025-05-30 23:35:11'
  ),
  (
    63,
    NULL,
    'categories',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Formal Safety Shoes\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526114_43e03ec1.webp\", \"price\": \"2500\", \"category\": 1, \"variations\": \"\", \"description\": \"Formal safety shoe, comfortable and protective.\"}',
    '2025-05-31 01:51:37',
    '2025-05-31 01:51:37'
  ),
  (
    64,
    NULL,
    'categories',
    1,
    'Viviid',
    0,
    0,
    0,
    '{\"name\": \"Formal Safety Shoes\", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748526114_43e03ec1.webp\", \"price\": \"2500\", \"category\": 1, \"variations\": \"\", \"description\": \"Formal safety shoe, comfortable and protective.\"}',
    '2025-05-31 02:47:46',
    '2025-05-31 02:47:46'
  ),
  (
    66,
    NULL,
    'variation_options',
    65,
    'Viviid',
    0,
    0,
    0,
    '{\"value\": \"rererer\"}',
    '2025-06-01 09:54:43',
    '2025-06-01 09:54:43'
  ),
  (
    67,
    NULL,
    'clients',
    0,
    'Viviid',
    1,
    0,
    0,
    '{\"isTrusted\": true}',
    '2025-06-01 19:11:30',
    '2025-06-03 20:26:07'
  ),
  (
    68,
    NULL,
    'clients',
    0,
    'Viviid',
    1,
    0,
    0,
    '{\"isTrusted\": true}',
    '2025-06-01 19:13:52',
    '2025-06-03 20:26:07'
  ),
  (
    69,
    NULL,
    'clients',
    0,
    'Viviid',
    1,
    0,
    0,
    '{\"name\": \"Ndumiso Mthembu\", \"email\": \"accountstt@tybo.co.za\", \"notes\": \"\", \"phone\": \"0842529472\", \"address\": \"Block 56 The William, William Nicol Drive &, Broadacres Dr, Zevenfontein 407-Jr\", \"companyVat\": \"\", \"companyName\": \"\"}',
    '2025-06-01 19:20:02',
    '2025-06-03 20:26:07'
  ),
  (
    70,
    NULL,
    'clients',
    0,
    'Viviid',
    1,
    0,
    0,
    '{\"name\": \"Ndumiso Mthembu\", \"email\": \"accountstt@tybo.co.za\", \"notes\": \"\", \"phone\": \"0842529472\", \"address\": \"Block 56 The William, William Nicol Drive &, Broadacres Dr, Zevenfontein 407-Jr\", \"companyVat\": \"123\", \"companyName\": \"\"}',
    '2025-06-01 19:20:12',
    '2025-06-03 20:26:07'
  ),
  (
    71,
    NULL,
    'clients',
    0,
    'Tybo-Invoice',
    1,
    0,
    9,
    '{\"city\": \"\", \"code\": \"\", \"name\": \"Trent X\", \"email\": \"info@trentx.co.za\", \"phone\": \"0117787878\", \"address\": \"\", \"website\": \"\", \"industry\": \"Garden Services\", \"companyVat\": \"124 tr1\"}',
    '2025-06-01 20:49:39',
    '2025-06-04 06:15:33'
  ),
  (
    73,
    NULL,
    'offerings',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \"Rbttac admin system development  and maintenance.\", \"quantity\": \"\", \"frequency\": \"monthly\", \"unitPrice\": \"1500\", \"description\": \"-This phase we optimizing the app to be more flexible and easy to use\"}',
    '2025-06-01 22:03:41',
    '2025-06-01 22:05:56'
  ),
  (
    74,
    NULL,
    'projects',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \"Classic \", \"image\": \"https://ithebula.tybo.co.za/api/api/upload/uploads/img_1748808807_fdfe8170.jpg\", \"description\": \"\"}',
    '2025-06-01 22:13:36',
    '2025-06-01 22:13:36'
  ),
  (
    76,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \" Custom Web Development\", \"quantity\": \"\", \"frequency\": \"one-time\", \"unitPrice\": \"3500\", \"description\": \"Tailor-made websites, platforms, and systems to match your workflow.\"}',
    '2025-06-02 13:52:47',
    '2025-06-02 13:52:47'
  ),
  (
    77,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \"Internal Tools & Automation\", \"quantity\": \"\", \"frequency\": \"one-time\", \"unitPrice\": \"5000\", \"description\": \"Dashboards, CRMs, inventory systems — built for your operations.\"}',
    '2025-06-02 13:59:27',
    '2025-06-02 13:59:27'
  ),
  (
    81,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \"API Integration\", \"quantity\": \"\", \"frequency\": \"one-time\", \"unitPrice\": \"3500\", \"description\": \"We connect your apps and automate workflows across your tools.\"}',
    '2025-06-02 14:08:56',
    '2025-06-02 14:08:56'
  ),
  (
    82,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"tax\": 0, \"type\": \"invoice\", \"items\": [0, 0], \"notes\": \"\", \"total\": 7000, \"number\": \"QT\", \"status\": \"draft\", \"dueDate\": \"\", \"clientId\": 71, \"subtotal\": 7000, \"issueDate\": \"2025-06-02T00:00:00.000Z\", \"organizationId\": 72}',
    '2025-06-02 15:37:49',
    '2025-06-02 18:15:27'
  ),
  (
    83,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"tax\": 0, \"type\": \"invoice\", \"items\": [77], \"notes\": \"\", \"total\": 5000, \"number\": \"INV-2025-298\", \"status\": \"draft\", \"dueDate\": \"\", \"clientId\": 71, \"subtotal\": 5000, \"issueDate\": \"2025-06-02T00:00:00.000Z\", \"organizationId\": 72}',
    '2025-06-02 15:53:44',
    '2025-06-02 15:53:44'
  ),
  (
    84,
    NULL,
    'products',
    82,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \" Custom Web Development\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 76, \"taxAmount\": 0, \"unitPrice\": \"3500\", \"totalPrice\": \"3500\", \"description\": \"Tailor-made websites, platforms, and systems to match your workflow.\"}',
    '2025-06-02 18:15:28',
    '2025-06-02 18:15:28'
  ),
  (
    85,
    NULL,
    'products',
    82,
    'Tybo-Invoice',
    0,
    0,
    0,
    '{\"name\": \"API Integration\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 81, \"taxAmount\": 0, \"unitPrice\": \"3500\", \"totalPrice\": \"3500\", \"description\": \"We connect your apps and automate workflows across your tools.\"}',
    '2025-06-02 18:15:28',
    '2025-06-02 18:15:28'
  ),
  (
    86,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"tax\": 0, \"type\": \"invoice\", \"items\": [87, 88], \"notes\": \"\", \"total\": 7000, \"number\": \"INV-2025-413\", \"status\": \"draft\", \"dueDate\": \"\", \"clientId\": 71, \"subtotal\": 7000, \"issueDate\": \"2025-06-03\", \"organizationId\": 72}',
    '2025-06-03 17:57:11',
    '2025-06-03 17:57:11'
  ),
  (
    87,
    NULL,
    'invoice_items',
    86,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \" Custom Web Development\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 76, \"taxAmount\": 0, \"unitPrice\": \"3500\", \"totalPrice\": \"3500\", \"description\": \"Tailor-made websites, platforms, and systems to match your workflow.\"}',
    '2025-06-03 17:57:11',
    '2025-06-03 17:57:11'
  ),
  (
    88,
    NULL,
    'invoice_items',
    86,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"API Integration\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 81, \"taxAmount\": 0, \"unitPrice\": \"3500\", \"totalPrice\": \"3500\", \"description\": \"We connect your apps and automate workflows across your tools.\"}',
    '2025-06-03 17:57:11',
    '2025-06-03 17:57:11'
  ),
  (
    89,
    NULL,
    'clients',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Ndumiso Mthembu\", \"email\": \"accountstt@tybo.co.za\", \"phone\": \"0842529472\", \"address\": \"Block 56 The William, William Nicol Drive &, Broadacres Dr, Zevenfontein 407-Jr\", \"website\": \"\", \"industry\": \"\", \"companyVat\": \"\"}',
    '2025-06-03 20:33:26',
    '2025-06-03 20:33:26'
  ),
  (
    90,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"tax\": 0, \"type\": \"invoice\", \"items\": [91], \"notes\": \"\", \"total\": 5000, \"number\": \"INV-2025-783\", \"status\": \"completed\", \"dueDate\": \"2025-06-30\", \"clientId\": 71, \"subtotal\": 5000, \"issueDate\": \"2025-06-04\", \"organizationId\": 1}',
    '2025-06-04 04:11:27',
    '2025-06-04 13:09:16'
  ),
  (
    91,
    NULL,
    'invoice_items',
    90,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Internal Tools & Automation Sprint 1\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 77, \"taxAmount\": 0, \"unitPrice\": \"5000\", \"totalPrice\": 5000, \"description\": \"Dashboards, CRMs, inventory systems — built for your operations.\"}',
    '2025-06-04 04:11:27',
    '2025-06-04 13:09:16'
  ),
  (
    93,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Website Design & Application System\", \"quantity\": \"\", \"frequency\": \"one-time\", \"unitPrice\": \"3500\", \"description\": \"Custom website that allows users to apply for loans online. Includes admin dashboard to manage loan applications and statuses.\"}',
    '2025-06-04 18:53:08',
    '2025-06-04 18:53:08'
  ),
  (
    94,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Annual Domain Hosting\", \"quantity\": \"\", \"frequency\": \"yearly\", \"unitPrice\": \"1000\", \"description\": \"Includes 1 year of domain registration and hosting.\"}',
    '2025-06-04 18:53:36',
    '2025-06-04 18:53:36'
  ),
  (
    95,
    NULL,
    'clients',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"ONLINETHALENTE INVESTMENTS\", \"email\": \"n/a\", \"phone\": \"+27 64 005 2708\", \"address\": \"\", \"website\": \"\", \"industry\": \"\", \"companyVat\": \"\"}',
    '2025-06-04 18:54:00',
    '2025-06-04 18:54:00'
  ),
  (
    96,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"tax\": 0, \"type\": \"quote\", \"items\": [97, 98], \"notes\": \"Development of the loan application system will begin upon receipt of a 50% deposit (R1,750.00).\\nEstimated completion timeline is 4 weeks including testing and feedback.\\nFinal payment is due upon delivery of the completed application.\\n\\n\", \"total\": 4500, \"number\": \"INV-2025-01\", \"status\": \"sent\", \"dueDate\": \"2025-07-04\", \"clientId\": 95, \"subtotal\": 4500, \"issueDate\": \"2025-06-04\", \"organizationId\": 1}',
    '2025-06-04 18:57:32',
    '2025-06-04 18:57:32'
  ),
  (
    97,
    NULL,
    'invoice_items',
    96,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Annual Domain Hosting\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"yearly\", \"serviceId\": 94, \"taxAmount\": 0, \"unitPrice\": \"1000\", \"totalPrice\": \"1000\", \"description\": \"Includes 1 year of domain registration and hosting.\"}',
    '2025-06-04 18:57:32',
    '2025-06-04 18:57:32'
  ),
  (
    98,
    NULL,
    'invoice_items',
    96,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Website Design & Application System\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 93, \"taxAmount\": 0, \"unitPrice\": \"3500\", \"totalPrice\": \"3500\", \"description\": \"Custom website that allows users to apply for loans online. Includes admin dashboard to manage loan applications and statuses.\"}',
    '2025-06-04 18:57:32',
    '2025-06-04 18:57:32'
  ),
  (
    99,
    NULL,
    'clients',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Target Pathology Laboratories\", \"email\": \"info@targetlab.co.za\", \"phone\": \"+27 11 493 1116\", \"address\": \"\", \"website\": \"\", \"industry\": \"\", \"companyVat\": \"\"}',
    '2025-06-05 14:16:56',
    '2025-06-05 14:17:02'
  ),
  (
    100,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"System Development & Installation\\t\", \"quantity\": \"\", \"frequency\": \"one-time\", \"unitPrice\": \"15000\", \"description\": \"Development and delivery of a custom web-based Policy and Training Hub (\\\"TrainVault\\\") for internal document and training management. This includes:\\n\\nSystem planning and consultation\\n\\nFrontend and backend development\\n\\nDocument upload and categorization features\\n\\nTraining module creation with quizzes\\n\\nUser login and role-based access control\\n\\nAdmin dashboard for reporting and audit logs\\n\\nOn-premise installation and setup on client servers\\n\\n1-month post-deployment support\"}',
    '2025-06-05 14:18:13',
    '2025-06-05 14:18:13'
  ),
  (
    101,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"tax\": 0, \"type\": \"quote\", \"items\": [102], \"notes\": \"Delivery timeline: 4–6 weeks from deposit confirmation\\n\\n1 Year ongoing support included; future work billed hourly or per task\\n\\nQuotation valid for 14 days\\n\\n\", \"total\": 15000, \"number\": \"QT-2025-028\", \"status\": \"sent\", \"dueDate\": \"\", \"clientId\": 99, \"subtotal\": 15000, \"issueDate\": \"2025-06-05\", \"organizationId\": 1}',
    '2025-06-05 14:18:55',
    '2025-06-05 14:21:20'
  ),
  (
    102,
    NULL,
    'invoice_items',
    101,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"System Development & Installation\\t\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"one-time\", \"serviceId\": 100, \"taxAmount\": 0, \"unitPrice\": \"15000\", \"totalPrice\": \"15000\", \"description\": \"Development and delivery of a custom web-based Policy and Training Hub (\\\"TrainVault\\\") for internal document and training management. This includes:\\n\\nSystem planning and consultation\\n\\nFrontend and backend development\\n\\nDocument upload and categorization features\\n\\nTraining module creation with quizzes\\n\\nUser login and role-based access control\\n\\nAdmin dashboard for reporting and audit logs\\n\\nOn-premise installation and setup on client servers\\n\\n1-month post-deployment support\"}',
    '2025-06-05 14:18:55',
    '2025-06-05 14:18:55'
  ),
  (
    103,
    NULL,
    'invoices',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"tax\": 0, \"type\": \"quote\", \"items\": [106], \"notes\": \"Terms & Notes\\nSubscription billed monthly in advance\\n\\nCancel anytime with 30 days’ written notice\\n\\nIncludes hosting, support, and updates\\n\\nQuotation valid for 14 days\", \"total\": 1500, \"number\": \"#QT-2025-029\", \"status\": \"sent\", \"dueDate\": \"\", \"clientId\": 99, \"subtotal\": 1500, \"issueDate\": \"2025-06-05\", \"organizationId\": 1}',
    '2025-06-05 14:30:28',
    '2025-06-05 14:32:58'
  ),
  (
    105,
    NULL,
    'services',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Monthly Subscription Fee\\t\", \"quantity\": \"\", \"frequency\": \"monthly\", \"unitPrice\": \"1500\", \"description\": \"Subscription access to TrainVault, a hosted Policy and Training Hub, which includes:\\n\\nWeb-based system access for your team\\n\\nFully managed hosting and maintenance\\n\\nOngoing feature updates and bug fixes\\n\\nRole-based document access and tracking\\n\\nBuilt-in training modules and staff engagement reports\\n\\nSupport and backup included\"}',
    '2025-06-05 14:32:30',
    '2025-06-05 14:32:30'
  ),
  (
    106,
    NULL,
    'invoice_items',
    103,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Monthly Subscription Fee\\t\", \"notes\": \"\", \"taxRate\": 0, \"quantity\": 1, \"frequency\": \"monthly\", \"serviceId\": 105, \"taxAmount\": 0, \"unitPrice\": \"1500\", \"totalPrice\": \"1500\", \"description\": \"Subscription access to TrainVault, a hosted Policy and Training Hub, which includes:\\n\\nWeb-based system access for your team\\n\\nFully managed hosting and maintenance\\n\\nOngoing feature updates and bug fixes\\n\\nRole-based document access and tracking\\n\\nBuilt-in training modules and staff engagement reports\\n\\nSupport and backup included\"}',
    '2025-06-05 14:32:58',
    '2025-06-05 14:32:58'
  ),
  (
    107,
    NULL,
    'clients',
    0,
    'Tybo-Invoice',
    1,
    9,
    9,
    '{\"name\": \"Droplyn\", \"email\": \"thzuma@outlook.com\", \"phone\": \"+27 83 897 6437\", \"address\": \"\", \"website\": \"\", \"industry\": \"\", \"companyVat\": \"\"}',
    '2025-07-14 22:32:31',
    '2025-07-14 22:32:31'
  );

-- --------------------------------------------------------
--
-- Table structure for table `collection_link`
--
CREATE TABLE
  `collection_link` (
    `id` int NOT NULL,
    `source_id` int NOT NULL,
    `source_collection` varchar(100) NOT NULL,
    `target_id` int NOT NULL,
    `target_collection` varchar(100) NOT NULL,
    `relation_type` varchar(100) DEFAULT NULL,
    `data` json DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

--
-- Dumping data for table `collection_link`
--
INSERT INTO
  `collection_link` (
    `id`,
    `source_id`,
    `source_collection`,
    `target_id`,
    `target_collection`,
    `relation_type`,
    `data`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    17,
    15,
    'products',
    40,
    'variations',
    'product-variation',
    '[]',
    '2025-05-31 01:53:37',
    '2025-05-31 01:53:37'
  ),
  (
    19,
    15,
    'products',
    39,
    'variations',
    'product-variation',
    '[]',
    '2025-05-31 01:53:38',
    '2025-05-31 01:53:38'
  ),
  (
    20,
    15,
    'products',
    42,
    'variation_options',
    'product-variation-option',
    '{\"variation_id\": 39}',
    '2025-05-31 02:48:35',
    '2025-05-31 02:48:35'
  ),
  (
    21,
    15,
    'products',
    50,
    'variation_options',
    'product-variation-option',
    '{\"variation_id\": 40}',
    '2025-05-31 02:49:02',
    '2025-05-31 02:49:02'
  ),
  (
    22,
    39,
    'products',
    41,
    'variation_options',
    'product-variation-option',
    '{\"variation_id\": 39}',
    '2025-05-31 03:02:01',
    '2025-05-31 03:02:01'
  ),
  (
    23,
    40,
    'products',
    49,
    'variation_options',
    'product-variation-option',
    '{\"variation_id\": 40}',
    '2025-05-31 03:02:04',
    '2025-05-31 03:02:04'
  ),
  (
    24,
    40,
    'products',
    52,
    'variation_options',
    'product-variation-option',
    '{\"variation_id\": 40}',
    '2025-05-31 03:03:14',
    '2025-05-31 03:03:14'
  ),
  (
    25,
    40,
    'item-variation',
    49,
    'item-variation-option',
    'product-variation-option',
    '{\"variation_id\": 40}',
    '2025-05-31 03:08:30',
    '2025-05-31 03:08:30'
  );

-- --------------------------------------------------------
--
-- Table structure for table `company`
--
CREATE TABLE
  `company` (
    `id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `website` varchar(255) DEFAULT NULL,
    `address` text,
    `logo` varchar(255) DEFAULT NULL,
    `industry` varchar(100) DEFAULT NULL,
    `company_vat` varchar(100) DEFAULT NULL,
    `statusId` int DEFAULT '1',
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` int DEFAULT '0',
    `updated_by` int DEFAULT '0',
    `metadata` json NOT NULL
  );

--
-- Dumping data for table `company`
--
INSERT INTO
  `company` (
    `id`,
    `name`,
    `email`,
    `phone`,
    `website`,
    `address`,
    `logo`,
    `industry`,
    `company_vat`,
    `statusId`,
    `created_at`,
    `updated_at`,
    `created_by`,
    `updated_by`,
    `metadata`
  )
VALUES
  (
    1,
    'Tybo Solutions',
    '',
    '',
    'Tybo-Invoice',
    '',
    'https://ithebula.tybo.co.za/api/api/upload/uploads/img_1749000745_7c1fee71.png',
    'Technology',
    '',
    1,
    '2025-06-03 21:12:46',
    '2025-06-04 19:06:36',
    0,
    0,
    '{\"bankName\": \"FNB\", \"textColor\": \"#ff0080\", \"branchCode\": \"255355\", \"accentColor\": \"#ff8040\", \"accountType\": \"current\", \"primaryColor\": \"#804000\", \"templateType\": \"minimal\", \"accountNumber\": \"62897317098\"}'
  ),
  (
    2,
    'Tybo Solutions',
    '',
    '',
    'Tybo-Invoice',
    '',
    'https://ithebula.tybo.co.za/api/api/upload/uploads/img_1749040454_768a5f3c.png',
    'Tech',
    '',
    1,
    '2025-06-04 14:34:16',
    '2025-06-04 14:34:16',
    0,
    0,
    '{\"bankName\": \"\", \"textColor\": \"#23272F\", \"branchCode\": \"\", \"accentColor\": \"#23272F\", \"accountType\": \"Current\", \"primaryColor\": \"#6366F1\", \"templateType\": \"modern\", \"accountNumber\": \"\"}'
  ),
  (
    3,
    's',
    '',
    '',
    'Tybo-Invoice',
    '',
    '',
    'd',
    '',
    1,
    '2025-06-04 14:34:51',
    '2025-06-04 14:34:51',
    0,
    0,
    '{\"bankName\": \"\", \"textColor\": \"#23272F\", \"branchCode\": \"\", \"accentColor\": \"#23272F\", \"accountType\": \"Current\", \"primaryColor\": \"#6366F1\", \"templateType\": \"modern\", \"accountNumber\": \"\"}'
  ),
  (
    4,
    'Apple',
    '',
    '',
    'Tybo-Invoice',
    '',
    '',
    '',
    '',
    1,
    '2025-06-04 16:49:54',
    '2025-06-04 16:49:54',
    0,
    0,
    '{\"bankName\": \"\", \"textColor\": \"#23272F\", \"branchCode\": \"\", \"accentColor\": \"#23272F\", \"accountType\": \"Current\", \"primaryColor\": \"#6366F1\", \"templateType\": \"modern\", \"accountNumber\": \"\"}'
  );

-- --------------------------------------------------------
--
-- Table structure for table `User`
--
CREATE TABLE
  `User` (
    `id` int NOT NULL,
    `website_id` varchar(400) NOT NULL,
    `company_id` int DEFAULT NULL,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(100) DEFAULT NULL,
    `phone` varchar(50) DEFAULT NULL,
    `address` text,
    `created_by` int DEFAULT NULL,
    `updated_by` int DEFAULT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `statusId` int DEFAULT '1',
    `metadata` json NOT NULL
  );

--
-- Dumping data for table `User`
--
INSERT INTO
  `User` (
    `id`,
    `website_id`,
    `company_id`,
    `name`,
    `email`,
    `password`,
    `role`,
    `phone`,
    `address`,
    `created_by`,
    `updated_by`,
    `created_at`,
    `updated_at`,
    `statusId`,
    `metadata`
  )
VALUES
  (
    1,
    'Tybo-Invoice',
    1,
    'Ndumiso Mthembu',
    'accountstt@tybo.co.za',
    '$2y$10$inF516BeQr3PyD4Ychq2MODk5qNgt1S1s.dMl8CEJPFjPV6RkYENy',
    'Client',
    '0842529472',
    'Block 56 The William, \nWilliam Nicol Drive &, Broadacres Dr,\n Zevenfontein 407-Jr',
    1,
    1,
    '2025-05-30 11:34:54',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    2,
    'Viviid',
    1,
    'Admin User',
    'admin@viviid.co.za',
    '$2y$10$uyHpCvFh3pyVZVJ/.Zg/i.haCBKFv.UMfXvhqBbFOPViAcYstULSa',
    'Admin',
    '011 255 5874',
    '101 ABC ',
    1,
    2,
    '2025-05-30 12:42:59',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    3,
    'Viviid',
    1,
    'Developer',
    'dev@tybo.co.za',
    '$2y$10$eoTwn.2R/cSFzIVehPSz7.3.mZzHktuN/ARUQdV2P6K0ODQc4G76O',
    'Developer',
    '0842529472',
    'Block 56 The William, William Nicol Drive &, Broadacres Dr, Zevenfontein 407-Jr',
    0,
    2,
    '2025-05-30 13:05:23',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    6,
    'Tybo-Invoice',
    1,
    'Ndumiso Mthembu',
    'accounts@tybo.co.za',
    '$2y$10$zDAXDsOvQfaKTduTPxRnA.6SpGswcqYlB8PZaqkPBM1EADu80xWC2',
    'Client',
    '',
    '',
    1,
    0,
    '2025-06-02 11:59:58',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    7,
    'Tybo-Invoice',
    1,
    'Empire R=Trading',
    'admin@empire.co.za',
    '$2y$10$Wa5IoieCdFiWIfiYx9l3Hu3z2YxN7Z38rVm1aVk3ncKXvWpcxCNJm',
    'Client',
    '',
    '',
    1,
    0,
    '2025-06-02 12:02:03',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    8,
    'Tybo-Invoice',
    1,
    'Ndumiso Mthembu',
    'accountstt11@tybo.co.za',
    '$2y$10$8mI62fldPXNw4m4ilC.he.aDc1OmaEQJVd9l3zFh0QgpTHWwSHD8q',
    'Client',
    '',
    '',
    1,
    0,
    '2025-06-02 12:06:23',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    9,
    'Tybo-Invoice',
    1,
    'Joana Moow',
    'admin@instanteats.co.za',
    '$2y$10$CHw/pKtcLfkzST8ugO.BQuRvKLyvIXY9TE/qdNEsqihzvZLZmdL96',
    'Admin',
    '0842529472',
    'Block 56 The William, William Nicol Drive &, Broadacres Dr, Zevenfontein 407-Jr',
    1,
    9,
    '2025-06-02 12:08:39',
    '2025-06-03 16:36:33',
    1,
    'null'
  ),
  (
    10,
    'Tybo-Invoice',
    0,
    'Ndumiso Mthembu',
    'sales@tybo.co.za',
    '$2y$10$ft6ySHA.ub9ij24Hnp81HOSWcn5B0UZQeVSrWMss8YV8GVvxyU7eS',
    'Admin',
    '',
    '',
    1,
    0,
    '2025-06-04 14:33:48',
    '2025-06-04 14:33:48',
    1,
    '[]'
  ),
  (
    11,
    'Tybo-Invoice',
    4,
    'Jame',
    'jj@mail.com',
    '$2y$10$AUEe0iuwH09SLy1yE0yfR.T5LbXey/MGiFxDQSM.5rQLutU3zlzse',
    'Admin',
    '',
    '',
    1,
    0,
    '2025-06-04 16:49:54',
    '2025-06-04 16:49:54',
    1,
    '{\"selectedPackage\": \"pay-as-you-go\"}'
  );

--
-- Indexes for dumped tables
--
--
-- Indexes for table `collection_data`
--
ALTER TABLE `collection_data` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collection_link`
--
ALTER TABLE `collection_link` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `collection_data`
--
ALTER TABLE `collection_data` MODIFY `id` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 108;

--
-- AUTO_INCREMENT for table `collection_link`
--
ALTER TABLE `collection_link` MODIFY `id` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 26;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company` MODIFY `id` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User` MODIFY `id` int NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 12;

COMMIT;
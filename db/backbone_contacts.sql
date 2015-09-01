SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
--
-- --
-- -- Database: `backbone_contacts`
-- --
--
-- -- --------------------------------------------------------
--
-- --
-- -- Table structure for table `contacts`
-- --
--
CREATE TABLE `contacts` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `tel` varchar(255) DEFAULT NULL,
    `type` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `email` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`name`, `address`, `tel`, `type`, `email`) VALUES
('Contact 1', '1, a street, a town, a city, AB12 3CD', 123456789, 'family', 'anemail@me.com'),
('Contact 2', '1, a street, a town, a city, AB12 3CD', 123456789, 'family', 'anemail@me.com'),
('Contact 3', '1, a street, a town, a city, AB12 3CD', 123456789, 'friends', 'anemail@me.com'),
('Contact 4', '1, a street, a town, a city, AB12 3CD', 123456789, 'colleagues', 'anemail@me.com'),
('Contact 5', '1, a street, a town, a city, AB12 3CD', 123456789, 'friends', 'anemail@me.com'),
('Contact 6', '1, a street, a town, a city, AB12 3CD', 123456789, 'friends', 'anemail@me.com'),
('Contact 7', '1, a street, a town, a city, AB12 3CD', 123456789, 'family', 'anemail@me.com'),
('Contact 8', '1, a street, a town, a city, AB12 3CD', 123456789, 'colleagues', 'anemail@me.com');
--
-- Indexes for dumped tables
--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `id` (`id`),
    ADD KEY `id_2` (`id`);


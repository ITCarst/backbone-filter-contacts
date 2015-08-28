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
    `id` int(11) NOT NULL,
    `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `address` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `tel` int(11) DEFAULT NULL,
    `type` varchar(255) COLLATE utf8_bin DEFAULT NULL,
    `email` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `address`, `tel`, `type`, `email`) VALUES
(1, 'Contact 1', '1, a street, a town, a city, AB12 3CD', 123456789, 'Family', 'anemail@me.com'),
(2, 'Contact 2', '1, a street, a town, a city, AB12 3CD', 123456789, 'Family', 'anemail@me.com'),
(3, 'Contact 3', '1, a street, a town, a city, AB12 3CD', 123456789, 'Friends', 'anemail@me.com'),
(4, 'Contact 4', '1, a street, a town, a city, AB12 3CD', 123456789, 'Colleagues', 'anemail@me.com'),
(5, 'Contact 5', '1, a street, a town, a city, AB12 3CD', 123456789, 'Friends', 'anemail@me.com'),
(6, 'Contact 6', '1, a street, a town, a city, AB12 3CD', 123456789, 'Friends', 'anemail@me.com'),
(7, 'Contact 7', '1, a street, a town, a city, AB12 3CD', 123456789, 'Family', 'anemail@me.com'),
(8, 'Contact 8', '1, a street, a town, a city, AB12 3CD', 123456789, 'Colleagues', 'anemail@me.com');
--
-- Indexes for dumped tables
--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
    ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `id` (`id`),
    ADD KEY `id_2` (`id`);


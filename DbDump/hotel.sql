-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июл 13 2023 г., 16:51
-- Версия сервера: 10.4.28-MariaDB
-- Версия PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `hotel`
--

DELIMITER $$
--
-- Процедуры
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `All_Room` ()   BEGIN
	SELECT * from hotel_room;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Available_rooms_for_period` (IN `new_chek_in` DATE, IN `new_chek_out` INT)   BEGIN
SELECT h.id, h.room_number, h.description
from hotel_room as h LEFT JOIN check_in 
on h.id = check_in.id_hotel_room 
where NOT EXISTS(
    SELECT true 
    FROM check_in as c
    where c.id_hotel_room = h.id
    AND (
        c.valid_registration = true AND
        new_chek_in BETWEEN c.check_in AND c.check_out OR
        new_chek_out BETWEEN c.check_in AND c.check_out OR
        c.check_in BETWEEN new_chek_in AND new_chek_out OR
        c.check_out BETWEEN new_chek_in AND new_chek_out
   )
) GROUP BY h.id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `book_room` (IN `id_room` INT, IN `check_in` DATE, IN `check_out` DATE, IN `guest_data` VARCHAR(1000), IN `is_vip` BOOLEAN)   BEGIN
	INSERT INTO `check_in` (`id_hotel_room`, `check_in`, `check_out`, `guest_data`, `vip`) 
	VALUES (id_room, check_in, check_out, guest_data, is_vip);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `cancel_reservation` (IN `id_check_in` INT)   BEGIN
	UPDATE `check_in` SET `valid_registration` = '0' WHERE `check_in`.`id` = id_check_in;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `check_in`
--

CREATE TABLE `check_in` (
  `id` int(11) NOT NULL,
  `id_hotel_room` int(11) NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `guest_data` varchar(1000) DEFAULT NULL,
  `valid_registration` tinyint(1) NOT NULL DEFAULT 1,
  `vip` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `check_in`
--

INSERT INTO `check_in` (`id`, `id_hotel_room`, `check_in`, `check_out`, `guest_data`, `valid_registration`, `vip`) VALUES
(1, 1, '2023-07-13', '2023-07-31', 'Шевчук Алексей Викторович', 1, 0),
(2, 1, '2023-08-01', '2023-08-03', NULL, 1, 0),
(3, 3, '2023-07-01', '2023-07-11', NULL, 1, 0),
(4, 3, '2023-07-13', '2023-07-19', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `hotel_room`
--

CREATE TABLE `hotel_room` (
  `id` int(11) NOT NULL,
  `room_number` int(11) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `hotel_room`
--

INSERT INTO `hotel_room` (`id`, `room_number`, `description`) VALUES
(1, 1, 'Живописный вид на море'),
(3, 2, 'foo'),
(4, 3, 'bar');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `check_in`
--
ALTER TABLE `check_in`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_hotel_room` (`id_hotel_room`);

--
-- Индексы таблицы `hotel_room`
--
ALTER TABLE `hotel_room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_number` (`room_number`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `check_in`
--
ALTER TABLE `check_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `hotel_room`
--
ALTER TABLE `hotel_room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `check_in`
--
ALTER TABLE `check_in`
  ADD CONSTRAINT `check_in_ibfk_1` FOREIGN KEY (`id_hotel_room`) REFERENCES `hotel_room` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

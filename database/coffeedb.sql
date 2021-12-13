-- MySQL dump 10.13  Distrib 8.0.23, for macos10.15 (x86_64)
--
-- Host: localhost    Database: coffeedb
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT 'Ireland',
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id_UNIQUE` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'John','King','47 Forest Park','Galway','Ireland','johnking47@notarealemail.com'),(2,'Mary','Rashford','121 Aubrey Avenue','Galway','Ireland','maryrashford@notarealemail.com'),(3,'Fabio','Bellotti','8 Elm Woods','Cork','Ireland','bellotti4ever@notarealemail.com'),(4,'Mei','Liu','76 Sandford Drive','Manchester','United Kingdom','859292@notarealemail.com'),(5,'Karim','Al-Absi','13 Penelope Road','Portlaoise','Ireland','kaa@notarealemail.com'),(6,'Caoimhe','Doherty','11 Jacobs Court','Galway','Ireland','superpanda@notarealemail.com'),(7,'John','Doherty','11 Jacobs Court','Galway','Ireland','dohertyjohnny1982@notarealemail.com'),(8,'Emma','Simmons','18a Ocean View','Brighton','United Kingdom','mandms@notarealemail.com'),(9,'Natasha','Yegorova','41 Lakeside Drive','Loughrea','Ireland','yegorovan@notarealemail.com'),(10,'Dwayne','Yeung','25 Spindle Park','Limerick','Ireland','foreveryeung@notarealemail.com'),(11,'Eli','Farral','38 Cheddar Lane','Bristol','United Kingdom','eliismyname@notarealemail.com'),(12,'Marcus','Aurelius','3 Thinkers Place','Athens','Greece','stoic_4_life@notarealemail.com'),(13,'Chloe','Coolson','5 Forest Park','Barna','Ireland','ccool@notarealemail.com'),(14,'Frank','Potter','14 Yellow-Brick Road','Limerick','Ireland','potter_frank_1991@notarealemail.com'),(15,'Frieda','Catson','7 Pine Court','Oranmore','Ireland','kittycatson@notarealemail.com'),(16,'Yun','Ma','17 The Stairs','Ballinasloe','Ireland','mayun@notarealemail.com'),(17,'Annabella','Martinelli','9 Jacobs Creek','Newbridge','Ireland','martinelli36@notarealemail.com'),(18,'Jurgen','Schweinsteiger','26 Old Road','Spiddal','Ireland','jurgennahatethispun@notarealemail.com'),(19,'Sadie','Frank','44a Fiddlers Terrace','Dublin','Ireland','sadfrank@notarealemail.com'),(28,'Timmy','Rabbitson','19A Evergreen Gardens','Ballinasloe','Ireland','literallyarabbit@isarabbitofcourse.com'),(29,'Brendan','McClusky','18 Canalview','Tullamore','Ireland','easypeasy@lemonsqueezyfake.com');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(250) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `product_description` varchar(250) DEFAULT NULL,
  `product_image_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'1 Coffee Bean',0.05,'Literally 1 Coffee Bean','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/1bean.png'),(2,'5 Coffee Beans',0.23,'What is better than 1 Coffee Bean? 5!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/5beans.png'),(3,'10 Coffee Beans',0.45,'Lets make it a cool 10.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/10beans.png'),(4,'30 Coffee Beans',1.20,'Triple the beans of our 10 bean bag, and triple the fun.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/30beans.png'),(5,'50 Coffee Beans',1.99,'50 beans - probably gets a cup or two!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/50beans.png'),(6,'100 Coffee Beans',3.75,'Enough beans to for a coffee break, I guess.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/100beans.png'),(7,'250 Coffee Beans',7.00,'A bean for every occassion!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/250beans.png'),(8,'500 Coffee Beans',13.50,'This might actually be a lot of coffee beans.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/500beans.png'),(9,'1000 Coffee Beans',25.00,'One thousand beans! Imagine the possibilities!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/1000beans.png'),(10,'5000 Coffee Beans',47.50,'Crazy numbers of beans.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/5000beans.png'),(11,'10000 Coffee Beans',90.00,'Over 9000 beans!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/10000beans.png'),(12,'25000 Coffee Beans',230.00,'Love coffee? How about 25k beans in one bag!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/25000beans.png'),(13,'50000 Coffee Beans',400.00,'50k Coffee Beans sounds like a lot.','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/50000beans.png'),(14,'100000 Coffee Beans',600.00,'Best value! 1 hundred thousand beans! Is that a lot or a little, who knows?!','https://raw.githubusercontent.com/OtherBrian/data-representation-project/main/images/100000beans.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'brian','testtest@testtest.com','thisisjustatest'),(2,'admin','fakeadmin@fakefakeadmin.com','iamtheadmin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-13 18:05:50

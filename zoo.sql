-- MySQL dump 10.13  Distrib 9.0.1, for macos15.0 (arm64)
--
-- Host: localhost    Database: zoo
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `family_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `IDX_6AAB231FC35E566A` (`family_id`),
  CONSTRAINT `FK_6AAB231FC35E566A` FOREIGN KEY (`family_id`) REFERENCES `family` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (106,1,'Dog','A domestic animal'),(107,1,'Pig','A farm animal'),(108,2,'Snake','A dangerous animal'),(109,2,'Crocodile','A very dangerous animal'),(110,3,'Shark','A highly dangerous marine animal'),(111,4,'Eagle','A majestic bird of prey'),(112,5,'Frog','A jumping amphibian'),(113,6,'Butterfly','A colorful insect'),(114,7,'Spider','An eight-legged arachnid'),(115,8,'Octopus','An intelligent cephalopod'),(116,9,'Lobster','A delicious crustacean'),(117,1,'Lion','The king of the savannah'),(118,4,'Penguin','A swimming bird'),(119,2,'Turtle','A reptile with a shell'),(120,1,'Dolphin','An intelligent marine mammal'),(121,1,'Koala','An arboreal marsupial'),(122,1,'Panda','A herbivorous bear'),(123,1,'Gorilla','A large ape'),(124,1,'Kangaroo','A jumping marsupial'),(125,4,'Toucan','A bird with a colorful beak'),(126,4,'Flamingo','A pink wading bird'),(127,2,'Chameleon','A color-changing reptile'),(128,3,'Seahorse','A uniquely shaped fish'),(129,1,'Orca','A predatory cetacean'),(130,1,'Polar Bear','An Arctic mammal'),(131,4,'Emperor Penguin','An Antarctic bird'),(132,4,'Hummingbird','The smallest bird'),(133,5,'Axolotl','A regenerating amphibian'),(134,7,'Scorpion','A venomous arachnid'),(135,3,'Jellyfish','A translucent marine animal'),(136,1,'Pangolin','A scaly mammal'),(137,1,'Okapi','A relative of the giraffe'),(138,8,'Nautilus','A shelled cephalopod'),(139,1,'Tapir','A mammal with a trunk'),(140,2,'Komodo Dragon','The largest lizard');
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_continent`
--

DROP TABLE IF EXISTS `animal_continent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_continent` (
  `animal_id` int NOT NULL,
  `continent_id` int NOT NULL,
  PRIMARY KEY (`animal_id`,`continent_id`),
  KEY `IDX_946321138E962C16` (`animal_id`),
  KEY `IDX_94632113921F4C77` (`continent_id`),
  CONSTRAINT `FK_946321138E962C16` FOREIGN KEY (`animal_id`) REFERENCES `animal` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_94632113921F4C77` FOREIGN KEY (`continent_id`) REFERENCES `continent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_continent`
--

LOCK TABLES `animal_continent` WRITE;
/*!40000 ALTER TABLE `animal_continent` DISABLE KEYS */;
INSERT INTO `animal_continent` VALUES (106,15),(106,16),(106,17),(106,18),(106,19),(106,20),(107,15),(107,17),(108,15),(108,17),(108,18),(109,15),(109,18),(110,16),(111,15),(111,19),(112,20),(113,16),(114,17),(115,18),(116,19),(117,17),(118,21),(119,20),(120,18),(121,18),(122,16),(123,17),(124,18),(125,20),(126,17),(127,17),(128,18),(129,21),(130,19),(131,21),(132,20),(133,19),(134,17),(135,16),(136,16),(137,17),(138,18),(139,20),(140,16);
/*!40000 ALTER TABLE `animal_continent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `continent`
--

DROP TABLE IF EXISTS `continent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `continent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `continent`
--

LOCK TABLES `continent` WRITE;
/*!40000 ALTER TABLE `continent` DISABLE KEYS */;
INSERT INTO `continent` VALUES (15,'Europe'),(16,'Asia'),(17,'Africa'),(18,'Oceania'),(19,'North America'),(20,'South America'),(21,'Antarctica');
/*!40000 ALTER TABLE `continent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20241001061930','2024-10-01 06:19:35',67);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (1,'mammal','Vertebrate animals that nurse their young with milk'),(2,'reptile','Vertebrate animals that crawl'),(3,'fish','Vertebrate animals of the aquatic world'),(4,'bird','Vertebrate animals with feathers capable of flying'),(5,'amphibian','Vertebrate animals that live on land and in water'),(6,'insect','Six-legged invertebrate animals'),(7,'arachnid','Eight-legged invertebrate animals'),(8,'cephalopod','Marine animals with tentacles'),(9,'crustacean','Aquatic animals with a shell');
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `custom_username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:array)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES 
(1, 'user', 'user@test.com', '$2y$13$JU8TEDgMXTNCShZjszAQ6O/MToxAX7fCU/fly5O09ibUZPmwHkoge', 0, '["ROLE_USER"]'),
(2, 'user-test', 'user-test@test.com', '$2y$13$QZZQP1AAHts4Eupk/voQze6ThbPoR6I4KVtoSAr1udDfX.4v3jniu', 0, '["ROLE_USER"]'),
(3, 'admin', 'admin@test.com', '$2y$13$LmsXBBmXzEDYxd9PPowpaOFeZ8745RfTzgot.5r7b8OeDX.47wM/C', 1, '["ROLE_USER","ROLE_ADMIN"]'),
(4, 'admin-test', 'admin-test@test.com', '$2y$13$xNkgdrgq7sKS6Iw2DeNVGOsLH6rS8ivffEFAgQ2nrfEUb9rtk0Uvy', 1, '["ROLE_USER","ROLE_ADMIN"]');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-19 11:26:35

-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: crm_mitlevelup
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Current Database: `crm_mitlevelup`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `crm_mitlevelup` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `crm_mitlevelup`;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `entityType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `activity_logs_clientId_fkey` (`clientId`),
  KEY `activity_logs_userId_fkey` (`userId`),
  CONSTRAINT `activity_logs_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES ('cmucfswxa002f9dqkwvp3sjgf','cmucfswtt000k9dqkxh0qg9xn','cmucfswsq00019dqk6kiq7jzm','PROSPECT_CREE','Création de la fiche prospect Mpanorina Nofy',NULL,NULL,'2026-08-15 09:00:00.000'),('cmucfswxa002g9dqkgmd8gd9x','cmucfswtt000k9dqkxh0qg9xn','cmucfswt600029dqks5zp8fjk','APPEL_EFFECTUE','Premier échange téléphonique de cadrage avec la direction',NULL,NULL,'2026-08-16 14:30:00.000'),('cmucfswxa002h9dqkwgrqfu0z','cmucfswtt000k9dqkxh0qg9xn','cmucfswt600029dqks5zp8fjk','OFFRE_ENVOYEE','Envoi de la proposition pour le développement web et hébergement',NULL,NULL,'2026-08-20 10:15:00.000'),('cmucfswxa002i9dqkrrcph0se','cmucfswtt000k9dqkxh0qg9xn','cmucfswsq00019dqk6kiq7jzm','CONTRAT_SIGNE','Signature électronique validée avec le hash CCE77EA165994C947265FBA93E',NULL,NULL,'2026-09-07 14:32:00.000'),('cmucfswxa002j9dqkgaso8wl6','cmucfswtt000k9dqkxh0qg9xn','cmucfswtc00049dqk388pdekd','ACOMPTE_RECU','Encaissement de 1 350 000 Ar par MVola pour l\'avance 50%',NULL,NULL,'2026-09-08 11:00:00.000'),('cmucfswxa002k9dqkpqjra3nm','cmucfswtt000k9dqkxh0qg9xn','cmucfswt900039dqkhs1mh33c','PROJET_COMMENCE','Lancement du sprint 1 de développement Frontend et maquettes',NULL,NULL,'2026-09-09 08:00:00.000'),('cmucgfm9f00089d3gh4xtvjgw','cmucgfm8v00069d3g0gi0t107',NULL,'PROSPECT_CONVERTI','Prospect converti en client suite à l\'acceptation de l\'offre OFF-2026-0001','Offer','cmucgfm8400039d3gx4qdgu79','2026-09-22 09:11:16.852'),('cmucgfme0000o9d3glbwoelam','cmucgfm8v00069d3g0gi0t107',NULL,'CONTRAT_SIGNE','Contrat CTR-2026-0002 signé par Rado Rakotomalala (Hash: B1C4F9C24DD0914B...)','Contract','cmucgfma4000e9d3gbwx0kzb0','2026-09-22 09:11:17.017'),('cmucgfmf2000t9d3g4gh4y4cr','cmucgfm8v00069d3g0gi0t107',NULL,'PAIEMENT_ENREGISTRE','Encaissement de 1 750 000 Ar via MVOLA pour FAC-2026-0005','Payment','cmucgfmeg000q9d3ga9p71gct','2026-09-22 09:11:17.054');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_events`
--

DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_events` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `allDay` tinyint(1) NOT NULL DEFAULT '0',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ECHEANCE',
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `calendar_events_clientId_fkey` (`clientId`),
  KEY `calendar_events_projectId_fkey` (`projectId`),
  CONSTRAINT `calendar_events_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calendar_events_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Antananarivo',
  `nif` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIF','INACTIF','EN_ATTENTE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIF',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES ('cmucfswtt000k9dqkxh0qg9xn','Direction Mpanorina Nofy','Mpanorina Nofy','+261 34 00 123 45','261340012345','contact@mpanorinanofy.com','Lot II M 45 Ankadifotsy','Antananarivo','4001928374','62011 11 2024 0 01123','https://www.mpanorinanofy.com','Plateforme web et CRM de gestion d\'activités associatives et d\'opportunités de formation.','ACTIF','2026-08-15 00:00:00.000','2026-09-22 08:53:37.458'),('cmucfswuw00149dqkfynwjrta','Hasina Rakoto','Hasina Madagascar Tours','+261 34 88 999 00','261348899900','hasina@madagascar-tours.mg','Enceinte Hôtel Colbert, Antaninarenina','Antananarivo','3001847291','79110 11 2023 0 00451','https://www.hasina-tours.mg','Agence réceptive de voyages touristiques à Madagascar. Circuits Sud, Tsingy et Sainte-Marie.','ACTIF','2026-07-10 00:00:00.000','2026-09-22 08:53:37.496'),('cmucfswvf001f9dqkrsjhuelh','Mme Voahangy','Tunic Madagascar','+261 32 40 555 77','261324055577','contact@tunic-mode.mg','Galerie Smart Tanjombato','Antananarivo',NULL,NULL,'https://www.tunic-mode.mg',NULL,'ACTIF','2026-09-01 00:00:00.000','2026-09-22 08:53:37.516'),('cmucfswvr001l9dqkvqgsv5ys','M. Andry','Pizza Factory','+261 34 99 888 77','261349988877','commande@pizzafactory.mg','Près de l\'Esplanade Ankatso','Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.527','2026-09-22 08:53:37.527'),('cmucfswvz001p9dqk4d3c83bg','Mme Nomena','Yum Box','+261 34 22 333 44','261342233344','contact@yumbox.mg',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.535','2026-09-22 08:53:37.535'),('cmucfsww2001q9dqkjgju28wf','M. Herizo','Prestige Occasion','+261 33 11 444 55','261331144455','info@prestige-occasion.mg',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.538','2026-09-22 08:53:37.538'),('cmucfsww5001r9dqkajqnz1yc','Chef Li','Sushis Panda','+261 34 77 666 55','261347766655','sushispanda.mg@gmail.com',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.542','2026-09-22 08:53:37.542'),('cmucfsww8001s9dqk7aq8m45n','Mme Clara','Miss\'Aile Beauté','+261 32 99 111 22','261329911122','clara@missaile.mg',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.545','2026-09-22 08:53:37.545'),('cmucfswwc001t9dqkwvbeuflm','M. Rado','Lavage Raitra','+261 34 55 444 33','261345544433','contact@lavageraitra.mg',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 08:53:37.548','2026-09-22 08:53:37.548'),('cmucgfm8v00069d3g0gi0t107','Rado Rakotomalala','Antananarivo Tech Hub','+261 34 99 111 22','261349911122','rado@techhub.mg',NULL,'Antananarivo',NULL,NULL,NULL,'Converti depuis le prospect Rado Rakotomalala','ACTIF','2026-09-22 09:11:16.832','2026-09-22 09:11:16.832'),('cmucmq30200009dpo6blszqmc','Miora Antenaina','M-It LevelUp','+261 34 5403898','261345403898','razakatiana.antenaina@yahoo.com',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-22 12:07:22.801','2026-09-22 12:07:22.801'),('cmue3z0fw00009dog0r3co8mx','Désiré','JD-services','+33 6 25 98 67 23','33625986723','contact@jd-services.fr',NULL,'Antananarivo',NULL,NULL,NULL,NULL,'ACTIF','2026-09-23 12:57:59.025','2026-09-23 12:57:59.025');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_settings`
--

DROP TABLE IF EXISTS `company_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_settings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'M-It LevelUp',
  `managerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Miora Antenaina RAZAKATIANA',
  `nif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '5019189714',
  `stat` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '62011 11 2025 0 03126',
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'razakatiana.antenaina@yahoo.com',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '+261 34 54 038 98',
  `website` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://m-itlevelup.com/',
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Lot : D79 Soalazaina Ambatolampy',
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Antananarivo 102',
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Madagascar',
  `defaultVatRate` double NOT NULL DEFAULT '0',
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ar',
  `invoicePrefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FAC-2026-',
  `proformaPrefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRO-2026-',
  `contractPrefix` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CTR-2026-',
  `termsAndConditions` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_settings`
--

LOCK TABLES `company_settings` WRITE;
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
INSERT INTO `company_settings` VALUES ('cmucfswpj00009dqkgz27315l','M-It LevelUp','Miora Antenaina RAZAKATIANA','5019189714','62011 11 2025 0 03126','razakatiana.antenaina@yahoo.com','+261 34 54 038 98','https://m-itlevelup.com/','Lot : Andoharanofotsy','Antananarivo 102','Madagascar',0,'Ar','FAC-2026-','PRO-2026-','CTR-2026-','TVA non applicable – entreprise non assujettie à la TVA. Règlement par virement bancaire ou Mobile Money (MVola / Orange Money). Validité de l\'offre : 30 jours.','2026-09-22 08:53:37.303','2026-09-22 13:34:04.358');
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `contacts_clientId_fkey` (`clientId`),
  CONSTRAINT `contacts_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_templates`
--

DROP TABLE IF EXISTS `contract_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_templates` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` text COLLATE utf8mb4_unicode_ci,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_templates`
--

LOCK TABLES `contract_templates` WRITE;
/*!40000 ALTER TABLE `contract_templates` DISABLE KEYS */;
INSERT INTO `contract_templates` VALUES ('cmucfswtl000c9dqkk3ucatrx','Contrat de Conception de Site Internet','SITE_WEB','ENTRE LES SOUSSIGNÉS :\nL\'agence M-It LevelUp, représentée par Miora Antenaina RAZAKATIANA, NIF 5019189714, STAT 62011 11 2025 0 03126, sise à Lot D79 Soalazaina Ambatolampy, Antananarivo 102 Madagascar.\nET :\nLe Client {{client_name}}, représentant la société {{company_name}}.\n\nARTICLE 1 — OBJET DU CONTRAT\nLe présent contrat a pour objet la conception, le développement et la mise en ligne du projet : {{project_name}}.\n\nARTICLE 2 — PRESTATIONS INCLUSES\n- Conception graphique et interface UI/UX moderne et responsive.\n- Développement technique selon les standards du web actuel.\n- Configuration du nom de domaine et de l\'hébergement serveur.\n- Période de garantie et corrections de 30 jours après livraison.\n\nARTICLE 3 — CONDITIONS FINANCIÈRES\nLe montant total de la prestation s\'élève à {{amount}} Ariary.\nModalités de paiement :\n- Acompte de démarrage : {{deposit_amount}} Ariary (50%) à la signature du contrat.\n- Reste dû à la livraison : {{remainder_amount}} Ariary (50%).\nTVA non applicable – entreprise non assujettie à la TVA.\n\nARTICLE 4 — DÉLAIS D\'EXÉCUTION\nLe délai prévisionnel de livraison est fixé au {{delivery_date}}.','{{client_name}}, {{company_name}}, {{project_name}}, {{amount}}, {{deposit_amount}}, {{remainder_amount}}, {{delivery_date}}',1,'2026-09-22 08:53:37.450'),('cmucfswtl000d9dqk9ekqp2pk','Contrat de Développement Application Web','APPLICATION_WEB','CONTRAT DE DÉVELOPPEMENT D\'APPLICATION WEB SUR-MESURE\nPrestataire : M-It LevelUp (Miora Antenaina RAZAKATIANA)\nClient : {{client_name}} ({{company_name}})\n\nProjet : {{project_name}}\nMontant global : {{amount}} Ar\nAcompte : {{deposit_amount}} Ar\nReste à payer : {{remainder_amount}} Ar\nLivraison : {{delivery_date}}\n\nArchitecture technique complète, gestion des rôles, tableau de bord, base de données MySQL et sécurisation des API.','{{client_name}}, {{company_name}}, {{project_name}}, {{amount}}, {{deposit_amount}}, {{remainder_amount}}, {{delivery_date}}',1,'2026-09-22 08:53:37.450'),('cmucfswtl000e9dqkvltq3x9d','Contrat d\'Hébergement & Maintenance Annuelle','MAINTENANCE','CONTRAT D\'HÉBERGEMENT CLOUD ET DE MAINTENANCE ANNUELLE\nPrestataire : M-It LevelUp\nClient : {{client_name}} - {{company_name}}\nDomaine couvert : {{domain_name}}\nMontant annuel : {{amount}} Ar\nGarantie de temps de fonctionnement, sauvegardes automatiques hebdomadaires et mises à jour de sécurité.','{{client_name}}, {{company_name}}, {{domain_name}}, {{amount}}',1,'2026-09-22 08:53:37.450');
/*!40000 ALTER TABLE `contract_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalAmount` double NOT NULL,
  `depositAmount` double NOT NULL,
  `remainderAmount` double NOT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `deliveryDate` datetime(3) DEFAULT NULL,
  `status` enum('BROUILLON','EN_ATTENTE_SIGNATURE','SIGNE','RESILIE','TERMINE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `signToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signedAt` datetime(3) DEFAULT NULL,
  `signerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signerIp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signatureHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signatureDataUrl` longtext COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contracts_contractNumber_key` (`contractNumber`),
  UNIQUE KEY `contracts_signToken_key` (`signToken`),
  KEY `contracts_clientId_fkey` (`clientId`),
  KEY `contracts_projectId_fkey` (`projectId`),
  KEY `contracts_templateId_fkey` (`templateId`),
  CONSTRAINT `contracts_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `contracts_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `contracts_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `contract_templates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES ('cmucfswuh000z9dqk6yxfisot','CTR-2026-0001','Contrat de Développement Web — Mpanorina Nofy','cmucfswtt000k9dqkxh0qg9xn','cmucfswu9000t9dqki9tbijha',NULL,'Contrat officiel de prestation digitale entre M-It LevelUp et Mpanorina Nofy.',2700000,1350000,1350000,'2026-09-08 00:00:00.000','2026-10-15 00:00:00.000','SIGNE','904884b3-fe70-4ac9-9454-8698765f9059','2026-09-07 14:32:00.000','Mpanorina Nofy (Direction)','102.16.24.89','CCE77EA165994C947265FBA93E','data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==','2026-09-22 08:53:37.481','2026-09-22 08:53:37.481'),('cmucgfma4000e9d3gbwx0kzb0','CTR-2026-0002','Contrat de prestation — Développement Portail Digital Tech Hub','cmucgfm8v00069d3g0gi0t107','cmucgfm9n000a9d3gm1lqfhyq','cmucfswtl000c9dqkk3ucatrx','ENTRE LES SOUSSIGNÉS :\nL\'agence M-It LevelUp, représentée par Miora Antenaina RAZAKATIANA, NIF 5019189714, STAT 62011 11 2025 0 03126, sise à Lot D79 Soalazaina Ambatolampy, Antananarivo 102 Madagascar.\nET :\nLe Client Rado Rakotomalala, représentant la société Antananarivo Tech Hub.\n\nARTICLE 1 — OBJET DU CONTRAT\nLe présent contrat a pour objet la conception, le développement et la mise en ligne du projet : Développement Portail Digital Tech Hub.\n\nARTICLE 2 — PRESTATIONS INCLUSES\n- Conception graphique et interface UI/UX moderne et responsive.\n- Développement technique selon les standards du web actuel.\n- Configuration du nom de domaine et de l\'hébergement serveur.\n- Période de garantie et corrections de 30 jours après livraison.\n\nARTICLE 3 — CONDITIONS FINANCIÈRES\nLe montant total de la prestation s\'élève à 3 500 000 Ariary.\nModalités de paiement :\n- Acompte de démarrage : 1 750 000 Ariary (50%) à la signature du contrat.\n- Reste dû à la livraison : 1 750 000 Ariary (50%).\nTVA non applicable – entreprise non assujettie à la TVA.\n\nARTICLE 4 — DÉLAIS D\'EXÉCUTION\nLe délai prévisionnel de livraison est fixé au 30 jours après réception de l\'acompte.',3500000,1750000,1750000,NULL,NULL,'SIGNE','b139723d-3ce9-4b81-a536-d0a5f95d826a','2026-09-22 09:11:16.983','Rado Rakotomalala','::1','B1C4F9C24DD0914B0423126788A14B69E9461CFC36DDFD5278913E89CBD6B60F','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==','2026-09-22 09:11:16.875','2026-09-22 09:11:16.984'),('cmucn1pan000b9dpowbwfhcgz','CTR-2026-0003','Contrat de Création de Site Internet','cmucmq30200009dpo6blszqmc',NULL,'cmucfswtl000e9dqkvltq3x9d','CONTRAT D\'HÉBERGEMENT CLOUD ET DE MAINTENANCE ANNUELLE\nPrestataire : M-It LevelUp\nClient : Miora Antenaina - M-It LevelUp\nDomaine couvert : {{domain_name}}\nMontant annuel : 2 700 000 Ar\nGarantie de temps de fonctionnement, sauvegardes automatiques hebdomadaires et mises à jour de sécurité.',2700000,1350000,1350000,'2026-09-22 12:16:24.909',NULL,'EN_ATTENTE_SIGNATURE','bb85bc25-b8df-4944-9f45-2162602c18d1',NULL,NULL,NULL,NULL,NULL,'2026-09-22 12:16:24.911','2026-09-22 12:16:24.911');
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('OFFRE','PROFORMA','FACTURE','CONTRAT','RECU','FICHIER_CLIENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'application/pdf',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `documents_clientId_fkey` (`clientId`),
  CONSTRAINT `documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domains` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domainName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extension` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '.com',
  `registrar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Namecheap / Hostinger',
  `purchaseDate` datetime(3) NOT NULL,
  `expirationDate` datetime(3) NOT NULL,
  `costPrice` double NOT NULL DEFAULT '60000',
  `sellingPrice` double NOT NULL DEFAULT '300000',
  `status` enum('ACTIF','EXPIRE_BIENTOT','EXPIRE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIF',
  `autoRenew` tinyint(1) NOT NULL DEFAULT '1',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `domains_clientId_fkey` (`clientId`),
  CONSTRAINT `domains_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES ('cmucfswun00119dqkqomvw5y5','cmucfswtt000k9dqkxh0qg9xn','www.mpanorinanofy.com','.com','Hostinger International','2026-09-05 00:00:00.000','2027-09-05 00:00:00.000',65000,300000,'ACTIF',1,NULL,'2026-09-22 08:53:37.488','2026-09-22 08:53:37.488'),('cmucfswv8001c9dqkrhu53uu6','cmucfswuw00149dqkfynwjrta','www.hasina-tours.mg','.mg','NIC-MG','2025-10-10 00:00:00.000','2026-10-10 08:53:37.507',85000,350000,'EXPIRE_BIENTOT',0,NULL,'2026-09-22 08:53:37.509','2026-09-22 08:53:37.509');
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('HEBERGEMENT','DOMAINE','LOGICIELS','PUBLICITE','MATERIEL','SALAIRES','TRANSPORT','AUTRE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `supplier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceRef` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiptUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES ('cmucfswx200269dqkwc9j88vv','HEBERGEMENT',360000,'2026-08-01 00:00:00.000','Hostinger International','HOST-INV-2026-08',NULL,'Abonnement VPS Cloud Entreprise pour les applications clients','2026-09-22 08:53:37.575'),('cmucfswx200279dqklezw1nft','DOMAINE',195000,'2026-08-10 00:00:00.000','Namecheap Inc.','NC-RENEW-8821',NULL,'Renouvellement groupé de noms de domaine clients','2026-09-22 08:53:37.575'),('cmucfswx200289dqkkr13lhlm','LOGICIELS',120000,'2026-08-15 00:00:00.000','Canva Pro & GitHub Team','SOFT-2026-08',NULL,'Licences design et gestion du code source','2026-09-22 08:53:37.575'),('cmucfswx200299dqk9w5a91fb','PUBLICITE',250000,'2026-08-25 00:00:00.000','Meta Ads / Facebook','FB-ADS-202608',NULL,'Campagnes sponsorisées acquisition prospects à Madagascar','2026-09-22 08:53:37.575'),('cmucfswx2002a9dqk7aaym247','TRANSPORT',80000,'2026-09-04 00:00:00.000','Carburant & Déplacements','TRP-2026-09',NULL,'Rendez-vous clients en ville (Ankorondrano, Analakely)','2026-09-22 08:53:37.575');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostings`
--

DROP TABLE IF EXISTS `hostings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domainName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Hostinger Cloud',
  `plan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Cloud Startup / VPS',
  `startDate` datetime(3) NOT NULL,
  `expirationDate` datetime(3) NOT NULL,
  `costPrice` double NOT NULL DEFAULT '120000',
  `sellingPrice` double NOT NULL DEFAULT '300000',
  `margin` double NOT NULL DEFAULT '180000',
  `status` enum('ACTIF','EXPIRE_BIENTOT','EXPIRE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIF',
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hostings_clientId_fkey` (`clientId`),
  CONSTRAINT `hostings_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostings`
--

LOCK TABLES `hostings` WRITE;
/*!40000 ALTER TABLE `hostings` DISABLE KEYS */;
INSERT INTO `hostings` VALUES ('cmucfswur00139dqk8udhd7qh','cmucfswtt000k9dqkxh0qg9xn','www.mpanorinanofy.com','Hostinger Cloud','Cloud Startup NVMe','2026-09-05 00:00:00.000','2027-09-05 00:00:00.000',120000,300000,180000,'ACTIF',NULL,'2026-09-22 08:53:37.492','2026-09-22 08:53:37.492'),('cmucfswvc001e9dqksrxocrdj','cmucfswuw00149dqkfynwjrta','www.hasina-tours.mg','Hostinger Cloud','Cloud Professional','2025-10-10 00:00:00.000','2026-10-10 08:53:37.507',140000,350000,210000,'EXPIRE_BIENTOT',NULL,'2026-09-22 08:53:37.512','2026-09-22 08:53:37.512');
/*!40000 ALTER TABLE `hostings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unitPrice` double NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_items_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `invoice_items_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
INSERT INTO `invoice_items` VALUES ('cmucfswtz000n9dqkmu76bvut','cmucfswtz000m9dqkpes5g6yr','Nom de domaine: www.mpanorinanofy.com\nOffre annuelle',1,300000,300000),('cmucfswtz000o9dqkcke80fx4','cmucfswtz000m9dqkpes5g6yr','Hébèrgement de l\'application\nOffre annuelle',1,300000,300000),('cmucfswtz000p9dqkm8g0dmxz','cmucfswtz000m9dqkpes5g6yr','50% Avance → Développement application web : Architecture technique complète (UX/UI, Frontend, Backend, Base de données), Gestion tableaux de bord, Rapports, documents, notifications et messagerie Conception site internet interface Moderne et cinematique( Fonctionnalité , design, SEO), responsive(Desktop, Mobile et Tablette).',1,1350000,1350000),('cmucfswv000179dqkkqm8krby','cmucfswuz00169dqk23y38e2o','Conception Site Web Agence de Tourisme Multilingue (Français, Anglais)',1,1800000,1800000),('cmucfswv000189dqkowh8tf3t','cmucfswuz00169dqk23y38e2o','Module de réservation en ligne & fiches circuits personnalisées',1,600000,600000),('cmucfswvj001i9dqkz2vi1cqq','cmucfswvj001h9dqkqwgh2xpo','Création Boutique en Ligne E-Commerce Tunic (Prêt-à-porter)',1,1850000,1850000),('cmucfswvv001o9dqkf0o6dmr9','cmucfswvv001n9dqkt0hrak87','Module Click & Collect et Menu Digital QR Code',1,650000,650000),('cmucgfmac000h9d3gyqj40k42','cmucgfmac000g9d3glas5pw3y','Architecture application web et dashboard Next.js',1,3000000,3000000),('cmucgfmac000i9d3g7h0ugqgn','cmucgfmac000g9d3glas5pw3y','Nom de domaine .mg et hébergement infogéré',1,500000,500000);
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `baseNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('STANDARD','ACOMPTE','SOLDE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STANDARD',
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dueDate` datetime(3) NOT NULL,
  `subtotal` double NOT NULL,
  `vatRate` double NOT NULL DEFAULT '0',
  `vatAmount` double NOT NULL DEFAULT '0',
  `total` double NOT NULL,
  `depositPercent` double NOT NULL DEFAULT '50',
  `depositAmount` double NOT NULL,
  `remainingAmount` double NOT NULL,
  `amountInWords` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('BROUILLON','ENVOYEE','PARTIELLEMENT_PAYEE','PAYEE','EN_RETARD','ANNULEE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `paymentTerms` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `signatureMiora` tinyint(1) NOT NULL DEFAULT '1',
  `signatureClient` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoices_invoiceNumber_key` (`invoiceNumber`),
  KEY `invoices_clientId_fkey` (`clientId`),
  CONSTRAINT `invoices_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES ('cmucfswtz000m9dqkpes5g6yr','FAC-2026-0001','MPN1056233','cmucfswtt000k9dqkxh0qg9xn','ACOMPTE','2026-09-05 00:00:00.000','2026-09-20 00:00:00.000',1950000,0,0,1950000,50,1350000,1350000,'un million neuf cent cinquante mille Ariary','PARTIELLEMENT_PAYEE','Reste à payer : 50% de somme : 1 350 000 Ar à la livraison finale.','Agence de développement de site / application web. Lot : D79 Soalazaina Ambatolampy Antananarivo 102 Madagascar',1,1,'2026-09-22 08:53:37.463','2026-09-22 08:53:37.463','Ar'),('cmucfswuz00169dqk23y38e2o','FAC-2026-0002','HMT20260715','cmucfswuw00149dqkfynwjrta','STANDARD','2026-07-20 00:00:00.000','2026-08-05 00:00:00.000',2400000,0,0,2400000,100,2400000,0,'deux millions quatre cent mille Ariary','PAYEE','Paiement 100% effectué par virement bancaire BNI Madagascar.','Site vitrine multilingue et système de réservation de circuits avec paiement sécurisé.',1,1,'2026-09-22 08:53:37.500','2026-09-22 08:53:37.500','Ar'),('cmucfswvj001h9dqkqwgh2xpo','FAC-2026-0003','TNC20260902','cmucfswvf001f9dqkrsjhuelh','ACOMPTE','2026-09-02 00:00:00.000','2026-09-17 00:00:00.000',1850000,0,0,1850000,50,925000,925000,'un million huit cent cinquante mille Ariary','PARTIELLEMENT_PAYEE','Acompte de 50% payé par Orange Money. Reste 925 000 Ar à la livraison.',NULL,1,0,'2026-09-22 08:53:37.519','2026-09-22 08:53:37.519','Ar'),('cmucfswvv001n9dqkt0hrak87','FAC-2026-0004','PZF10293','cmucfswvr001l9dqkvqgsv5ys','SOLDE','2026-08-20 00:00:00.000','2026-09-05 00:00:00.000',650000,0,0,650000,100,650000,650000,'six cent cinquante mille Ariary','EN_RETARD','Solde final pour le module de commande en ligne QR code.',NULL,1,0,'2026-09-22 08:53:37.531','2026-09-22 08:53:37.531','Ar'),('cmucgfmac000g9d3glas5pw3y','FAC-2026-0005',NULL,'cmucgfm8v00069d3g0gi0t107','ACOMPTE','2026-09-22 09:11:16.883','2026-10-07 09:11:16.882',3500000,0,0,3500000,50,1750000,0,NULL,'PAYEE','Acompte de 50% requis au démarrage. Reste dû à la livraison : 1 750 000 Ar.',NULL,1,0,'2026-09-22 09:11:16.884','2026-09-22 09:11:17.044','Ar');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_templates`
--

DROP TABLE IF EXISTS `message_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_templates` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WHATSAPP',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_templates_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_templates`
--

LOCK TABLES `message_templates` WRITE;
/*!40000 ALTER TABLE `message_templates` DISABLE KEYS */;
INSERT INTO `message_templates` VALUES ('cmucfswtp000f9dqkibtrjfhp','WHATSAPP_OFFER','Proposition commerciale',NULL,'Bonjour {{name}},\n\nNous avons le plaisir de vous transmettre notre proposition commerciale concernant le projet *{{project}}*.\n\nVous pouvez consulter votre offre détaillée directement sur ce lien :\n{{link}}\n\nNous restons à votre entière disposition pour tout échange ou précision.\n\nCordialement,\n*Miora Antenaina RAZAKATIANA*\n*M-It LevelUp* — Agence Digitale\n📞 +261 34 54 038 98 | 🌐 https://m-itlevelup.com/','WHATSAPP','2026-09-22 08:53:37.453','2026-09-22 13:40:17.317'),('cmucfswtp000g9dqk283wmrxm','WHATSAPP_INVOICE','Envoi de facture',NULL,'Bonjour {{name}},\n\nVeuillez trouver ci-joint votre facture *{{invoice_number}}* d\'un montant de *{{amount}}*.\n\nAcompte / montant attendu : *{{due_amount}}*.\nRèglement possible par MVola (+261 34 54 038 98) ou virement bancaire.\n\nLien de consultation sécurisé :\n{{link}}\n\nMerci pour votre confiance !\n*M-It LevelUp*','WHATSAPP','2026-09-22 08:53:37.453','2026-09-23 12:58:30.930'),('cmucfswtp000h9dqkvzfvm6n4','WHATSAPP_CONTRACT','Contrat à signer',NULL,'Bonjour {{name}},\n\nLe contrat pour le projet *{{project}}* est prêt pour signature électronique.\nVous pouvez le signer en quelques secondes depuis votre téléphone ou ordinateur ici :\n{{link}}\n\nBien cordialement,\n*M-It LevelUp*','WHATSAPP','2026-09-22 08:53:37.453','2026-09-22 08:53:37.453'),('cmucfswtp000i9dqk370c88zd','WHATSAPP_RENEWAL','Renouvellement Domaine / Hébergement',NULL,'Bonjour {{name}},\n\nVotre hébergement et/ou nom de domaine *{{domain}}* arrive à échéance le *{{date}}*.\nNous vous proposons son renouvellement pour un montant de *{{amount}}*.\n\nSouhaitez-vous que nous procédions au renouvellement ?\nNous restons à votre écoute.\n\nBien cordialement,\n*M-It LevelUp*','WHATSAPP','2026-09-22 08:53:37.453','2026-09-23 12:58:30.949'),('cmucfswtp000j9dqkfkdhikg6','WHATSAPP_REMINDER','Relance facture impayée',NULL,'Bonjour {{name}},\n\nSauf erreur de notre part, la facture *{{invoice_number}}* d\'un montant restant de *{{remainder}}* arrivée à échéance le {{date}} est toujours en attente de règlement.\n\nPourriez-vous nous confirmer l\'état de votre règlement s\'il vous plaît ?\nConsulter la facture : {{link}}\n\nMerci pour votre collaboration,\n*M-It LevelUp*','WHATSAPP','2026-09-22 08:53:37.453','2026-09-23 12:58:30.953');
/*!40000 ALTER TABLE `message_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('SIGNATURE','FACTURE','PAIEMENT','RETARD','EXPIRATION','OFFRE','TACHE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_userId_fkey` (`userId`),
  CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('cmucfswx6002b9dqkkje0menk','cmucfswsq00019dqk6kiq7jzm','Nouvelle signature électronique','Mpanorina Nofy a signé le contrat CTR-2026-0001 avec succès.','SIGNATURE','/contracts',1,'2026-09-22 08:53:37.578'),('cmucfswx6002c9dqkgys7g9e4','cmucfswsq00019dqk6kiq7jzm','Acompte reçu de 1 350 000 Ar','Paiement MVola enregistré pour la facture FAC-2026-0001 (Mpanorina Nofy).','PAIEMENT','/payments',1,'2026-09-22 08:53:37.578'),('cmucfswx6002d9dqkl957ront','cmucfswsq00019dqk6kiq7jzm','Facture en retard','La facture FAC-2026-0004 de Pizza Factory (650 000 Ar) est échue.','RETARD','/invoices',1,'2026-09-22 08:53:37.578'),('cmucfswx6002e9dqkamn7xymr','cmucfswsq00019dqk6kiq7jzm','Domaine arrive à expiration','Le domaine hasina-tours.mg expire dans 18 jours. Tâche de relance créée.','EXPIRATION','/domains',1,'2026-09-22 08:53:37.578'),('cmucgfmaj000j9d3gk3txcs67',NULL,'Nouvelle opportunité gagnée ! 🎉','L\'offre OFF-2026-0001 (Développement Portail Digital Tech Hub) a été acceptée. Projet PRJ-2026-0002 et Facture FAC-2026-0005 créés.','OFFRE','/projects',1,'2026-09-22 09:11:16.891'),('cmucgfmdw000m9d3gsmwkb3si',NULL,'Contrat signé électroniquement ✍️','Rado Rakotomalala a signé le contrat CTR-2026-0002 (Contrat de prestation — Développement Portail Digital Tech Hub).','SIGNATURE','/contracts',1,'2026-09-22 09:11:17.012'),('cmucgfmey000r9d3gso2zkdc8',NULL,'Paiement reçu 💳','Paiement de 1 750 000 Ar enregistré pour la facture FAC-2026-0005.','PAIEMENT','/invoices',1,'2026-09-22 09:11:17.050'),('cmucpc66k00009dbg6fyf611s',NULL,'Nouveau devis proforma consulté','Le client Mpanorina Nofy a consulté la proforma PRO-2026-0001.','OFFRE','/proformas/cmucgj25j000v9d3g02zrue28',1,'2026-09-22 13:20:32.588'),('cmucpc66k00019dbghjakb0xf',NULL,'Contrat prêt pour signature','Le contrat CTR-2026-0001 est en attente.','SIGNATURE','/contracts',1,'2026-09-22 13:20:32.588'),('cmucpc66k00029dbg6hv8ocac',NULL,'Encaissement Mobile Money reçu','Paiement MVola de 1 350 000 Ar enregistré.','PAIEMENT','/payments',1,'2026-09-22 13:20:32.588'),('cmucpicth00009d2cmf4b5hai',NULL,'Nouvelle signature électronique','Mpanorina Nofy a signé le contrat CTR-2026-0001.','SIGNATURE','/contracts',1,'2026-09-22 13:25:21.125'),('cmucpicth00019d2c6lnp8b79',NULL,'Acompte reçu de 1 350 000 Ar','Paiement MVola enregistré pour la facture FAC-2026-0001.','PAIEMENT','/payments',1,'2026-09-22 13:25:21.125');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_catalogs`
--

DROP TABLE IF EXISTS `offer_catalogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_catalogs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `basePrice` double NOT NULL,
  `duration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `included` text COLLATE utf8mb4_unicode_ci,
  `options` text COLLATE utf8mb4_unicode_ci,
  `conditions` text COLLATE utf8mb4_unicode_ci,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ar',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_catalogs`
--

LOCK TABLES `offer_catalogs` WRITE;
/*!40000 ALTER TABLE `offer_catalogs` DISABLE KEYS */;
INSERT INTO `offer_catalogs` VALUES ('cmucfswth00059dqkapd2bald','Création Site Vitrine Professionnel','Site vitrine moderne, responsive, optimisé SEO avec page de contact, présentation des services et galerie.','Web',950000,'2 à 3 semaines','Design sur mesure, responsive mobile/tablette, SEO de base, formulaire de contact, intégration WhatsApp.','Blog (+200 000 Ar), Multilingue (+300 000 Ar).','Acompte 50% au lancement, 50% à la livraison.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth00069dqkg5qf2fz4','Création Site E-commerce / Boutique en Ligne','Plateforme de vente en ligne complète avec panier, gestion des stocks, passerelles de paiement (MVola, carte) et interface d\'administration.','E-Commerce',1850000,'4 à 6 semaines','Catalogue produits illimité, passerelle de paiement local/international, gestion des commandes et factures, notifications.','Application mobile e-commerce (+1 500 000 Ar).','Acompte 50%, solde avant mise en production.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth00079dqkptj8bynq','Développement Application Web Sur-Mesure','Architecture technique complète (UX/UI, Frontend, Backend, Base de données), gestion tableaux de bord, rapports, documents, notifications.','Logiciel Métier',2700000,'6 à 8 semaines','UX/UI design moderne, Frontend Next.js/React, Backend API sécurisé, base de données optimisée, rôles utilisateurs RBAC.','Module IA générative (+800 000 Ar), synchronisation API tierce (+500 000 Ar).','50% à la commande, 50% à la livraison.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth00089dqkqg3jc086','Développement Application Mobile (iOS & Android)','Application mobile native ou hybride réactive avec synchronisation temps réel, notifications push et mode hors-ligne.','Mobile',3500000,'8 à 10 semaines','Publication Google Play Store & Apple App Store, backend API, authentification, notifications push.','Support tablette (+500 000 Ar).','40% à la signature, 30% à mi-parcours, 30% à la validation.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth00099dqko0mfag8t','Hébergement Cloud Haute Performance & Sécurité','Hébergement cloud infogéré avec sauvegardes quotidiennes, certificat SSL gratuit et surveillance 24/7.','Infrastructure',300000,'1 an (renouvelable)','Serveur NVMe ultra-rapide, SSL Let\'s Encrypt, backups automatiques, bande passante illimitée.','IP dédiée (+150 000 Ar/an).','Facturation annuelle d\'avance.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth000a9dqkwjle91oz','Enregistrement & Gestion Nom de Domaine','Réservation de votre nom de domaine (.com, .mg, .net, .org) avec gestion DNS sécurisée et redirection.','Infrastructure',300000,'1 an (renouvelable)','Protection WHOIS, DNS Anycast rapide, support technique.','Domaine .mg officiel (+200 000 Ar).','Paiement 100% à la commande.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar'),('cmucfswth000b9dqktr8w1ali','Pack Digital Complet (Site + Hébergement + Domaine + SEO)','Solution tout-en-un clé en main pour propulser votre entreprise sur internet sans soucis techniques.','Pack',3200000,'4 semaines','Site internet cinématique, domaine offert 1 an, hébergement haute vitesse 1 an, audit & optimisation SEO.','Maintenance annuelle incluse (+600 000 Ar).','50% acompte, 50% solde.',1,'2026-09-22 08:53:37.445','2026-09-22 08:53:37.445','Ar');
/*!40000 ALTER TABLE `offer_catalogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_items`
--

DROP TABLE IF EXISTS `offer_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `offerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unitPrice` double NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `offer_items_offerId_fkey` (`offerId`),
  CONSTRAINT `offer_items_offerId_fkey` FOREIGN KEY (`offerId`) REFERENCES `offers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_items`
--

LOCK TABLES `offer_items` WRITE;
/*!40000 ALTER TABLE `offer_items` DISABLE KEYS */;
INSERT INTO `offer_items` VALUES ('cmucgfm8500049d3ghs0h9cbd','cmucgfm8400039d3gx4qdgu79','Architecture application web et dashboard Next.js',1,3000000,3000000),('cmucgfm8500059d3gj05o4zd1','cmucgfm8400039d3gx4qdgu79','Nom de domaine .mg et hébergement infogéré',1,500000,500000),('cmucmrayj00039dpomngyqdb5','cmucmrayi00029dpo3499sgu7','Conception et développement application web moderne avec dashboard',1,2700000,2700000),('cmucmrayj00049dpoxzfri902','cmucmrayi00029dpo3499sgu7','Enregistrement & Gestion Nom de Domaine\nRéservation de votre nom de domaine (.com, .mg, .net, .org) avec gestion DNS sécurisée et redirection.',1,300000,300000),('cmucmrayj00059dpopaa5013r','cmucmrayi00029dpo3499sgu7','Pack Digital Complet (Site + Hébergement + Domaine + SEO)\nSolution tout-en-un clé en main pour propulser votre entreprise sur internet sans soucis techniques.',1,3200000,3200000),('cmue42mow000c9dogzfxvtrck','cmue42mow000b9dogwzwel8zy','Conception / Développement site internet JD-Services Automobile: Architecture complète, fonctionnalité, design, SEO, Version: Desktop/Tablette/Mobile.  Déploiement en ligne',1,175,175);
/*!40000 ALTER TABLE `offer_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `offerNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prospectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('BROUILLON','ENVOYEE','ACCEPTEE','REFUSEE','EXPIREE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `subtotal` double NOT NULL,
  `discount` double NOT NULL DEFAULT '0',
  `total` double NOT NULL,
  `depositPercent` double NOT NULL DEFAULT '50',
  `depositAmount` double NOT NULL,
  `remainderAmount` double NOT NULL,
  `validityDate` datetime(3) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `terms` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `offers_offerNumber_key` (`offerNumber`),
  KEY `offers_prospectId_fkey` (`prospectId`),
  KEY `offers_clientId_fkey` (`clientId`),
  CONSTRAINT `offers_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `offers_prospectId_fkey` FOREIGN KEY (`prospectId`) REFERENCES `prospects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES ('cmucgfm8400039d3gx4qdgu79','OFF-2026-0001','Développement Portail Digital Tech Hub','cmucgfm7900019d3g923wtr40','cmucgfm8v00069d3g0gi0t107','ACCEPTEE',3500000,0,3500000,50,1750000,1750000,'2026-10-22 09:11:16.803',NULL,'TVA non applicable – entreprise non assujettie à la TVA. Offre valable 30 jours.','2026-09-22 09:11:16.805','2026-09-22 09:11:16.838','Ar'),('cmucmrayi00029dpo3499sgu7','OFF-2026-0002','Proposition Commerciale Digitale',NULL,'cmucmq30200009dpo6blszqmc','ENVOYEE',6200000,0,6200000,50,3100000,3100000,'2026-10-22 12:08:19.765',NULL,'TVA non applicable – entreprise non assujettie à la TVA. Offre valable 30 jours.','2026-09-22 12:08:19.770','2026-09-22 12:08:19.770','Ar'),('cmue42mow000b9dogwzwel8zy','OFF-2026-0003','Développement Site internet',NULL,'cmue3z0fw00009dog0r3co8mx','ENVOYEE',175,0,175,50,87.5,87.5,'2026-10-23 13:00:47.836',NULL,'TVA non applicable – entreprise non assujettie à la TVA. Offre valable 30 jours.','2026-09-23 13:00:47.840','2026-09-23 13:00:47.840','EUR');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `method` enum('ESPECES','VIREMENT_BANCAIRE','MVOLA','ORANGE_MONEY','AIRTEL_MONEY','CHEQUE','AUTRE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MVOLA',
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_paymentNumber_key` (`paymentNumber`),
  KEY `payments_invoiceId_fkey` (`invoiceId`),
  KEY `payments_clientId_fkey` (`clientId`),
  CONSTRAINT `payments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `payments_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('cmucfswu5000r9dqk67uynenu','PAI-2026-0001','cmucfswtz000m9dqkpes5g6yr','cmucfswtt000k9dqkxh0qg9xn',1350000,'2026-09-08 00:00:00.000','MVOLA','MVOLA-TX-98745213','Paiement 50% avance développement application web et hébergement annuel.','2026-09-22 08:53:37.469'),('cmucfswv4001a9dqkxd5ueze2','PAI-2026-0002','cmucfswuz00169dqk23y38e2o','cmucfswuw00149dqkfynwjrta',2400000,'2026-07-22 00:00:00.000','VIREMENT_BANCAIRE','BNI-VIR-45091238','Règlement solde total projet web tourisme.','2026-09-22 08:53:37.504'),('cmucfswvo001k9dqk38vuug16','PAI-2026-0003','cmucfswvj001h9dqkqwgh2xpo','cmucfswvf001f9dqkrsjhuelh',925000,'2026-09-03 00:00:00.000','ORANGE_MONEY','OM-2026-991823','Acompte 50% e-commerce Tunic','2026-09-22 08:53:37.524'),('cmucgfmeg000q9d3ga9p71gct','PAI-2026-0004','cmucgfmac000g9d3glas5pw3y','cmucgfm8v00069d3g0gi0t107',1750000,'2026-09-22 09:11:17.031','MVOLA','MVOLA-TEST-SUCCESS-992',NULL,'2026-09-22 09:11:17.032');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proforma_items`
--

DROP TABLE IF EXISTS `proforma_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proforma_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proformaId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unitPrice` double NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `proforma_items_proformaId_fkey` (`proformaId`),
  CONSTRAINT `proforma_items_proformaId_fkey` FOREIGN KEY (`proformaId`) REFERENCES `proformas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proforma_items`
--

LOCK TABLES `proforma_items` WRITE;
/*!40000 ALTER TABLE `proforma_items` DISABLE KEYS */;
INSERT INTO `proforma_items` VALUES ('cmucgj25j000w9d3grbk810yd','cmucgj25j000v9d3g02zrue28','Conception plateforme web sur-mesure & tableau de bord M-It LevelUp',1,2400000,2400000),('cmucgj25j000x9d3gvp7xz2ta','cmucgj25j000v9d3g02zrue28','Configuration domaine & hébergement cloud infogéré annuel',1,600000,600000),('cmucptz6b00009dfs3auhub37','cmucmsxw100079dporm1lfbeb','Conception plateforme web sur-mesure & tableau de bord M-It LevelUp',1,2400000,2400000),('cmucptz6c00019dfslg3g2h8v','cmucmsxw100079dporm1lfbeb','Configuration domaine & hébergement cloud infogéré annuel',1,600000,600000),('cmue4okl200009d58u60iycu2','cmue480ih000e9dog24zh1lxr','Conception / Développement site internet (JD-Services - Automobile) : Architecture, Fontionnalité,  Design, SEO, Version : Desktop/Tablette/Mobile.) et mise en ligne',1,170,170);
/*!40000 ALTER TABLE `proforma_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proformas`
--

DROP TABLE IF EXISTS `proformas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proformas` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proformaNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prospectId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `validityDate` datetime(3) DEFAULT NULL,
  `subtotal` double NOT NULL,
  `discount` double NOT NULL DEFAULT '0',
  `total` double NOT NULL,
  `depositPercent` double NOT NULL DEFAULT '50',
  `depositAmount` double NOT NULL,
  `remainderAmount` double NOT NULL,
  `conditions` text COLLATE utf8mb4_unicode_ci,
  `status` enum('BROUILLON','ENVOYEE','ACCEPTEE','CONVERTIE','ANNULEE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `proformas_proformaNumber_key` (`proformaNumber`),
  KEY `proformas_clientId_fkey` (`clientId`),
  KEY `proformas_prospectId_fkey` (`prospectId`),
  CONSTRAINT `proformas_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `proformas_prospectId_fkey` FOREIGN KEY (`prospectId`) REFERENCES `prospects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proformas`
--

LOCK TABLES `proformas` WRITE;
/*!40000 ALTER TABLE `proformas` DISABLE KEYS */;
INSERT INTO `proformas` VALUES ('cmucgj25j000v9d3g02zrue28','PRO-2026-0001','cmucfswtt000k9dqkxh0qg9xn',NULL,'2026-09-22 09:13:57.410','2026-10-22 09:13:57.410',3000000,0,3000000,50,1500000,1500000,'Facture Proforma valable 30 jours. TVA non applicable – entreprise non assujettie à la TVA. Acompte de 50% au lancement des développements.','ENVOYEE','2026-09-22 09:13:57.414','2026-09-22 13:20:53.217','Prestation garantie 12 mois avec assistance prioritaire 7j/7. Déploiement cloud haute disponibilité et sauvegarde hebdomadaire automatique inclus.','Ar'),('cmucmsxw100079dporm1lfbeb','PRO-2026-0002','cmucmq30200009dpo6blszqmc',NULL,'2026-09-22 12:09:36.141','2026-10-22 12:09:36.141',3000000,0,3000000,50,1500000,1500000,'Facture Proforma valable 30 jours. TVA non applicable – entreprise non assujettie à la TVA. Acompte de 50% au lancement des développements.','ENVOYEE','2026-09-22 12:09:36.144','2026-09-22 13:34:23.322','test','Ar'),('cmue480ih000e9dog24zh1lxr','PRO-2026-0003','cmue3z0fw00009dog0r3co8mx',NULL,'2026-09-23 13:04:59.032','2026-10-23 13:04:59.032',170,0,170,50,85,85,'Facture Proforma valable 30 jours. TVA non applicable – entreprise non assujettie à la TVA. Acompte de 50% au lancement des développements.','ENVOYEE','2026-09-23 13:04:59.033','2026-09-23 13:17:51.558','NB: Nom de domaine / Hébergement non inclus\nM-It LevelUp vous remercie pour votre confiance. ','EUR');
/*!40000 ALTER TABLE `proformas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `targetDeliveryDate` datetime(3) DEFAULT NULL,
  `actualDeliveryDate` datetime(3) DEFAULT NULL,
  `status` enum('A_DEMARRER','EN_PREPARATION','EN_DEVELOPPEMENT','EN_ATTENTE_CLIENT','CORRECTIONS','PRET_A_LIVRER','LIVRE','MAINTENANCE','TERMINE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A_DEMARRER',
  `managerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalAmount` double NOT NULL,
  `depositAmount` double NOT NULL DEFAULT '0',
  `remainderAmount` double NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_projectNumber_key` (`projectNumber`),
  KEY `projects_clientId_fkey` (`clientId`),
  KEY `projects_managerId_fkey` (`managerId`),
  CONSTRAINT `projects_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `projects_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('cmucfswu9000t9dqki9tbijha','PRJ-2026-0001','Application Web & Plateforme Numérique Mpanorina Nofy','cmucfswtt000k9dqkxh0qg9xn','Application Web / CRM','Architecture complète, tableaux de bord, gestion des adhérents, rapports et notifications.','2026-09-08 00:00:00.000','2026-10-15 00:00:00.000',NULL,'EN_DEVELOPPEMENT','cmucfswt900039dqkhs1mh33c',2700000,1350000,1350000,'2026-09-22 08:53:37.473','2026-09-22 08:53:37.473'),('cmucgfm9n000a9d3gm1lqfhyq','PRJ-2026-0002','Développement Portail Digital Tech Hub','cmucgfm8v00069d3g0gi0t107','Projet Web & Digital','Projet initié depuis l\'offre OFF-2026-0001','2026-09-22 09:11:16.858',NULL,NULL,'EN_PREPARATION',NULL,3500000,1750000,1750000,'2026-09-22 09:11:16.859','2026-09-22 09:11:17.006');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prospects`
--

DROP TABLE IF EXISTS `prospects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prospects` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Antananarivo',
  `sector` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `needType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estimatedBudget` double DEFAULT NULL,
  `status` enum('NOUVEAU','CONTACTE','INTERESSE','OFFRE_A_PREPARER','OFFRE_ENVOYEE','RELANCE','NEGOCIATION','GAGNE','PERDU') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NOUVEAU',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `assignedToId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `convertedClientId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prospects_assignedToId_fkey` (`assignedToId`),
  CONSTRAINT `prospects_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prospects`
--

LOCK TABLES `prospects` WRITE;
/*!40000 ALTER TABLE `prospects` DISABLE KEYS */;
INSERT INTO `prospects` VALUES ('cmucfswwf001v9dqkipb26a1y','Jean','Ratsimba','Madagascar Eco Lodge','+261 34 12 345 67','261341234567','jean.ratsimba@ecolodge.mg',NULL,'Antananarivo','Hôtellerie / Écotourisme','Recommandation client',NULL,NULL,NULL,NULL,'Site web réservation avec passerelle de paiement internationale',2800000,'NEGOCIATION','Très intéressé. A demandé une réduction sur l\'acompte de 50%. Relance prévue cette semaine.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.552','2026-09-22 08:53:37.552'),('cmucfswwk001x9dqkqfc4bbx2','Beby','Rasoa','Pharmacie de l\'Avenue','+261 33 22 111 44','261332211144','beby@pharmacie-avenue.mg',NULL,'Antananarivo','Santé / Pharmacie','Facebook Ads',NULL,NULL,NULL,NULL,'Application web de suivi des stocks et commande de médicaments de garde',3200000,'OFFRE_ENVOYEE','Offre envoyée via WhatsApp le 18 septembre. En attente de décision du gérant.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.556','2026-09-22 08:53:37.556'),('cmucfswwo001z9dqk24ni4ztx','Mamy','Andriambelo','Express Transports Mada','+261 34 66 777 88','261346677788','mamy@expresstransports.mg',NULL,'Antananarivo','Transport & Logistique','Prospection directe',NULL,NULL,NULL,NULL,'Système de suivi de flotte et facturation automatique',4500000,'OFFRE_A_PREPARER','Rendez-vous téléphonique effectué le 20 septembre. Préparer une offre sur-mesure.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.560','2026-09-22 08:53:37.560'),('cmucfswwr00219dqk49xuq7hw','Aina','Randriamampianina','Cabinet d\'Avocats LexMada','+261 32 11 999 88','261321199988','contact@lexmada.mg',NULL,'Antananarivo','Juridique','LinkedIn',NULL,NULL,NULL,NULL,'Site vitrine épuré et espace documentaire sécurisé pour les clients',1500000,'INTERESSE','A vu les réalisations M-It LevelUp sur LinkedIn. Veut une démo.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.564','2026-09-22 08:53:37.564'),('cmucfswwv00239dqk0r4ru4mi','Tahina','Razafy','Gourmet Bakery Antanimena','+261 34 44 222 11','261344422211','tahina@gourmetbakery.mg',NULL,'Antananarivo','Restauration / Boulangerie','Instagram',NULL,NULL,NULL,NULL,'Site catalogue gâteaux d\'anniversaire et commande en ligne',1200000,'RELANCE','Devis envoyé il y a 10 jours. À relancer sur WhatsApp aujourd\'hui.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.567','2026-09-22 08:53:37.567'),('cmucfswwz00259dqkytrxddoe','Hery','Rakotoarisoa','Mada Solar Energy','+261 34 88 123 99','261348812399','hery@madasolar.mg',NULL,'Antananarivo','Énergie solaire','Site web contact',NULL,NULL,NULL,NULL,'Générateur de devis solaire en ligne et site institutionnel',2200000,'NOUVEAU','Demande reçue hier soir via le formulaire contact de m-itlevelup.com.','cmucfswt600029dqks5zp8fjk',NULL,'2026-09-22 08:53:37.571','2026-09-22 08:53:37.571'),('cmucgfm7900019d3g923wtr40','Rado','Rakotomalala','Antananarivo Tech Hub','+261 34 99 111 22','261349911122','rado@techhub.mg',NULL,'Antananarivo',NULL,'Prospection',NULL,NULL,NULL,NULL,'Portail digital et application web',3500000,'GAGNE',NULL,NULL,'cmucgfm8v00069d3g0gi0t107','2026-09-22 09:11:16.762','2026-09-22 09:11:16.845');
/*!40000 ALTER TABLE `prospects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminders` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reminderDate` datetime(3) NOT NULL,
  `channel` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WHATSAPP',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signatures`
--

DROP TABLE IF EXISTS `signatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signatures` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signerName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signerRole` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `documentHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `signatureData` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `signedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `signatures_contractId_fkey` (`contractId`),
  KEY `signatures_invoiceId_fkey` (`invoiceId`),
  CONSTRAINT `signatures_contractId_fkey` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `signatures_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signatures`
--

LOCK TABLES `signatures` WRITE;
/*!40000 ALTER TABLE `signatures` DISABLE KEYS */;
INSERT INTO `signatures` VALUES ('cmucgfmdk000l9d3gjv07e1yh','cmucgfma4000e9d3gbwx0kzb0',NULL,'Rado Rakotomalala',NULL,'::1',NULL,'B1C4F9C24DD0914B0423126788A14B69E9461CFC36DDFD5278913E89CBD6B60F','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==','2026-09-22 09:11:16.983');
/*!40000 ALTER TABLE `signatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `assigneeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` enum('BASSE','NORMALE','IMPORTANTE','URGENTE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NORMALE',
  `status` enum('A_FAIRE','EN_COURS','EN_REVUE','TERMINE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A_FAIRE',
  `dueDate` datetime(3) DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_projectId_fkey` (`projectId`),
  KEY `tasks_assigneeId_fkey` (`assigneeId`),
  CONSTRAINT `tasks_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tasks_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('cmucfswud000u9dqkryiax8aw','cmucfswu9000t9dqki9tbijha','Maquettes UI/UX & validation client','Figma des tableaux de bord et de l\'interface mobile.','cmucfswt900039dqkhs1mh33c','IMPORTANTE','TERMINE','2026-09-15 00:00:00.000',0,'2026-09-22 08:53:37.478','2026-09-22 08:53:37.478'),('cmucfswud000v9dqk5u4z5kbu','cmucfswu9000t9dqki9tbijha','Développement Frontend Next.js & composants','Création des vues de gestion, filtres et intégration Tailwind.','cmucfswt900039dqkhs1mh33c','URGENTE','EN_COURS','2026-09-28 00:00:00.000',0,'2026-09-22 08:53:37.478','2026-09-22 08:53:37.478'),('cmucfswud000w9dqke8uhr9qn','cmucfswu9000t9dqki9tbijha','API Backend & Base de données MySQL','Routes d\'authentification, CRUD adhérents et génération de rapports.','cmucfswt900039dqkhs1mh33c','IMPORTANTE','EN_COURS','2026-10-02 00:00:00.000',0,'2026-09-22 08:53:37.478','2026-09-22 08:53:37.478'),('cmucfswud000x9dqk3nph4u3y','cmucfswu9000t9dqki9tbijha','Tests finaux & Recette utilisateur','Validation sur mobile et desktop avec le client.','cmucfswt900039dqkhs1mh33c','NORMALE','A_FAIRE','2026-10-12 00:00:00.000',0,'2026-09-22 08:53:37.478','2026-09-22 08:53:37.478'),('cmucgfm9s000c9d3gq0sf6fjn','cmucgfm9n000a9d3gm1lqfhyq','Cadrage et lancement du projet Développement Portail Digital Tech Hub','Prendre contact avec le client pour recueillir les contenus, logos et spécifications.',NULL,'URGENTE','A_FAIRE','2026-09-25 09:11:16.864',0,'2026-09-22 09:11:16.865','2026-09-22 09:11:16.865');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','COMMERCIAL','ACCOUNTANT','PROJECT_MANAGER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmucfswsq00019dqk6kiq7jzm','Miora Antenaina RAZAKATIANA','admin@m-itlevelup.com','$2a$10$xZXoUSyn7VOnHE6sExKoJufbkEyY5QELeAlZqw0OSBgmhr0b7SY1O','SUPER_ADMIN','+261 34 54 038 98',NULL,1,'2026-09-22 08:53:37.418','2026-09-22 08:53:37.418'),('cmucfswt600029dqks5zp8fjk','Sarah Ramanantsoa','sarah.commercial@m-itlevelup.com','$2a$10$xZXoUSyn7VOnHE6sExKoJufbkEyY5QELeAlZqw0OSBgmhr0b7SY1O','COMMERCIAL','+261 34 11 222 33',NULL,1,'2026-09-22 08:53:37.434','2026-09-22 08:53:37.434'),('cmucfswt900039dqkhs1mh33c','Faly Rakotondrabe','faly.dev@m-itlevelup.com','$2a$10$xZXoUSyn7VOnHE6sExKoJufbkEyY5QELeAlZqw0OSBgmhr0b7SY1O','PROJECT_MANAGER','+261 33 44 555 66',NULL,1,'2026-09-22 08:53:37.438','2026-09-22 08:53:37.438'),('cmucfswtc00049dqk388pdekd','Volana Randria','comptabilite@m-itlevelup.com','$2a$10$xZXoUSyn7VOnHE6sExKoJufbkEyY5QELeAlZqw0OSBgmhr0b7SY1O','ACCOUNTANT','+261 32 77 888 99',NULL,1,'2026-09-22 08:53:37.441','2026-09-22 08:53:37.441');
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

-- Dump completed on 2026-09-28  6:52:23

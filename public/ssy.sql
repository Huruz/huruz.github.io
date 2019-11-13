/*
Navicat MySQL Data Transfer

Source Server         : PROYECTO
Source Server Version : 50724
Source Host           : localhost:3306
Source Database       : ssy

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2019-09-29 17:51:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `inscripcion`
-- ----------------------------
DROP TABLE IF EXISTS `inscripcion`;
CREATE TABLE `inscripcion` (
  `idinscripcion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `institucion` varchar(45) DEFAULT NULL,
  `rfc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idinscripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of inscripcion
-- ----------------------------
INSERT INTO `inscripcion` VALUES ('1', 'Empty', 'Empty', 'Empty', 'ass');

-- ----------------------------
-- Table structure for `userlevelpermissions`
-- ----------------------------
DROP TABLE IF EXISTS `userlevelpermissions`;
CREATE TABLE `userlevelpermissions` (
  `userlevelid` int(11) NOT NULL,
  `tablename` varchar(255) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`tablename`,`userlevelid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of userlevelpermissions
-- ----------------------------
INSERT INTO `userlevelpermissions` VALUES ('-2', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}inscripcion', '0');
INSERT INTO `userlevelpermissions` VALUES ('3', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}inscripcion', '111');
INSERT INTO `userlevelpermissions` VALUES ('4', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}inscripcion', '111');
INSERT INTO `userlevelpermissions` VALUES ('-2', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevelpermissions', '0');
INSERT INTO `userlevelpermissions` VALUES ('3', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevelpermissions', '111');
INSERT INTO `userlevelpermissions` VALUES ('4', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevelpermissions', '0');
INSERT INTO `userlevelpermissions` VALUES ('-2', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevels', '0');
INSERT INTO `userlevelpermissions` VALUES ('3', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevels', '111');
INSERT INTO `userlevelpermissions` VALUES ('4', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}userlevels', '0');
INSERT INTO `userlevelpermissions` VALUES ('-2', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}usuarios', '0');
INSERT INTO `userlevelpermissions` VALUES ('3', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}usuarios', '111');
INSERT INTO `userlevelpermissions` VALUES ('4', '{7D17B05A-1E09-4241-BCB8-DFDB2802E5B9}usuarios', '0');

-- ----------------------------
-- Table structure for `userlevels`
-- ----------------------------
DROP TABLE IF EXISTS `userlevels`;
CREATE TABLE `userlevels` (
  `userlevelid` int(11) NOT NULL,
  `userlevelname` varchar(80) NOT NULL,
  PRIMARY KEY (`userlevelid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of userlevels
-- ----------------------------
INSERT INTO `userlevels` VALUES ('-2', 'Anonymous');
INSERT INTO `userlevels` VALUES ('-1', 'Administrator');
INSERT INTO `userlevels` VALUES ('1', 'Default');
INSERT INTO `userlevels` VALUES ('3', 'Sarec');
INSERT INTO `userlevels` VALUES ('4', 'Admin Evento');

-- ----------------------------
-- Table structure for `usuarios`
-- ----------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `idusuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nombrecompleto` varchar(45) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `contrasenia` varchar(45) NOT NULL,
  `userlevel_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idusuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usuarios
-- ----------------------------
INSERT INTO `usuarios` VALUES ('1', 'AuraMP', 'aura_princesitabella@hotmail.com', 'naruto', '3');
INSERT INTO `usuarios` VALUES ('2', 'AlbaRosa', 'aura.rmp00@gmail.com', 'naruto12', null);
INSERT INTO `usuarios` VALUES ('3', 'Admin1_00', 'notevoadecir', 'jornadassy', '4');

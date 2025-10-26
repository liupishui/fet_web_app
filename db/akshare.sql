/*
 Navicat Premium Data Transfer

 Source Server         : akshare
 Source Server Type    : SQLite
 Source Server Version : 3017000
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3017000
 File Encoding         : 65001

 Date: 26/10/2025 14:38:20
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for hist_daily
-- ----------------------------
DROP TABLE IF EXISTS "hist_daily";
CREATE TABLE "hist_daily" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "code" TEXT,
  "hist_daily" TEXT,
  "create_at" TEXT DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
  "updated_at" TEXT DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);

-- ----------------------------
-- Table structure for hist_lastday
-- ----------------------------
DROP TABLE IF EXISTS "hist_lastday";
CREATE TABLE "hist_lastday" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "code" TEXT,
  "日期" TEXT,
  "股票代码" TEXT,
  "开盘" real,
  "收盘" real,
  "最高" real,
  "最低" real,
  "成交量" integer,
  "成交额" integer,
  "振幅" real,
  "涨跌幅" real,
  "涨跌额" real,
  "换手率" real
);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

-- ----------------------------
-- Table structure for stock_info_a_code_name
-- ----------------------------
DROP TABLE IF EXISTS "stock_info_a_code_name";
CREATE TABLE "stock_info_a_code_name" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "code" text NOT NULL,
  "flag" TEXT,
  "name" TEXT,
  "pinyin" TEXT,
  "created_at" text DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
  "updated_at" integer DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
  "hist_daily" TEXT
);

-- ----------------------------
-- Auto increment value for hist_daily
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 12541 WHERE name = 'hist_daily';

-- ----------------------------
-- Auto increment value for hist_lastday
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 5414 WHERE name = 'hist_lastday';

-- ----------------------------
-- Auto increment value for stock_info_a_code_name
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 11075 WHERE name = 'stock_info_a_code_name';

PRAGMA foreign_keys = true;

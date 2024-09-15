/*
  Warnings:

  - Made the column `task` on table `todos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_complete` on table `todos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."todos" ALTER COLUMN "task" SET NOT NULL,
ALTER COLUMN "is_complete" SET NOT NULL,
ALTER COLUMN "inserted_at" SET DEFAULT CURRENT_TIMESTAMP;

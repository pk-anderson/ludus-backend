/*
  Warnings:

  - You are about to drop the `UserTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserTable";

-- CreateTable
CREATE TABLE "user_table" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_table_email_key" ON "user_table"("email");

/*
  Warnings:

  - You are about to drop the `ProxyToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProxyToken";

-- CreateTable
CREATE TABLE "proxy_keys" (
    "id" SERIAL NOT NULL,
    "access_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proxy_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proxy_keys_access_url_key" ON "proxy_keys"("access_url");

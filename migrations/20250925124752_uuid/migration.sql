/*
  Warnings:

  - The primary key for the `_DevicesToProxyKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `proxy_keys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `proxy_keys` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `proxy_keys` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."_DevicesToProxyKey" DROP CONSTRAINT "_DevicesToProxyKey_B_fkey";

-- AlterTable
ALTER TABLE "public"."_DevicesToProxyKey" DROP CONSTRAINT "_DevicesToProxyKey_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_DevicesToProxyKey_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "public"."proxy_keys" DROP CONSTRAINT "proxy_keys_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "proxy_keys_pkey" PRIMARY KEY ("uuid");
DROP SEQUENCE "proxy_keys_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "proxy_keys_id_key" ON "public"."proxy_keys"("id");

-- CreateIndex
CREATE INDEX "proxy_keys_id_idx" ON "public"."proxy_keys"("id");

-- AddForeignKey
ALTER TABLE "public"."_DevicesToProxyKey" ADD CONSTRAINT "_DevicesToProxyKey_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."proxy_keys"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

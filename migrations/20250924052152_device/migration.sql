-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DevicesToProxyKey" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DevicesToProxyKey_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_ip_key" ON "devices"("ip");

-- CreateIndex
CREATE INDEX "_DevicesToProxyKey_B_index" ON "_DevicesToProxyKey"("B");

-- AddForeignKey
ALTER TABLE "_DevicesToProxyKey" ADD CONSTRAINT "_DevicesToProxyKey_A_fkey" FOREIGN KEY ("A") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DevicesToProxyKey" ADD CONSTRAINT "_DevicesToProxyKey_B_fkey" FOREIGN KEY ("B") REFERENCES "proxy_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

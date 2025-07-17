-- AlterTable
ALTER TABLE "simulations" ALTER COLUMN "config" SET DEFAULT '{}';

-- CreateTable
CREATE TABLE "simulation_access" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_level" TEXT NOT NULL DEFAULT 'viewer',
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_access_request" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulation_access_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "simulation_access_simulation_id_user_id_key" ON "simulation_access"("simulation_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "simulation_access_request_simulation_id_requested_by_id_key" ON "simulation_access_request"("simulation_id", "requested_by_id");

-- AddForeignKey
ALTER TABLE "simulation_access" ADD CONSTRAINT "simulation_access_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_access" ADD CONSTRAINT "simulation_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_access_request" ADD CONSTRAINT "simulation_access_request_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_access_request" ADD CONSTRAINT "simulation_access_request_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

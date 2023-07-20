-- CreateEnum
CREATE TYPE "app_mode" AS ENUM ('APPLICATION', 'COMPONENT');

-- CreateEnum
CREATE TYPE "app_frame" AS ENUM ('REACT', 'VUE');

-- CreateEnum
CREATE TYPE "app_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "feature_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ROLLOUT');

-- CreateTable
CREATE TABLE "app" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "path" VARCHAR(100),
    "mode" "app_mode" NOT NULL DEFAULT 'APPLICATION',
    "frame" "app_frame" NOT NULL DEFAULT 'REACT',
    "status" "app_status" NOT NULL DEFAULT 'INACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL DEFAULT 'off',
    "status" "feature_status" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_name_idx" ON "app"("name");

-- CreateIndex
CREATE INDEX "feature_tenant_id_idx" ON "feature"("tenant_id");

-- CreateIndex
CREATE INDEX "feature_status_idx" ON "feature"("status");

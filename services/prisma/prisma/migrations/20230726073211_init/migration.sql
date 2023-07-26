-- CreateEnum
CREATE TYPE "app_mode" AS ENUM ('APPLICATION', 'COMPONENT');

-- CreateEnum
CREATE TYPE "app_frame" AS ENUM ('REACT');

-- CreateEnum
CREATE TYPE "app_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "feature_status" AS ENUM ('ACTIVE', 'INACTIVE', 'ROLLOUT');

-- CreateEnum
CREATE TYPE "storage_provider" AS ENUM ('AWS', 'MINIO');

-- CreateEnum
CREATE TYPE "storage_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "storage_file_status" AS ENUM ('ACTIVE', 'INACTIVE');

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

-- CreateTable
CREATE TABLE "storage" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "provider" "storage_provider" NOT NULL,
    "status" "storage_status" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_file" (
    "id" BIGSERIAL NOT NULL,
    "tenant_id" VARCHAR(50) NOT NULL,
    "status" "storage_file_status" NOT NULL DEFAULT 'ACTIVE',
    "name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100),
    "size" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storage_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "app_name_idx" ON "app"("name");

-- CreateIndex
CREATE INDEX "feature_tenant_id_idx" ON "feature"("tenant_id");

-- CreateIndex
CREATE INDEX "feature_status_idx" ON "feature"("status");

-- CreateIndex
CREATE INDEX "storage_tenant_id_idx" ON "storage"("tenant_id");

-- CreateIndex
CREATE INDEX "storage_status_idx" ON "storage"("status");

-- CreateIndex
CREATE INDEX "storage_file_tenant_id_idx" ON "storage_file"("tenant_id");

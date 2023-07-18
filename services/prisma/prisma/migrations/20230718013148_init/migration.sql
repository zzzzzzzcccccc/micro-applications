-- CreateEnum
CREATE TYPE "app_mode" AS ENUM ('APPLICATION', 'COMPONENT');

-- CreateEnum
CREATE TYPE "app_frame" AS ENUM ('REACT', 'VUE');

-- CreateEnum
CREATE TYPE "app_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "app" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255),
    "mode" "app_mode" NOT NULL DEFAULT 'APPLICATION',
    "frame" "app_frame" NOT NULL DEFAULT 'REACT',
    "status" "app_status" NOT NULL DEFAULT 'INACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

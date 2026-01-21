-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('executor', 'trustee', 'healthcare_proxy', 'financial_poa', 'guardian', 'beneficiary', 'advisor', 'attorney', 'other');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('documents', 'assets', 'beneficiaries', 'tax', 'general');

-- CreateEnum
CREATE TYPE "ChecklistCategory" AS ENUM ('real_estate', 'financial', 'retirement', 'insurance', 'business', 'personal', 'existing_documents');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('not_gathered', 'in_progress', 'gathered');

-- CreateEnum
CREATE TYPE "GapRunStatus" AS ENUM ('pending', 'running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "GuidedIntakeProgress" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "stepData" JSONB NOT NULL DEFAULT '{}',
    "flowMode" TEXT NOT NULL DEFAULT 'guided',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuidedIntakeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyContact" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "role" "ContactRole" NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttorneyQuestion" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttorneyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChecklistItem" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ChecklistCategory" NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'not_gathered',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapAnalysisRun" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "status" "GapRunStatus" NOT NULL DEFAULT 'pending',
    "analysisType" TEXT NOT NULL DEFAULT 'comprehensive',
    "currentPhase" INTEGER NOT NULL DEFAULT 1,
    "totalPhases" INTEGER NOT NULL DEFAULT 3,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GapAnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapAnalysisPhase" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "GapRunStatus" NOT NULL DEFAULT 'pending',
    "totalRuns" INTEGER NOT NULL DEFAULT 0,
    "completedRuns" INTEGER NOT NULL DEFAULT 0,
    "failedRuns" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GapAnalysisPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapAnalysisRunResult" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "runType" TEXT NOT NULL,
    "status" "GapRunStatus" NOT NULL DEFAULT 'pending',
    "result" JSONB,
    "rawOutput" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GapAnalysisRunResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuidedIntakeProgress_estatePlanId_key" ON "GuidedIntakeProgress"("estatePlanId");

-- CreateIndex
CREATE INDEX "FamilyContact_estatePlanId_idx" ON "FamilyContact"("estatePlanId");

-- CreateIndex
CREATE INDEX "FamilyContact_estatePlanId_role_idx" ON "FamilyContact"("estatePlanId", "role");

-- CreateIndex
CREATE INDEX "AttorneyQuestion_estatePlanId_idx" ON "AttorneyQuestion"("estatePlanId");

-- CreateIndex
CREATE INDEX "AttorneyQuestion_estatePlanId_category_idx" ON "AttorneyQuestion"("estatePlanId", "category");

-- CreateIndex
CREATE INDEX "DocumentChecklistItem_estatePlanId_idx" ON "DocumentChecklistItem"("estatePlanId");

-- CreateIndex
CREATE INDEX "DocumentChecklistItem_estatePlanId_category_idx" ON "DocumentChecklistItem"("estatePlanId", "category");

-- CreateIndex
CREATE INDEX "GapAnalysisRun_estatePlanId_idx" ON "GapAnalysisRun"("estatePlanId");

-- CreateIndex
CREATE INDEX "GapAnalysisRun_estatePlanId_status_idx" ON "GapAnalysisRun"("estatePlanId", "status");

-- CreateIndex
CREATE INDEX "GapAnalysisPhase_runId_idx" ON "GapAnalysisPhase"("runId");

-- CreateIndex
CREATE INDEX "GapAnalysisRunResult_phaseId_idx" ON "GapAnalysisRunResult"("phaseId");

-- AddForeignKey
ALTER TABLE "GuidedIntakeProgress" ADD CONSTRAINT "GuidedIntakeProgress_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyContact" ADD CONSTRAINT "FamilyContact_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttorneyQuestion" ADD CONSTRAINT "AttorneyQuestion_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklistItem" ADD CONSTRAINT "DocumentChecklistItem_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapAnalysisRun" ADD CONSTRAINT "GapAnalysisRun_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapAnalysisPhase" ADD CONSTRAINT "GapAnalysisPhase_runId_fkey" FOREIGN KEY ("runId") REFERENCES "GapAnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapAnalysisRunResult" ADD CONSTRAINT "GapAnalysisRunResult_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "GapAnalysisPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

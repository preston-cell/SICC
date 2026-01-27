-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('pending', 'running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "EstatePlanStatus" AS ENUM ('draft', 'intake_in_progress', 'intake_complete', 'analysis_complete', 'documents_generated', 'complete');

-- CreateEnum
CREATE TYPE "IntakeSection" AS ENUM ('personal', 'family', 'assets', 'existing_documents', 'goals');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('will', 'trust', 'poa_financial', 'poa_healthcare', 'healthcare_directive', 'hipaa', 'other');

-- CreateEnum
CREATE TYPE "DocumentFormat" AS ENUM ('markdown', 'html', 'pdf');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('draft', 'reviewed', 'final');

-- CreateEnum
CREATE TYPE "UploadedDocumentType" AS ENUM ('will', 'trust', 'poa_financial', 'poa_healthcare', 'healthcare_directive', 'deed', 'insurance_policy', 'beneficiary_form', 'other');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('pending', 'extracting', 'analyzing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "ExtractedDataStatus" AS ENUM ('extracted', 'reviewed', 'applied', 'rejected');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('annual_review', 'life_event', 'document_update', 'beneficiary_review', 'custom');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('pending', 'completed', 'snoozed', 'dismissed');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "RecurrencePattern" AS ENUM ('monthly', 'quarterly', 'annually', 'biannually');

-- CreateEnum
CREATE TYPE "LifeEventType" AS ENUM ('marriage', 'divorce', 'birth', 'death', 'major_asset_change', 'relocation', 'retirement', 'business_change', 'health_change', 'other');

-- CreateEnum
CREATE TYPE "BeneficiaryAssetType" AS ENUM ('retirement_401k', 'retirement_ira', 'retirement_roth', 'retirement_pension', 'retirement_other', 'life_insurance', 'annuity', 'bank_pod', 'brokerage_tod', 'real_estate_tod', 'other');

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'pending',
    "output" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "estatePlanId" TEXT,
    "runType" TEXT,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedFile" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isBinary" BOOLEAN NOT NULL DEFAULT false,
    "size" INTEGER NOT NULL,

    CONSTRAINT "GeneratedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clerkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstatePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'My Estate Plan',
    "status" "EstatePlanStatus" NOT NULL DEFAULT 'draft',
    "stateOfResidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstatePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntakeData" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "section" "IntakeSection" NOT NULL,
    "data" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "runId" TEXT,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "format" "DocumentFormat" NOT NULL DEFAULT 'markdown',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "DocumentStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapAnalysis" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "runId" TEXT,
    "score" INTEGER,
    "estateComplexity" TEXT,
    "estimatedEstateTax" TEXT,
    "missingDocuments" TEXT NOT NULL,
    "outdatedDocuments" TEXT NOT NULL,
    "inconsistencies" TEXT NOT NULL,
    "taxOptimization" TEXT,
    "medicaidPlanning" TEXT,
    "recommendations" TEXT NOT NULL,
    "stateSpecificNotes" TEXT NOT NULL,
    "rawAnalysis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GapAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedDocument" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "storageId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "documentType" "UploadedDocumentType" NOT NULL,
    "description" TEXT,
    "extractedText" TEXT,
    "analysisStatus" "AnalysisStatus" NOT NULL DEFAULT 'pending',
    "analysisResult" TEXT,
    "analysisError" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extractedAt" TIMESTAMP(3),
    "analyzedAt" TIMESTAMP(3),

    CONSTRAINT "UploadedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedIntakeData" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "section" "IntakeSection" NOT NULL,
    "extractedData" TEXT NOT NULL,
    "sourceDocumentIds" TEXT[],
    "confidence" INTEGER NOT NULL,
    "status" "ExtractedDataStatus" NOT NULL DEFAULT 'extracted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtractedIntakeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "ReminderType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "lifeEvent" "LifeEventType",
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'pending',
    "snoozedUntil" TIMESTAMP(3),
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrencePattern" "RecurrencePattern",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeEvent" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "eventType" "LifeEventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "requiresDocumentUpdate" BOOLEAN NOT NULL DEFAULT false,
    "documentsAffected" TEXT,
    "planUpdated" BOOLEAN NOT NULL DEFAULT false,
    "planUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeneficiaryDesignation" (
    "id" TEXT NOT NULL,
    "estatePlanId" TEXT NOT NULL,
    "assetType" "BeneficiaryAssetType" NOT NULL,
    "assetName" TEXT NOT NULL,
    "institution" TEXT,
    "accountNumber" TEXT,
    "estimatedValue" TEXT,
    "primaryBeneficiaryName" TEXT NOT NULL,
    "primaryBeneficiaryRelationship" TEXT,
    "primaryBeneficiaryPercentage" INTEGER,
    "contingentBeneficiaryName" TEXT,
    "contingentBeneficiaryRelationship" TEXT,
    "contingentBeneficiaryPercentage" INTEGER,
    "lastReviewedDate" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeneficiaryDesignation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExtractedIntakeDataToUploadedDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ExtractedIntakeDataToUploadedDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "AgentRun_createdAt_idx" ON "AgentRun"("createdAt");

-- CreateIndex
CREATE INDEX "AgentRun_estatePlanId_idx" ON "AgentRun"("estatePlanId");

-- CreateIndex
CREATE INDEX "GeneratedFile_runId_idx" ON "GeneratedFile"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "EstatePlan_userId_idx" ON "EstatePlan"("userId");

-- CreateIndex
CREATE INDEX "EstatePlan_sessionId_idx" ON "EstatePlan"("sessionId");

-- CreateIndex
CREATE INDEX "EstatePlan_createdAt_idx" ON "EstatePlan"("createdAt");

-- CreateIndex
CREATE INDEX "IntakeData_estatePlanId_idx" ON "IntakeData"("estatePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "IntakeData_estatePlanId_section_key" ON "IntakeData"("estatePlanId", "section");

-- CreateIndex
CREATE INDEX "Document_estatePlanId_idx" ON "Document"("estatePlanId");

-- CreateIndex
CREATE INDEX "Document_estatePlanId_type_idx" ON "Document"("estatePlanId", "type");

-- CreateIndex
CREATE INDEX "GapAnalysis_estatePlanId_idx" ON "GapAnalysis"("estatePlanId");

-- CreateIndex
CREATE INDEX "GapAnalysis_estatePlanId_createdAt_idx" ON "GapAnalysis"("estatePlanId", "createdAt");

-- CreateIndex
CREATE INDEX "UploadedDocument_estatePlanId_idx" ON "UploadedDocument"("estatePlanId");

-- CreateIndex
CREATE INDEX "UploadedDocument_estatePlanId_documentType_idx" ON "UploadedDocument"("estatePlanId", "documentType");

-- CreateIndex
CREATE INDEX "UploadedDocument_estatePlanId_analysisStatus_idx" ON "UploadedDocument"("estatePlanId", "analysisStatus");

-- CreateIndex
CREATE INDEX "ExtractedIntakeData_estatePlanId_idx" ON "ExtractedIntakeData"("estatePlanId");

-- CreateIndex
CREATE INDEX "ExtractedIntakeData_estatePlanId_section_idx" ON "ExtractedIntakeData"("estatePlanId", "section");

-- CreateIndex
CREATE INDEX "Reminder_estatePlanId_idx" ON "Reminder"("estatePlanId");

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- CreateIndex
CREATE INDEX "Reminder_estatePlanId_status_idx" ON "Reminder"("estatePlanId", "status");

-- CreateIndex
CREATE INDEX "Reminder_estatePlanId_dueDate_idx" ON "Reminder"("estatePlanId", "dueDate");

-- CreateIndex
CREATE INDEX "LifeEvent_estatePlanId_idx" ON "LifeEvent"("estatePlanId");

-- CreateIndex
CREATE INDEX "LifeEvent_estatePlanId_eventType_idx" ON "LifeEvent"("estatePlanId", "eventType");

-- CreateIndex
CREATE INDEX "BeneficiaryDesignation_estatePlanId_idx" ON "BeneficiaryDesignation"("estatePlanId");

-- CreateIndex
CREATE INDEX "BeneficiaryDesignation_estatePlanId_assetType_idx" ON "BeneficiaryDesignation"("estatePlanId", "assetType");

-- CreateIndex
CREATE INDEX "_ExtractedIntakeDataToUploadedDocument_B_index" ON "_ExtractedIntakeDataToUploadedDocument"("B");

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFile" ADD CONSTRAINT "GeneratedFile_runId_fkey" FOREIGN KEY ("runId") REFERENCES "AgentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstatePlan" ADD CONSTRAINT "EstatePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntakeData" ADD CONSTRAINT "IntakeData_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_runId_fkey" FOREIGN KEY ("runId") REFERENCES "AgentRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapAnalysis" ADD CONSTRAINT "GapAnalysis_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapAnalysis" ADD CONSTRAINT "GapAnalysis_runId_fkey" FOREIGN KEY ("runId") REFERENCES "AgentRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedDocument" ADD CONSTRAINT "UploadedDocument_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedIntakeData" ADD CONSTRAINT "ExtractedIntakeData_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeEvent" ADD CONSTRAINT "LifeEvent_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeneficiaryDesignation" ADD CONSTRAINT "BeneficiaryDesignation_estatePlanId_fkey" FOREIGN KEY ("estatePlanId") REFERENCES "EstatePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtractedIntakeDataToUploadedDocument" ADD CONSTRAINT "_ExtractedIntakeDataToUploadedDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtractedIntakeData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtractedIntakeDataToUploadedDocument" ADD CONSTRAINT "_ExtractedIntakeDataToUploadedDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "UploadedDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

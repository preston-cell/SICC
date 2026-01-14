import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // CORE AGENT TABLES (existing functionality)
  // ============================================

  // Stores each agent run with its status and output
  agentRuns: defineTable({
    prompt: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    output: v.optional(v.string()), // Agent stdout/stderr logs
    error: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    // Link to estate plan if this run is for estate planning
    estatePlanId: v.optional(v.id("estatePlans")),
    // Type of run: general, gap_analysis, document_generation
    runType: v.optional(v.string()),
  }).index("by_created", ["createdAt"])
    .index("by_estate_plan", ["estatePlanId"]),

  // Stores generated files for each run
  generatedFiles: defineTable({
    runId: v.id("agentRuns"),
    path: v.string(), // Relative path of the file
    content: v.string(), // File content (base64 for binary, plain text for text files)
    isBinary: v.boolean(),
    size: v.number(), // File size in bytes
  }).index("by_run", ["runId"]),

  // ============================================
  // ESTATE PLANNING TABLES
  // ============================================

  // User accounts (optional, for persistent plans)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.optional(v.string()), // For simple auth, or use external auth
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Estate plans - the main container for a user's estate planning session
  estatePlans: defineTable({
    userId: v.optional(v.id("users")), // Optional for anonymous users
    sessionId: v.optional(v.string()), // For anonymous session tracking
    name: v.optional(v.string()), // User-friendly name, e.g., "John's Estate Plan"
    status: v.union(
      v.literal("draft"),
      v.literal("intake_in_progress"),
      v.literal("intake_complete"),
      v.literal("analysis_complete"),
      v.literal("documents_generated"),
      v.literal("complete")
    ),
    // State of residence - important for legal requirements
    stateOfResidence: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_created", ["createdAt"]),

  // Intake data - stores questionnaire responses by section
  intakeData: defineTable({
    estatePlanId: v.id("estatePlans"),
    section: v.union(
      v.literal("personal"),
      v.literal("family"),
      v.literal("assets"),
      v.literal("existing_documents"),
      v.literal("goals")
    ),
    data: v.string(), // JSON stringified responses
    isComplete: v.boolean(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_estate_plan_section", ["estatePlanId", "section"]),

  // Generated legal documents
  documents: defineTable({
    estatePlanId: v.id("estatePlans"),
    runId: v.optional(v.id("agentRuns")), // Links to the generation run
    type: v.union(
      v.literal("will"),
      v.literal("trust"),
      v.literal("poa_financial"),
      v.literal("poa_healthcare"),
      v.literal("healthcare_directive"),
      v.literal("hipaa"),
      v.literal("other")
    ),
    title: v.string(),
    content: v.string(), // The document content (markdown or HTML)
    format: v.union(
      v.literal("markdown"),
      v.literal("html"),
      v.literal("pdf")
    ),
    version: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("reviewed"),
      v.literal("final")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_type", ["estatePlanId", "type"]),

  // Gap analysis results
  gapAnalysis: defineTable({
    estatePlanId: v.id("estatePlans"),
    runId: v.optional(v.id("agentRuns")), // Links to the analysis run
    // Completeness score 0-100
    score: v.optional(v.number()),
    // Estate complexity classification
    estateComplexity: v.optional(v.string()),
    // Estimated estate tax (JSON object with state, federal, notes)
    estimatedEstateTax: v.optional(v.string()),
    // JSON array of missing documents
    missingDocuments: v.string(),
    // JSON array of outdated documents
    outdatedDocuments: v.string(),
    // JSON array of inconsistencies found
    inconsistencies: v.string(),
    // JSON array of tax optimization strategies
    taxOptimization: v.optional(v.string()),
    // Medicaid planning analysis (JSON object)
    medicaidPlanning: v.optional(v.string()),
    // JSON array of recommendations
    recommendations: v.string(),
    // JSON array of state-specific notes
    stateSpecificNotes: v.string(),
    // Raw analysis output from the agent
    rawAnalysis: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_created", ["estatePlanId", "createdAt"]),

  // Extracted intake data from uploaded documents
  extractedIntakeData: defineTable({
    estatePlanId: v.id("estatePlans"),
    // Section this extraction applies to
    section: v.union(
      v.literal("personal"),
      v.literal("family"),
      v.literal("assets"),
      v.literal("existing_documents"),
      v.literal("goals")
    ),
    // Extracted data as JSON
    extractedData: v.string(),
    // Source document IDs
    sourceDocumentIds: v.array(v.id("uploadedDocuments")),
    // Confidence score 0-100
    confidence: v.number(),
    // Status of extraction
    status: v.union(
      v.literal("extracted"),
      v.literal("reviewed"),
      v.literal("applied"),
      v.literal("rejected")
    ),
    createdAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_section", ["estatePlanId", "section"]),

  // ============================================
  // REMINDERS & UPDATE TRACKING
  // ============================================

  // Reminders for estate plan reviews and life events
  reminders: defineTable({
    estatePlanId: v.id("estatePlans"),
    userId: v.optional(v.id("users")),
    // Type of reminder
    type: v.union(
      v.literal("annual_review"),      // Yearly review reminder
      v.literal("life_event"),         // Marriage, birth, death, divorce, etc.
      v.literal("document_update"),    // Specific document needs update
      v.literal("beneficiary_review"), // Review beneficiary designations
      v.literal("custom")              // User-defined reminder
    ),
    // The reminder title and description
    title: v.string(),
    description: v.optional(v.string()),
    // For life events, specify which event
    lifeEvent: v.optional(v.union(
      v.literal("marriage"),
      v.literal("divorce"),
      v.literal("birth"),
      v.literal("death"),
      v.literal("major_asset_change"),
      v.literal("relocation"),
      v.literal("retirement"),
      v.literal("business_change"),
      v.literal("health_change"),
      v.literal("other")
    )),
    // When the reminder is due
    dueDate: v.number(), // Unix timestamp
    // Status of the reminder
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("snoozed"),
      v.literal("dismissed")
    ),
    // If snoozed, when to remind again
    snoozedUntil: v.optional(v.number()),
    // Priority level
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    // Recurrence settings
    isRecurring: v.boolean(),
    recurrencePattern: v.optional(v.union(
      v.literal("monthly"),
      v.literal("quarterly"),
      v.literal("annually"),
      v.literal("biannually")
    )),
    // Sub-task support - links child reminders to parent
    parentReminderId: v.optional(v.id("reminders")),
    // Source tracking for auto-generated reminders
    sourceType: v.optional(v.union(
      v.literal("gap_analysis"),
      v.literal("life_event"),
      v.literal("manual")
    )),
    sourceId: v.optional(v.string()), // Reference to source recommendation/document
    isAutoGenerated: v.optional(v.boolean()), // Whether this was auto-generated
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_user", ["userId"])
    .index("by_status", ["estatePlanId", "status"])
    .index("by_due_date", ["estatePlanId", "dueDate"])
    .index("by_parent", ["parentReminderId"]),

  // Life events log - tracks major events that may require plan updates
  lifeEvents: defineTable({
    estatePlanId: v.id("estatePlans"),
    eventType: v.union(
      v.literal("marriage"),
      v.literal("divorce"),
      v.literal("birth"),
      v.literal("death"),
      v.literal("major_asset_change"),
      v.literal("relocation"),
      v.literal("retirement"),
      v.literal("business_change"),
      v.literal("health_change"),
      v.literal("other")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    eventDate: v.number(), // When the event occurred
    // Impact assessment
    requiresDocumentUpdate: v.boolean(),
    documentsAffected: v.optional(v.string()), // JSON array of document types
    // Was the plan updated after this event?
    planUpdated: v.boolean(),
    planUpdatedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_event_type", ["estatePlanId", "eventType"]),

  // ============================================
  // UPLOADED DOCUMENTS (Phase 9)
  // ============================================

  // Stores user-uploaded legal documents for AI analysis
  uploadedDocuments: defineTable({
    estatePlanId: v.id("estatePlans"),
    // Convex file storage ID
    storageId: v.id("_storage"),
    // Original file name
    fileName: v.string(),
    // File size in bytes
    fileSize: v.number(),
    // MIME type
    mimeType: v.string(),
    // What type of document the user says this is
    documentType: v.union(
      v.literal("will"),
      v.literal("trust"),
      v.literal("poa_financial"),
      v.literal("poa_healthcare"),
      v.literal("healthcare_directive"),
      v.literal("deed"),
      v.literal("insurance_policy"),
      v.literal("beneficiary_form"),
      v.literal("other")
    ),
    // User-provided description
    description: v.optional(v.string()),
    // Extracted text content from the PDF
    extractedText: v.optional(v.string()),
    // Status of AI analysis
    analysisStatus: v.union(
      v.literal("pending"),        // Just uploaded, not analyzed
      v.literal("extracting"),     // Text extraction in progress
      v.literal("analyzing"),      // AI analysis in progress
      v.literal("completed"),      // Analysis complete
      v.literal("failed")          // Analysis failed
    ),
    // AI analysis results (JSON stringified)
    analysisResult: v.optional(v.string()),
    // Error message if analysis failed
    analysisError: v.optional(v.string()),
    // Timestamps
    uploadedAt: v.number(),
    extractedAt: v.optional(v.number()),
    analyzedAt: v.optional(v.number()),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_type", ["estatePlanId", "documentType"])
    .index("by_status", ["estatePlanId", "analysisStatus"]),

  // ============================================
  // BENEFICIARY DESIGNATIONS
  // ============================================

  // Beneficiary designations - tracks beneficiaries on accounts that bypass the will
  // IMPORTANT: These override the will! Retirement accounts, life insurance, and
  // TOD/POD accounts pass directly to named beneficiaries, not through probate.
  beneficiaryDesignations: defineTable({
    estatePlanId: v.id("estatePlans"),
    // Type of account
    assetType: v.union(
      v.literal("retirement_401k"),
      v.literal("retirement_ira"),
      v.literal("retirement_roth"),
      v.literal("retirement_pension"),
      v.literal("retirement_other"),
      v.literal("life_insurance"),
      v.literal("annuity"),
      v.literal("bank_pod"), // Payable on Death
      v.literal("brokerage_tod"), // Transfer on Death
      v.literal("real_estate_tod"),
      v.literal("other")
    ),
    // Account/asset details
    assetName: v.string(), // e.g., "Fidelity 401(k)", "Northwestern Mutual Life Insurance"
    institution: v.optional(v.string()), // e.g., "Fidelity", "Vanguard"
    accountNumber: v.optional(v.string()), // Last 4 digits only for reference
    estimatedValue: v.optional(v.string()), // Value range
    // Primary beneficiary
    primaryBeneficiaryName: v.string(),
    primaryBeneficiaryRelationship: v.optional(v.string()), // e.g., "Spouse", "Child"
    primaryBeneficiaryPercentage: v.optional(v.number()), // 0-100
    // Contingent (backup) beneficiary
    contingentBeneficiaryName: v.optional(v.string()),
    contingentBeneficiaryRelationship: v.optional(v.string()),
    contingentBeneficiaryPercentage: v.optional(v.number()),
    // When was this last reviewed/updated?
    lastReviewedDate: v.optional(v.string()), // ISO date string
    // Notes
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_asset_type", ["estatePlanId", "assetType"]),
});

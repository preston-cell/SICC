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

  // Guided intake progress - tracks step-by-step progress for conversational flow
  guidedIntakeProgress: defineTable({
    estatePlanId: v.id("estatePlans"),
    // Current step (1-8)
    currentStep: v.number(),
    // Completed steps array
    completedSteps: v.array(v.number()),
    // Flow mode
    flowMode: v.union(v.literal("guided"), v.literal("comprehensive")),
    // Current question within step (for mobile one-question-at-a-time mode)
    currentQuestionIndex: v.optional(v.number()),
    // Step-specific data (JSON for conditional reveals, skipped questions, etc.)
    stepData: v.optional(v.string()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    lastSavedAt: v.optional(v.number()),
  }).index("by_estate_plan", ["estatePlanId"]),

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
    // Score breakdown explaining how the score was calculated (JSON)
    scoreBreakdown: v.optional(v.string()),
    // Estate complexity classification
    estateComplexity: v.optional(v.string()),
    // Estimated estate tax (JSON object with state, federal, notes)
    estimatedEstateTax: v.optional(v.string()),
    // JSON array of common issues found
    commonIssues: v.optional(v.string()),
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
    // Multi-phase analysis fields
    multiPhaseRunId: v.optional(v.id("gapAnalysisRuns")),
    analysisType: v.optional(v.union(v.literal("quick"), v.literal("comprehensive"))),
    scenarioAnalysis: v.optional(v.string()),      // JSON: 8 what-if scenarios
    priorityMatrix: v.optional(v.string()),        // JSON: priority matrix
    stateResearch: v.optional(v.string()),         // JSON: Phase 1 state law research
    documentInventory: v.optional(v.string()),     // JSON: complete document inventory
    familyProtectionAnalysis: v.optional(v.string()), // JSON: family protection details
    assetProtectionAnalysis: v.optional(v.string()),  // JSON: asset protection details
    totalDurationMs: v.optional(v.number()),
    totalCostUsd: v.optional(v.number()),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_created", ["estatePlanId", "createdAt"]),

  // ============================================
  // MULTI-PHASE GAP ANALYSIS ORCHESTRATION
  // ============================================

  // Tracks overall multi-phase analysis runs
  gapAnalysisRuns: defineTable({
    estatePlanId: v.id("estatePlans"),
    // Overall status
    status: v.union(
      v.literal("pending"),
      v.literal("phase1_running"),
      v.literal("phase1_complete"),
      v.literal("phase2_running"),
      v.literal("phase2_complete"),
      v.literal("phase3_running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("partial")  // Completed with some failures
    ),
    // Progress tracking (0-100)
    overallProgress: v.number(),
    currentPhase: v.optional(v.number()),
    currentPhaseProgress: v.optional(v.number()),
    // Timing
    startedAt: v.number(),
    phase1CompletedAt: v.optional(v.number()),
    phase2CompletedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    // Configuration
    config: v.optional(v.string()),  // JSON: which runs to execute, max turns per run
    // Error handling
    lastError: v.optional(v.string()),
    retryCount: v.number(),
    // Final result reference
    finalAnalysisId: v.optional(v.id("gapAnalysis")),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_status", ["status"])
    .index("by_created", ["startedAt"]),

  // Tracks individual phases within a run
  gapAnalysisPhases: defineTable({
    runId: v.id("gapAnalysisRuns"),
    phaseNumber: v.number(),  // 1, 2, or 3
    // Phase type for UI
    phaseType: v.union(
      v.literal("research"),    // Phase 1
      v.literal("analysis"),    // Phase 2
      v.literal("synthesis")    // Phase 3
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    // Runs in this phase
    totalRuns: v.number(),
    completedRuns: v.number(),
    failedRuns: v.number(),
    // Timing
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    // Aggregated results from this phase (JSON)
    aggregatedResults: v.optional(v.string()),
  }).index("by_run", ["runId"])
    .index("by_run_phase", ["runId", "phaseNumber"]),

  // Individual run results within a phase
  gapAnalysisRunResults: defineTable({
    runId: v.id("gapAnalysisRuns"),
    phaseId: v.id("gapAnalysisPhases"),
    // Run identification
    runType: v.string(),  // e.g., "state_law_research", "tax_optimization", etc.
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    // Execution details
    prompt: v.optional(v.string()),
    maxTurns: v.number(),
    webSearchEnabled: v.boolean(),
    // Results
    result: v.optional(v.string()),  // JSON
    rawOutput: v.optional(v.string()),
    // Metadata
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    turnsUsed: v.optional(v.number()),
    costUsd: v.optional(v.number()),
    // Error tracking
    error: v.optional(v.string()),
    retryCount: v.number(),
  }).index("by_run", ["runId"])
    .index("by_phase", ["phaseId"])
    .index("by_type", ["runId", "runType"]),

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
      v.literal("custom"),             // User-defined reminder
      v.literal("preparation_task")    // Tasks to complete during comprehensive analysis
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
    // Preparation task fields (for comprehensive analysis waiting experience)
    preparationCategory: v.optional(v.union(
      v.literal("document_gathering"),
      v.literal("contact_collection"),
      v.literal("questions")
    )),
    preparationData: v.optional(v.string()), // JSON for checklist items, etc.
    linkedRunId: v.optional(v.id("gapAnalysisRuns")), // Link to running analysis
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
  // NOTIFICATION SYSTEM
  // ============================================

  // Notification preferences per estate plan
  notificationPreferences: defineTable({
    estatePlanId: v.id("estatePlans"),
    userId: v.optional(v.id("users")),
    // Email notifications
    emailEnabled: v.boolean(),
    emailAddress: v.optional(v.string()),
    emailVerified: v.boolean(),
    // Push notifications
    pushEnabled: v.boolean(),
    pushSubscription: v.optional(v.string()), // JSON stringified push subscription
    // Digest preferences
    digestEnabled: v.boolean(),
    digestFrequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly")
    ),
    // Reminder type preferences
    annualReviewReminders: v.boolean(),
    beneficiaryReviewReminders: v.boolean(),
    lifeEventPrompts: v.boolean(),
    overdueAlerts: v.boolean(),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_user", ["userId"]),

  // Notification delivery log
  notificationLog: defineTable({
    estatePlanId: v.id("estatePlans"),
    reminderId: v.optional(v.id("reminders")),
    // Notification type
    type: v.union(
      v.literal("email"),
      v.literal("push"),
      v.literal("digest")
    ),
    // Notification content
    subject: v.string(),
    body: v.optional(v.string()),
    // Delivery status
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("delivered")
    ),
    sentAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    // Error tracking
    error: v.optional(v.string()),
    retryCount: v.optional(v.number()),
    // Timestamps
    createdAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_reminder", ["reminderId"])
    .index("by_status", ["status"]),

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
      v.literal("tax_return"),
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

  // ============================================
  // PREPARATION TASKS (for comprehensive analysis)
  // ============================================

  // Family contacts - key people in the estate plan
  familyContacts: defineTable({
    estatePlanId: v.id("estatePlans"),
    name: v.string(),
    relationship: v.string(),
    role: v.union(
      v.literal("executor"),
      v.literal("trustee"),
      v.literal("healthcare_proxy"),
      v.literal("financial_poa"),
      v.literal("guardian"),
      v.literal("beneficiary"),
      v.literal("advisor"),
      v.literal("attorney"),
      v.literal("other")
    ),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_role", ["estatePlanId", "role"]),

  // Attorney questions - questions to ask during consultation
  attorneyQuestions: defineTable({
    estatePlanId: v.id("estatePlans"),
    question: v.string(),
    category: v.optional(v.union(
      v.literal("documents"),
      v.literal("assets"),
      v.literal("beneficiaries"),
      v.literal("tax"),
      v.literal("general")
    )),
    isAnswered: v.boolean(),
    answer: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_category", ["estatePlanId", "category"]),

  // Document checklist items - documents to gather
  documentChecklistItems: defineTable({
    estatePlanId: v.id("estatePlans"),
    category: v.union(
      v.literal("real_estate"),
      v.literal("financial"),
      v.literal("retirement"),
      v.literal("insurance"),
      v.literal("business"),
      v.literal("personal"),
      v.literal("existing_documents")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("not_gathered"),
      v.literal("in_progress"),
      v.literal("gathered")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_estate_plan", ["estatePlanId"])
    .index("by_category", ["estatePlanId", "category"])
    .index("by_status", ["estatePlanId", "status"]),
});

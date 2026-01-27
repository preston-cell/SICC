# Implementation Plan: Phase 2 - Lawyer Feedback & UX Improvements

Based on Q&A with estate lawyer and UI/UX research from Nielsen Norman Group.

## Research Summary

### UI/UX Best Practices Applied (Nielsen Norman Group)

1. **Visibility of System Status** - Show progress, loading states, and clear feedback
2. **Match System to Real World** - Use plain language, not legal jargon
3. **User Control & Freedom** - Allow undo, back navigation, save & resume
4. **Consistency & Standards** - Follow conventions, consistent design system
5. **Error Prevention** - Validate inputs, confirm irreversible actions
6. **Recognition over Recall** - Show options, don't require memorization
7. **Flexibility & Efficiency** - Support both novice and expert users
8. **Aesthetic Minimalism** - Focus on essentials, reduce clutter
9. **Help Users with Errors** - Plain language errors with solutions
10. **Help & Documentation** - Contextual tooltips, glossary

### Wizard Design Guidelines
- Clear step indicators with descriptive labels
- Allow mid-process saving and resumption
- Self-sufficient steps with inline help
- Action-specific button labels (not just "Next")

---

## Implementation Phases

### Phase 4: Enhanced Intake & Plain Language Translation
**Goal:** Address lawyer feedback on "turning financial part to easily digestible language"

#### 4.1 Create Glossary & Tooltip System
```
Files to create:
- app/components/Glossary.tsx (modal with searchable legal terms)
- app/components/Tooltip.tsx (inline term explanations)
- convex/glossary.ts (legal term definitions)
```

**Prompt for Claude Code:**
```
Create a glossary system for the estate planning app:

1. Create app/components/Tooltip.tsx:
   - Hover/click tooltip for legal terms
   - Props: term (string), children (ReactNode)
   - Fetch definition from glossary data
   - Smooth animation, mobile-friendly
   - Style: subtle underline dotted, show definition on hover

2. Create app/components/Glossary.tsx:
   - Full-page modal with searchable list
   - Categories: Estate Basics, Documents, Beneficiaries, Taxes
   - Each term has: title, plain English definition, example
   - Accessible via footer link or help icon

3. Create lib/glossaryData.ts with terms:
   - Beneficiary: "A person or organization you choose to receive..."
   - Executor: "The person you choose to carry out your will..."
   - Probate: "The legal process of validating a will..."
   - Trust: "A legal arrangement where someone holds assets..."
   - Power of Attorney: "A document giving someone authority..."
   - HIPAA: "A law protecting your medical information..."
   - (20+ essential terms)

4. Update intake form labels to use Tooltip for complex terms
```

#### 4.2 Improve Intake Wizard UX
```
Files to modify:
- app/intake/[step]/page.tsx (all 5 steps)
- app/components/IntakeProgress.tsx
- app/components/FormFields.tsx
```

**Prompt for Claude Code:**
```
Improve the intake wizard following Nielsen Norman Group guidelines:

1. Update IntakeProgress.tsx:
   - Show descriptive step names (not just numbers)
   - Current step highlighted with clear visual indicator
   - Completed steps show checkmark
   - Click to navigate to completed steps only
   - Mobile: horizontal scrollable, desktop: sidebar

2. Update each intake step page:
   - Replace "Continue" with action-specific labels:
     - Personal: "Continue to Family"
     - Family: "Continue to Assets"
     - Assets: "Continue to Existing Documents"
     - Existing: "Continue to Goals"
     - Goals: "Review & Submit"
   - Add "Save & Exit" button (saves progress, returns home)
   - Add contextual help text below form title
   - Group related fields with visual sections

3. Update FormFields.tsx:
   - Add optional helpText prop to all field types
   - Add validation feedback (red border, error message)
   - Add success states (green checkmark when valid)
   - Improve focus states for accessibility

4. Add auto-save indicator:
   - Show "Saving..." while debounced save runs
   - Show "All changes saved" after successful save
   - Show timestamp of last save
```

---

### Phase 5: Estate Visualization Dashboard
**Goal:** "Scan documents and show how estate will look upon death"

#### 5.1 Create Estate Overview Visualization
```
Files to create:
- app/components/EstateVisualization.tsx
- app/components/AssetFlowDiagram.tsx
- app/components/BeneficiaryCards.tsx
- app/analysis/[estatePlanId]/visualization/page.tsx
```

**Prompt for Claude Code:**
```
Create an estate visualization dashboard that shows "how the estate will look upon death":

1. Create app/components/EstateVisualization.tsx:
   - Visual breakdown of estate distribution
   - Pie chart showing asset distribution by beneficiary
   - Use Recharts or similar for charts
   - Color-coded by beneficiary
   - Show both percentage and estimated value

2. Create app/components/AssetFlowDiagram.tsx:
   - Sankey or flow diagram showing:
     - Left: Assets (House, Retirement, Bank, etc.)
     - Middle: How they transfer (Will, Trust, Beneficiary Designation)
     - Right: Who receives them
   - Highlight which assets bypass probate

3. Create app/components/BeneficiaryCards.tsx:
   - Card for each beneficiary showing:
     - Name and relationship
     - List of assets they receive
     - Estimated total value
     - Through what mechanism (will vs direct beneficiary)

4. Create visualization page at app/analysis/[estatePlanId]/visualization/page.tsx:
   - Header with estate plan name
   - Tab navigation: "Distribution" | "Timeline" | "Scenarios"
   - Distribution tab: pie chart + beneficiary cards
   - Timeline tab: when assets transfer (immediate vs trust distributions)
   - Scenarios tab: what-if analysis (spouse dies first, etc.)

5. Add "View Estate Distribution" button to analysis page linking to visualization

Important considerations:
- Clearly show which assets go through probate vs bypass it
- Highlight retirement accounts and house deeds that have their own beneficiaries
- Show warning if will beneficiaries conflict with account beneficiaries
```

#### 5.2 Beneficiary Designation Tracking
**Goal:** Track that "beneficiaries on retirement/house are not in the estate"

```
Files to modify:
- app/intake/[step]/assets/page.tsx
- convex/schema.ts (add beneficiaryDesignations table)
```

**Prompt for Claude Code:**
```
Add beneficiary designation tracking to highlight that some assets bypass the will:

1. Extend convex/schema.ts with beneficiaryDesignations table:
   - estatePlanId, assetType, assetName
   - primaryBeneficiary, contingentBeneficiary
   - percentageOrAmount, lastUpdated
   - institution (where account is held)

2. Update app/intake/[step]/assets/page.tsx:
   - For retirement accounts and real estate, add section:
     "Who is currently listed as beneficiary on this account?"
   - Primary beneficiary name/relationship
   - Contingent beneficiary (optional)
   - Add info box explaining:
     "These beneficiaries override your will. Make sure they match your wishes."

3. In gap analysis, add check for:
   - Beneficiary designations that conflict with will
   - Accounts without beneficiary designations
   - Ex-spouses still listed as beneficiaries

4. Add warning card in analysis page if conflicts detected:
   - Type: "inconsistency"
   - "Your 401(k) lists Jane Doe as beneficiary, but your will leaves assets to John Doe"
```

---

### Phase 6: Reminders & Update Tracking
**Goal:** "Calendar reminders for people to update their stuff"

#### 6.1 Create Reminder System
```
Files to create:
- app/components/ReminderSettings.tsx
- app/reminders/page.tsx
- convex/reminders.ts
- convex/remindersCron.ts
```

**Prompt for Claude Code:**
```
Create a reminder system for estate plan updates:

1. Add to convex/schema.ts:
   reminders: defineTable({
     estatePlanId: v.id("estatePlans"),
     type: v.union(v.literal("annual_review"), v.literal("life_event"), v.literal("document_update")),
     title: v.string(),
     description: v.string(),
     dueDate: v.number(), // timestamp
     status: v.union(v.literal("pending"), v.literal("sent"), v.literal("completed"), v.literal("dismissed")),
     emailSent: v.optional(v.boolean()),
     createdAt: v.number(),
   })

2. Create convex/reminders.ts with mutations:
   - createReminder(estatePlanId, type, title, dueDate)
   - updateReminderStatus(reminderId, status)
   - getUpcomingReminders(estatePlanId)
   - dismissReminder(reminderId)

3. Create app/components/ReminderSettings.tsx:
   - Toggle for annual review reminders
   - Custom reminder creation form
   - List of active reminders with dismiss/complete actions

4. Create app/reminders/page.tsx:
   - List of upcoming reminders grouped by timeframe:
     - This Week, This Month, This Quarter, This Year
   - Life event checklist:
     "Have any of these happened? Update your plan:"
     - Marriage/divorce
     - Birth/adoption of child
     - Death of beneficiary/executor
     - Major asset purchase/sale
     - Move to new state
     - Significant health change

5. Auto-create reminders when intake is completed:
   - Annual review (1 year from completion)
   - Document review (based on document ages from intake)
```

---

### Phase 7: Design System & UI Polish
**Goal:** Implement consistent, modern design following best practices

#### 7.1 Create Design System Components
```
Files to create:
- app/components/ui/Button.tsx
- app/components/ui/Card.tsx
- app/components/ui/Badge.tsx
- app/components/ui/Alert.tsx
- app/components/ui/Modal.tsx
- app/components/ui/Input.tsx
- app/components/ui/Select.tsx
- app/components/ui/Tabs.tsx
- app/styles/design-tokens.css
```

**Prompt for Claude Code:**
```
Create a cohesive design system for the estate planning app:

1. Create app/styles/design-tokens.css with CSS variables:
   - Colors: primary (trust blue), success (green), warning (amber), error (red)
   - Typography: font sizes, weights, line heights
   - Spacing: consistent scale (4, 8, 12, 16, 24, 32, 48, 64)
   - Border radius: sm, md, lg
   - Shadows: sm, md, lg
   - Transitions: fast (150ms), normal (300ms)

2. Create base UI components in app/components/ui/:

   Button.tsx:
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: sm, md, lg
   - States: loading (with spinner), disabled
   - Icons: optional left/right icon slots

   Card.tsx:
   - Variants: default, elevated, outlined
   - Optional header with title and actions
   - Optional footer
   - Hover state for interactive cards

   Badge.tsx:
   - Variants: default, success, warning, error, info
   - Sizes: sm, md
   - Optional dot indicator

   Alert.tsx:
   - Types: info, success, warning, error
   - Optional dismiss button
   - Optional action button
   - Icon based on type

   Modal.tsx:
   - Backdrop with click-outside-to-close
   - Header with close button
   - Scrollable content area
   - Footer with action buttons
   - Keyboard accessible (Escape to close, focus trap)

   Tabs.tsx:
   - Horizontal tab list
   - Active tab indicator
   - Optional icons on tabs
   - Controlled/uncontrolled modes

3. Update existing components to use the design system
4. Ensure all components are accessible (ARIA labels, keyboard nav, focus states)
```

#### 7.2 Improve Analysis Page Design
**Prompt for Claude Code:**
```
Redesign the analysis page for better visual hierarchy and usability:

1. Update app/analysis/[estatePlanId]/page.tsx:

   Hero Section:
   - Large score ring centered
   - Score interpretation text below (Excellent/Good/Needs Work/Critical)
   - Quick stats row: Documents Found, Issues Detected, Recommendations

   Tab Navigation:
   - Overview | Missing Documents | Issues | Recommendations | State Notes
   - Sticky tabs on scroll

   Overview Tab:
   - Summary cards with counts
   - Recent activity timeline
   - Quick action buttons

   Missing Documents Tab:
   - Grid of document cards
   - Each card shows: type, why needed, priority badge
   - "Generate" button (links to generation page)

   Issues Tab:
   - Expandable list of issues
   - Group by type: Outdated, Inconsistencies
   - Clear action items for each

   Recommendations Tab:
   - Prioritized list
   - Progress tracker for completed recommendations

2. Add print/export functionality:
   - "Download Report" button
   - PDF generation with summary

3. Mobile optimization:
   - Collapsible sections
   - Bottom sheet for details
   - Swipeable tabs
```

---

### Phase 8: State Law Compliance
**Goal:** Handle "state laws that are constantly changing"

#### 8.1 State-Specific Requirements Database
```
Files to create:
- lib/stateLaws.ts
- app/components/StateRequirements.tsx
```

**Prompt for Claude Code:**
```
Create a state law requirements system:

1. Create lib/stateLaws.ts with state-specific data:
   - Structure: { [stateCode]: StateLawInfo }
   - StateLawInfo includes:
     - witnessingRequirements: { willWitnesses: number, notaryRequired: boolean }
     - communityPropertyState: boolean
     - estateTaxThreshold: number | null
     - specialConsiderations: string[]
     - lastUpdated: string (for transparency)

   Example for California:
   {
     witnessingRequirements: { willWitnesses: 2, notaryRequired: false },
     communityPropertyState: true,
     estateTaxThreshold: null, // No state estate tax
     specialConsiderations: [
       "Community property state - spouse owns 50% of marital assets",
       "Holographic wills (handwritten) are valid if entirely in testator's handwriting"
     ]
   }

   Include data for all 50 states (key states: CA, TX, NY, FL, WA, AZ, NV, IL)

2. Create app/components/StateRequirements.tsx:
   - Display state-specific requirements based on intake state
   - Show in gap analysis under State Notes
   - Visual indicator for community property states
   - Warning for states with estate tax (if estate value exceeds threshold)

3. Integrate into gap analysis:
   - Check estate value against state thresholds
   - Recommend appropriate document type based on state
   - Flag if user moves between community/non-community property states

4. Add disclaimer: "State laws change. Consult an attorney in your state."
```

---

### Phase 9: Document Generation (Core Feature)
**Goal:** Actually generate the legal documents

#### 9.1 Document Templates & Generation
```
Files to create:
- convex/documentGeneration.ts
- lib/documentTemplates/will.ts
- lib/documentTemplates/trust.ts
- lib/documentTemplates/poa.ts
- app/documents/generate/[estatePlanId]/[type]/page.tsx
- app/components/DocumentPreview.tsx
- app/components/DocumentEditor.tsx
```

**Prompt for Claude Code:**
```
Implement the document generation system:

1. Create document template structures in lib/documentTemplates/:
   - Each template exports a function that takes intake data and returns document sections
   - Sections are structured with: title, content, instructions
   - Include placeholders for user-specific data
   - Add state-specific clauses based on residence state

2. Create convex/documentGeneration.ts action:
   - Input: estatePlanId, documentType
   - Fetch all intake data
   - Call Claude API to generate document content using templates
   - Structure prompt to:
     a) Fill in template with intake data
     b) Apply state-specific requirements
     c) Use plain language where possible
     d) Include standard legal boilerplate
   - Save generated document to documents table
   - Return document ID

3. Create app/documents/generate/[estatePlanId]/[type]/page.tsx:
   - Document type selection confirmation
   - "Generate Document" button
   - Loading state with progress messages
   - Preview of generated document
   - Edit capability before finalizing

4. Create app/components/DocumentPreview.tsx:
   - Styled document view (looks like legal doc)
   - Sections with headers
   - Highlighted fields that need review
   - Print-friendly styling

5. Create app/components/DocumentEditor.tsx:
   - Edit specific sections of generated doc
   - Track changes from original
   - Save revisions
   - Warning about unreviewed changes

6. Add download options:
   - PDF export (use react-pdf or similar)
   - Word document export
   - Plain text for attorney review

CRITICAL: Add prominent disclaimer:
"This document is a DRAFT for discussion purposes only.
It MUST be reviewed by a licensed attorney before signing.
[App name] is not a law firm and does not provide legal advice."
```

---

### Phase 10: Polish & Performance

#### 10.1 Loading States & Transitions
**Prompt for Claude Code:**
```
Add polished loading states and transitions throughout the app:

1. Create app/components/LoadingStates.tsx:
   - Skeleton components for each page type
   - Shimmer effect for loading cards
   - Spinner variants (small inline, large centered)
   - Progress bar for multi-step operations

2. Add page transitions:
   - Fade in on page load
   - Slide transitions in wizard steps
   - Use CSS transitions (not heavy JS libraries)

3. Optimize perceived performance:
   - Optimistic updates for form saves
   - Stale-while-revalidate pattern for data
   - Prefetch next wizard step data

4. Add empty states:
   - "No estate plans yet" with CTA
   - "No reminders set" with suggestion
   - "Analysis not run" with action button
```

#### 10.2 Mobile Optimization
**Prompt for Claude Code:**
```
Ensure excellent mobile experience:

1. Audit all pages for mobile usability:
   - Touch targets min 44x44px
   - Proper spacing between interactive elements
   - No horizontal scroll

2. Update navigation for mobile:
   - Bottom tab bar for primary navigation
   - Hamburger menu for secondary items
   - Swipe gestures in wizard

3. Form improvements for mobile:
   - Large input fields
   - Appropriate keyboard types (tel, email, number)
   - Auto-capitalize names
   - Date pickers instead of text inputs

4. Test and fix:
   - iOS Safari viewport issues
   - Android Chrome touch responsiveness
   - Notch/safe area handling
```

---

## Implementation Order

1. **Phase 7.1** - Design System (foundation for all UI work)
2. **Phase 4.2** - Intake Wizard UX improvements
3. **Phase 4.1** - Glossary & Tooltips (plain language)
4. **Phase 7.2** - Analysis Page redesign
5. **Phase 5.2** - Beneficiary Designation tracking
6. **Phase 5.1** - Estate Visualization
7. **Phase 6** - Reminders system
8. **Phase 8** - State Law compliance
9. **Phase 9** - Document Generation
10. **Phase 10** - Polish & Performance

---

## Key Lawyer Feedback Integration

| Feedback | Implementation |
|----------|----------------|
| "Turning financial part to easily digestible language" | Phase 4.1 - Glossary & Tooltips |
| "Beneficiaries on retirement/house not in estate" | Phase 5.2 - Beneficiary tracking with warnings |
| "Scan documents and show how estate will look upon death" | Phase 5.1 - Estate Visualization |
| "Calendar reminders for people to update their stuff" | Phase 6 - Reminders system |
| "State laws that are constantly changing" | Phase 8 - State Law database |
| "Basic and semi-complicated wills and trusts" | Phase 9 - Templated generation |
| Target: "$5M+ cross state exemptions" | Phase 8 - Estate tax threshold checks |

---

## Sources

- [Nielsen Norman Group: 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Nielsen Norman Group: Wizards Definition and Design](https://www.nngroup.com/articles/wizards/)
- [UI Patterns: Wizard Design Pattern](https://ui-patterns.com/patterns/Wizard)
- [UX Planet: Wizard Design Pattern](https://uxplanet.org/wizard-design-pattern-8c86e14f2a38)
- [Fair Patterns: Legal Document Design](https://www.fairpatterns.com/solutions/legal-document-design)

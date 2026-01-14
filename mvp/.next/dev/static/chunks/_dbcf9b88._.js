(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/glossaryData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Glossary of estate planning terms with plain English definitions
__turbopack_context__.s([
    "FORM_TERM_MAPPINGS",
    ()=>FORM_TERM_MAPPINGS,
    "GLOSSARY_CATEGORIES",
    ()=>GLOSSARY_CATEGORIES,
    "GLOSSARY_TERMS",
    ()=>GLOSSARY_TERMS,
    "getTermByName",
    ()=>getTermByName,
    "getTermsByCategory",
    ()=>getTermsByCategory,
    "searchTerms",
    ()=>searchTerms
]);
const GLOSSARY_CATEGORIES = {
    "estate-basics": {
        label: "Estate Basics",
        description: "Fundamental concepts in estate planning"
    },
    documents: {
        label: "Documents",
        description: "Legal documents used in estate planning"
    },
    beneficiaries: {
        label: "Beneficiaries & Roles",
        description: "People involved in your estate plan"
    },
    taxes: {
        label: "Taxes & Finances",
        description: "Tax-related terms and financial concepts"
    },
    healthcare: {
        label: "Healthcare Decisions",
        description: "Medical and end-of-life planning terms"
    },
    property: {
        label: "Property & Assets",
        description: "How property is owned and transferred"
    }
};
const GLOSSARY_TERMS = [
    // Estate Basics
    {
        term: "Estate",
        definition: "Everything you own at the time of your death, including money, property, investments, and personal belongings.",
        example: "John's estate includes his house, car, bank accounts, retirement funds, and personal items.",
        category: "estate-basics",
        relatedTerms: [
            "Probate",
            "Estate Plan"
        ]
    },
    {
        term: "Estate Plan",
        definition: "A collection of legal documents that specify how you want your assets distributed and medical decisions made if you can't make them yourself.",
        example: "A typical estate plan includes a will, power of attorney, and healthcare directive.",
        category: "estate-basics",
        relatedTerms: [
            "Will",
            "Trust",
            "Power of Attorney"
        ]
    },
    {
        term: "Probate",
        definition: "The legal process of proving a will is valid and distributing assets after someone dies. This happens in court and can take months to years.",
        example: "After Mary passed, her will went through probate for 8 months before her children received their inheritance.",
        category: "estate-basics",
        relatedTerms: [
            "Will",
            "Executor",
            "Trust"
        ]
    },
    {
        term: "Intestate",
        definition: "Dying without a valid will. When this happens, state law decides who gets your assets, which may not match your wishes.",
        example: "Because Tom died intestate, his assets went to his estranged brother instead of his longtime partner.",
        category: "estate-basics",
        relatedTerms: [
            "Will",
            "Probate"
        ]
    },
    // Documents
    {
        term: "Will",
        definition: "A legal document that states who should receive your property after you die and who should manage your estate. Also called a 'Last Will and Testament.'",
        example: "In her will, Susan left her house to her daughter and her savings to be split between her grandchildren.",
        category: "documents",
        relatedTerms: [
            "Executor",
            "Beneficiary",
            "Probate"
        ]
    },
    {
        term: "Trust",
        definition: "A legal arrangement where you transfer assets to a trustee who manages them for your beneficiaries. Trusts can avoid probate and provide more control over when and how assets are distributed.",
        example: "David set up a trust so his children would receive money gradually over 10 years rather than all at once.",
        category: "documents",
        relatedTerms: [
            "Trustee",
            "Beneficiary",
            "Revocable Living Trust"
        ]
    },
    {
        term: "Revocable Living Trust",
        definition: "A trust you create during your lifetime that you can change or cancel at any time. Assets in this trust avoid probate and transfer directly to beneficiaries.",
        example: "Lisa put her house in a revocable living trust so it would pass to her kids without going through probate.",
        category: "documents",
        relatedTerms: [
            "Trust",
            "Irrevocable Trust",
            "Probate"
        ]
    },
    {
        term: "Irrevocable Trust",
        definition: "A trust that generally cannot be changed or cancelled once created. Often used for tax planning or asset protection.",
        example: "To protect assets from potential lawsuits, Mark placed his investment property in an irrevocable trust.",
        category: "documents",
        relatedTerms: [
            "Trust",
            "Revocable Living Trust",
            "Estate Tax"
        ]
    },
    {
        term: "Power of Attorney",
        definition: "A legal document that gives someone you trust the authority to make decisions on your behalf. Can be for financial matters, healthcare, or both.",
        example: "Sarah's power of attorney allows her daughter to pay bills and manage her bank accounts if she becomes incapacitated.",
        category: "documents",
        relatedTerms: [
            "Agent",
            "Healthcare Proxy"
        ]
    },
    {
        term: "Healthcare Directive",
        definition: "A legal document that states your wishes for medical treatment if you can't communicate them yourself. Also called a 'Living Will' or 'Advance Directive.'",
        example: "Robert's healthcare directive specifies that he does not want to be kept on life support if there's no chance of recovery.",
        category: "documents",
        relatedTerms: [
            "Living Will",
            "Healthcare Proxy",
            "HIPAA Authorization"
        ]
    },
    {
        term: "Living Will",
        definition: "A document that specifies what medical treatments you do or don't want if you're terminally ill or permanently unconscious and can't speak for yourself.",
        example: "Maria's living will states she wants comfort care only, not aggressive treatment, if she's in a permanent vegetative state.",
        category: "documents",
        relatedTerms: [
            "Healthcare Directive",
            "Healthcare Proxy"
        ]
    },
    {
        term: "HIPAA Authorization",
        definition: "A form that allows specific people to access your medical records and speak with your doctors about your health. Without this, privacy laws prevent sharing your medical information.",
        example: "Thanks to the HIPAA authorization, James's wife could get updates from doctors during his hospital stay.",
        category: "documents",
        relatedTerms: [
            "Healthcare Directive",
            "Healthcare Proxy"
        ]
    },
    // Beneficiaries & Roles
    {
        term: "Beneficiary",
        definition: "A person or organization you choose to receive assets from your will, trust, life insurance, or retirement accounts.",
        example: "Emma named her two children as equal beneficiaries of her life insurance policy.",
        category: "beneficiaries",
        relatedTerms: [
            "Primary Beneficiary",
            "Contingent Beneficiary"
        ]
    },
    {
        term: "Primary Beneficiary",
        definition: "The first person or organization in line to receive your assets. They inherit first if they're alive when you pass.",
        example: "Tom's wife is the primary beneficiary of his 401(k) and will receive the full amount.",
        category: "beneficiaries",
        relatedTerms: [
            "Beneficiary",
            "Contingent Beneficiary"
        ]
    },
    {
        term: "Contingent Beneficiary",
        definition: "A backup beneficiary who receives assets only if the primary beneficiary dies before you or can't accept the inheritance.",
        example: "If Tom's wife passes before him, their children are contingent beneficiaries and will split the 401(k).",
        category: "beneficiaries",
        relatedTerms: [
            "Beneficiary",
            "Primary Beneficiary"
        ]
    },
    {
        term: "Executor",
        definition: "The person you name in your will to manage your estate after you die. They pay debts, file taxes, and distribute assets. Also called 'Personal Representative' in some states.",
        example: "As executor, Michael handled his mother's final affairs, including selling her house and distributing the proceeds.",
        category: "beneficiaries",
        relatedTerms: [
            "Will",
            "Probate",
            "Trustee"
        ]
    },
    {
        term: "Trustee",
        definition: "The person or institution responsible for managing a trust and its assets according to the trust's instructions.",
        example: "The bank serves as trustee, investing the trust funds and sending monthly checks to the beneficiaries.",
        category: "beneficiaries",
        relatedTerms: [
            "Trust",
            "Beneficiary",
            "Successor Trustee"
        ]
    },
    {
        term: "Successor Trustee",
        definition: "The person who takes over managing a trust if the original trustee can't serve anymore, due to death, incapacity, or resignation.",
        example: "When Dad could no longer manage his trust due to dementia, his daughter stepped in as successor trustee.",
        category: "beneficiaries",
        relatedTerms: [
            "Trustee",
            "Trust"
        ]
    },
    {
        term: "Guardian",
        definition: "A person you name in your will to care for your minor children if both parents die. The guardian makes daily decisions about their upbringing.",
        example: "The Smiths named Sarah's sister as guardian for their young children in case something happened to both of them.",
        category: "beneficiaries",
        relatedTerms: [
            "Will",
            "Minor"
        ]
    },
    {
        term: "Agent",
        definition: "The person you authorize to act on your behalf through a power of attorney. Also called 'Attorney-in-Fact.'",
        example: "As her agent, Jennifer can sign checks, pay bills, and make financial decisions for her elderly mother.",
        category: "beneficiaries",
        relatedTerms: [
            "Power of Attorney"
        ]
    },
    {
        term: "Healthcare Proxy",
        definition: "A person you name to make medical decisions for you if you're unable to make them yourself.",
        example: "When Chris was in a coma, his healthcare proxy (his wife) made the decision to proceed with surgery.",
        category: "beneficiaries",
        relatedTerms: [
            "Healthcare Directive",
            "Agent"
        ]
    },
    // Taxes & Finances
    {
        term: "Estate Tax",
        definition: "A tax on the transfer of property after death. Federal estate tax only applies to estates over $13.61 million (2024). Some states have lower thresholds.",
        example: "Because her estate was worth $15 million, federal estate tax was owed on the amount over the exemption.",
        category: "taxes",
        relatedTerms: [
            "Estate",
            "Inheritance Tax"
        ]
    },
    {
        term: "Inheritance Tax",
        definition: "A tax paid by the person who receives an inheritance. Only some states have this tax, and rates often depend on your relationship to the deceased.",
        example: "In Pennsylvania, John paid 4.5% inheritance tax on money he inherited from his father.",
        category: "taxes",
        relatedTerms: [
            "Estate Tax",
            "Beneficiary"
        ]
    },
    {
        term: "Gift Tax",
        definition: "A tax on giving large amounts of money or property to someone while you're alive. You can give up to $18,000 per person per year (2024) without triggering gift tax rules.",
        example: "Grandma gives each grandchild $18,000 annually for college, staying under the gift tax exclusion.",
        category: "taxes",
        relatedTerms: [
            "Estate Tax",
            "Annual Gift Exclusion"
        ]
    },
    {
        term: "Stepped-Up Basis",
        definition: "When you inherit an asset, its value for tax purposes 'steps up' to its value at the owner's death. This can significantly reduce capital gains taxes if you sell.",
        example: "Dad bought stock for $10,000, worth $100,000 when he died. Thanks to stepped-up basis, if I sell for $100,000, I owe no capital gains tax.",
        category: "taxes",
        relatedTerms: [
            "Capital Gains",
            "Inheritance"
        ]
    },
    // Healthcare
    {
        term: "DNR Order",
        definition: "Do Not Resuscitate - a medical order that tells healthcare providers not to perform CPR if your heart stops or you stop breathing.",
        example: "Given her terminal diagnosis, Grandma requested a DNR order to avoid aggressive intervention.",
        category: "healthcare",
        relatedTerms: [
            "Healthcare Directive",
            "Living Will"
        ]
    },
    {
        term: "Incapacity",
        definition: "Being unable to make decisions for yourself due to illness, injury, or mental condition. This is when your power of attorney and healthcare proxy become active.",
        example: "After his stroke, Tom was determined to be incapacitated, and his wife began making decisions using her power of attorney.",
        category: "healthcare",
        relatedTerms: [
            "Power of Attorney",
            "Healthcare Proxy"
        ]
    },
    {
        term: "Palliative Care",
        definition: "Medical care focused on comfort and quality of life rather than curing an illness. Can be provided alongside curative treatment.",
        example: "While continuing chemotherapy, Jane also received palliative care to manage pain and nausea.",
        category: "healthcare",
        relatedTerms: [
            "Hospice",
            "Healthcare Directive"
        ]
    },
    {
        term: "Hospice",
        definition: "End-of-life care focused on comfort when curative treatment is no longer pursued. Typically for patients with less than 6 months to live.",
        example: "When treatment options were exhausted, the family chose hospice care so Dad could be comfortable at home.",
        category: "healthcare",
        relatedTerms: [
            "Palliative Care",
            "Healthcare Directive"
        ]
    },
    // Property & Assets
    {
        term: "Community Property",
        definition: "In community property states, most assets acquired during marriage are owned 50/50 by both spouses, regardless of who earned the money.",
        example: "In California, even though only Mike worked, his salary and the house bought with it are community property owned equally by both spouses.",
        category: "property",
        relatedTerms: [
            "Separate Property",
            "Marital Property"
        ]
    },
    {
        term: "Separate Property",
        definition: "Assets owned by one spouse alone, typically property owned before marriage or received as a gift or inheritance during marriage.",
        example: "The inheritance Sarah received from her parents is her separate property, not shared with her husband.",
        category: "property",
        relatedTerms: [
            "Community Property",
            "Marital Property"
        ]
    },
    {
        term: "Joint Tenancy",
        definition: "A way of owning property with another person where, when one owner dies, their share automatically goes to the surviving owner(s) without probate.",
        example: "The couple owned their house in joint tenancy, so when the husband died, the wife automatically became sole owner.",
        category: "property",
        relatedTerms: [
            "Tenancy in Common",
            "Right of Survivorship"
        ]
    },
    {
        term: "Tenancy in Common",
        definition: "A way of owning property with others where each person owns a specific share that they can leave to anyone in their will. No automatic transfer to other owners.",
        example: "The three siblings own the beach house as tenants in common, each with a 1/3 share they can leave to their own children.",
        category: "property",
        relatedTerms: [
            "Joint Tenancy",
            "Probate"
        ]
    },
    {
        term: "Beneficiary Designation",
        definition: "The form you fill out for accounts like 401(k)s, IRAs, and life insurance that names who receives the money when you die. These override your will.",
        example: "Even though his will left everything to his wife, his 401(k) went to his ex-wife because he never updated the beneficiary designation.",
        category: "property",
        relatedTerms: [
            "Beneficiary",
            "Retirement Account"
        ]
    },
    {
        term: "Transfer on Death (TOD)",
        definition: "A designation you can add to certain accounts or property that allows them to pass directly to a named beneficiary when you die, without probate.",
        example: "By adding a TOD designation to his brokerage account, Dan ensured his daughter would receive the stocks immediately without court involvement.",
        category: "property",
        relatedTerms: [
            "Payable on Death",
            "Beneficiary Designation"
        ]
    },
    {
        term: "Payable on Death (POD)",
        definition: "Similar to TOD, a designation on bank accounts that names who receives the money when you die, bypassing probate.",
        example: "Linda added her son as POD beneficiary on her savings account so he could access the money right away after she passed.",
        category: "property",
        relatedTerms: [
            "Transfer on Death",
            "Beneficiary Designation"
        ]
    },
    {
        term: "Pour-Over Will",
        definition: "A will that works with a trust, directing that any assets not already in the trust at death should 'pour over' into it.",
        example: "The car she forgot to transfer to her trust was caught by the pour-over will and added to the trust through a simplified probate.",
        category: "documents",
        relatedTerms: [
            "Trust",
            "Will",
            "Revocable Living Trust"
        ]
    },
    {
        term: "Special Needs Trust",
        definition: "A trust designed to provide for a person with disabilities without disqualifying them from government benefits like Medicaid or SSI.",
        example: "To protect her son's disability benefits, Maria set up a special needs trust to supplement his care without counting as his assets.",
        category: "documents",
        relatedTerms: [
            "Trust",
            "Beneficiary"
        ]
    }
];
function getTermByName(termName) {
    return GLOSSARY_TERMS.find((t)=>t.term.toLowerCase() === termName.toLowerCase());
}
function getTermsByCategory(category) {
    return GLOSSARY_TERMS.filter((t)=>t.category === category);
}
function searchTerms(query) {
    const lowerQuery = query.toLowerCase();
    return GLOSSARY_TERMS.filter((t)=>t.term.toLowerCase().includes(lowerQuery) || t.definition.toLowerCase().includes(lowerQuery));
}
const FORM_TERM_MAPPINGS = {
    beneficiary: "Beneficiary",
    "primary beneficiary": "Primary Beneficiary",
    "contingent beneficiary": "Contingent Beneficiary",
    executor: "Executor",
    trustee: "Trustee",
    guardian: "Guardian",
    trust: "Trust",
    will: "Will",
    "power of attorney": "Power of Attorney",
    "healthcare directive": "Healthcare Directive",
    "living will": "Living Will",
    hipaa: "HIPAA Authorization",
    "healthcare proxy": "Healthcare Proxy",
    probate: "Probate",
    "estate tax": "Estate Tax",
    "community property": "Community Property",
    "joint tenancy": "Joint Tenancy",
    "beneficiary designation": "Beneficiary Designation",
    "special needs trust": "Special Needs Trust",
    "revocable living trust": "Revocable Living Trust",
    "irrevocable trust": "Irrevocable Trust"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ui/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Modal",
    ()=>Modal,
    "ModalContent",
    ()=>ModalContent,
    "ModalFooter",
    ()=>ModalFooter,
    "ModalHeader",
    ()=>ModalHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl"
};
const Modal = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ isOpen, onClose, size = "md", closeOnBackdrop = true, closeOnEscape = true, className = "", children, ...props }, ref)=>{
    _s();
    const handleEscape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Modal.useCallback[handleEscape]": (e)=>{
            if (e.key === "Escape" && closeOnEscape) {
                onClose();
            }
        }
    }["Modal.useCallback[handleEscape]"], [
        closeOnEscape,
        onClose
    ]);
    const handleBackdropClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Modal.useCallback[handleBackdropClick]": (e)=>{
            if (e.target === e.currentTarget && closeOnBackdrop) {
                onClose();
            }
        }
    }["Modal.useCallback[handleBackdropClick]"], [
        closeOnBackdrop,
        onClose
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>{
            if (isOpen) {
                document.addEventListener("keydown", handleEscape);
                document.body.style.overflow = "hidden";
            }
            return ({
                "Modal.useEffect": ()=>{
                    document.removeEventListener("keydown", handleEscape);
                    document.body.style.overflow = "";
                }
            })["Modal.useEffect"];
        }
    }["Modal.useEffect"], [
        isOpen,
        handleEscape
    ]);
    if (!isOpen) return null;
    const modalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[1040] flex items-center justify-center p-4",
        onClick: handleBackdropClick,
        role: "dialog",
        "aria-modal": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Modal.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: ref,
                className: `
            relative w-full ${sizeStyles[size]}
            bg-white dark:bg-gray-800
            rounded-xl shadow-xl
            animate-scaleIn
            max-h-[90vh] flex flex-col
            ${className}
          `,
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Modal.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Modal.tsx",
        lineNumber: 87,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(modalContent, document.body);
}, "66EPi08KtSd/qdjiNzieIu8z524=")), "66EPi08KtSd/qdjiNzieIu8z524=");
_c1 = Modal;
Modal.displayName = "Modal";
const ModalHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ title, description, onClose, className = "", children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `flex items-start justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-700 ${className}`,
        ...props,
        children: [
            title || description ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-gray-900 dark:text-white",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Modal.tsx",
                        lineNumber: 135,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Modal.tsx",
                        lineNumber: 140,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ui/Modal.tsx",
                lineNumber: 133,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : children,
            onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onClose,
                className: "flex-shrink-0 p-2 -m-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
                "aria-label": "Close modal",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M6 18L18 6M6 6l12 12"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Modal.tsx",
                        lineNumber: 154,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/ui/Modal.tsx",
                    lineNumber: 153,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Modal.tsx",
                lineNumber: 147,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Modal.tsx",
        lineNumber: 127,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = ModalHeader;
ModalHeader.displayName = "ModalHeader";
const ModalContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className = "", children, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `flex-1 overflow-y-auto p-6 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ui/Modal.tsx",
        lineNumber: 173,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c5 = ModalContent;
ModalContent.displayName = "ModalContent";
const ModalFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ align = "right", className = "", children, ...props }, ref)=>{
    const alignStyles = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `
          flex items-center gap-3 p-6
          border-t border-gray-200 dark:border-gray-700
          ${alignStyles[align]}
          ${className}
        `,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/ui/Modal.tsx",
        lineNumber: 195,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c7 = ModalFooter;
ModalFooter.displayName = "ModalFooter";
;
const __TURBOPACK__default__export__ = Modal;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Modal$forwardRef");
__turbopack_context__.k.register(_c1, "Modal");
__turbopack_context__.k.register(_c2, "ModalHeader$forwardRef");
__turbopack_context__.k.register(_c3, "ModalHeader");
__turbopack_context__.k.register(_c4, "ModalContent$forwardRef");
__turbopack_context__.k.register(_c5, "ModalContent");
__turbopack_context__.k.register(_c6, "ModalFooter$forwardRef");
__turbopack_context__.k.register(_c7, "ModalFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/Glossary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlossaryButton",
    ()=>GlossaryButton,
    "default",
    ()=>Glossary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/glossaryData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/Modal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function Glossary({ isOpen, onClose, initialTerm, initialCategory }) {
    _s();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCategory || "all");
    const [expandedTerm, setExpandedTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialTerm || null);
    // Filter terms based on search and category
    const filteredTerms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Glossary.useMemo[filteredTerms]": ()=>{
            let terms = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOSSARY_TERMS"];
            // Filter by category
            if (selectedCategory !== "all") {
                terms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTermsByCategory"])(selectedCategory);
            }
            // Filter by search query
            if (searchQuery.trim()) {
                const searchResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchTerms"])(searchQuery);
                terms = terms.filter({
                    "Glossary.useMemo[filteredTerms]": (t)=>searchResults.some({
                            "Glossary.useMemo[filteredTerms]": (sr)=>sr.term === t.term
                        }["Glossary.useMemo[filteredTerms]"])
                }["Glossary.useMemo[filteredTerms]"]);
            }
            // Sort alphabetically
            return terms.sort({
                "Glossary.useMemo[filteredTerms]": (a, b)=>a.term.localeCompare(b.term)
            }["Glossary.useMemo[filteredTerms]"]);
        }
    }["Glossary.useMemo[filteredTerms]"], [
        searchQuery,
        selectedCategory
    ]);
    // Group terms by category for display
    const groupedTerms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Glossary.useMemo[groupedTerms]": ()=>{
            if (selectedCategory !== "all") {
                return {
                    [selectedCategory]: filteredTerms
                };
            }
            const groups = {};
            filteredTerms.forEach({
                "Glossary.useMemo[groupedTerms]": (term)=>{
                    if (!groups[term.category]) {
                        groups[term.category] = [];
                    }
                    groups[term.category].push(term);
                }
            }["Glossary.useMemo[groupedTerms]"]);
            return groups;
        }
    }["Glossary.useMemo[groupedTerms]"], [
        filteredTerms,
        selectedCategory
    ]);
    const handleTermClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Glossary.useCallback[handleTermClick]": (termName)=>{
            setExpandedTerm({
                "Glossary.useCallback[handleTermClick]": (prev)=>prev === termName ? null : termName
            }["Glossary.useCallback[handleTermClick]"]);
        }
    }["Glossary.useCallback[handleTermClick]"], []);
    const categoryKeys = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOSSARY_CATEGORIES"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        title: "Estate Planning Glossary",
        size: "xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-[70vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sticky top-0 bg-white dark:bg-gray-800 pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search terms...",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Glossary.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this),
                                searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSearchQuery(""),
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Glossary.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Glossary.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedCategory("all"),
                                    className: `px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,
                                    children: [
                                        "All (",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOSSARY_TERMS"].length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this),
                                categoryKeys.map((cat)=>{
                                    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTermsByCategory"])(cat).length;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedCategory(cat),
                                        className: `px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`,
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOSSARY_CATEGORIES"][cat].label,
                                            " (",
                                            count,
                                            ")"
                                        ]
                                    }, cat, true, {
                                        fileName: "[project]/app/components/Glossary.tsx",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this);
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto py-4",
                    children: filteredTerms.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 text-gray-500 dark:text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 1.5,
                                    d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 166,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Glossary.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-medium",
                                children: "No terms found"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Glossary.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mt-1",
                                children: "Try adjusting your search or filter"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Glossary.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 159,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: Object.entries(groupedTerms).map(([category, terms])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    selectedCategory === "all" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$glossaryData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOSSARY_CATEGORIES"][category]?.label || category
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Glossary.tsx",
                                        lineNumber: 183,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: terms.map((term)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlossaryTermItem, {
                                                term: term,
                                                isExpanded: expandedTerm === term.term,
                                                onClick: ()=>handleTermClick(term.term),
                                                searchQuery: searchQuery
                                            }, term.term, false, {
                                                fileName: "[project]/app/components/Glossary.tsx",
                                                lineNumber: 189,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Glossary.tsx",
                                        lineNumber: 187,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, category, true, {
                                fileName: "[project]/app/components/Glossary.tsx",
                                lineNumber: 181,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 179,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-gray-200 dark:border-gray-700 pt-4 mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 dark:text-gray-400 text-center",
                        children: "These definitions are for educational purposes only and do not constitute legal advice. Consult a licensed attorney for specific guidance."
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Glossary.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Glossary.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(Glossary, "E7p2dvLI8lOLVU6hc65Mk1UVrdw=");
_c = Glossary;
function GlossaryTermItem({ term, isExpanded, onClick, searchQuery }) {
    // Highlight matching text
    const highlightText = (text)=>{
        if (!searchQuery.trim()) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i)=>regex.test(part) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mark", {
                className: "bg-yellow-200 dark:bg-yellow-800 rounded px-0.5",
                children: part
            }, i, false, {
                fileName: "[project]/app/components/Glossary.tsx",
                lineNumber: 238,
                columnNumber: 9
            }, this) : part);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `border rounded-lg transition-all ${isExpanded ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onClick,
                className: "w-full px-4 py-3 text-left flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-gray-900 dark:text-white",
                        children: highlightText(term.term)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Glossary.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 space-y-3 animate-fadeIn",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-300",
                        children: highlightText(term.definition)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    term.example && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Example:"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 289,
                                    columnNumber: 17
                                }, this),
                                " ",
                                term.example
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 288,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 287,
                        columnNumber: 13
                    }, this),
                    term.relatedTerms && term.relatedTerms.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500 dark:text-gray-400",
                                children: "Related terms:"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Glossary.tsx",
                                lineNumber: 296,
                                columnNumber: 15
                            }, this),
                            term.relatedTerms.map((related)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full",
                                    children: related
                                }, related, false, {
                                    fileName: "[project]/app/components/Glossary.tsx",
                                    lineNumber: 300,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 295,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Glossary.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Glossary.tsx",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
_c1 = GlossaryTermItem;
function GlossaryButton({ className = "", variant = "full" }) {
    _s1();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (variant === "icon") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>setIsOpen(true),
                    className: `p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400
                     dark:hover:text-blue-400 transition-colors ${className}`,
                    "aria-label": "Open glossary",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 341,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 340,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 333,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Glossary, {
                    isOpen: isOpen,
                    onClose: ()=>setIsOpen(false)
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 349,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    if (variant === "text") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>setIsOpen(true),
                    className: `text-blue-600 hover:text-blue-700 dark:text-blue-400
                     dark:hover:text-blue-300 hover:underline ${className}`,
                    children: "Glossary"
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 357,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Glossary, {
                    isOpen: isOpen,
                    onClose: ()=>setIsOpen(false)
                }, void 0, false, {
                    fileName: "[project]/app/components/Glossary.tsx",
                    lineNumber: 365,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setIsOpen(true),
                className: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                   text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
                   border border-gray-300 dark:border-gray-600 rounded-lg
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Glossary.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/Glossary.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this),
                    "Estate Planning Glossary"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Glossary.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Glossary, {
                isOpen: isOpen,
                onClose: ()=>setIsOpen(false)
            }, void 0, false, {
                fileName: "[project]/app/components/Glossary.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(GlossaryButton, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c2 = GlossaryButton;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Glossary");
__turbopack_context__.k.register(_c1, "GlossaryTermItem");
__turbopack_context__.k.register(_c2, "GlossaryButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=use-merged-ref.js.map
}),
"[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
} //# sourceMappingURL=error-once.js.map
}),
"[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/node_modules/next/dist/client/use-merged-ref.js [app-client] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils.js [app-client] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/node_modules/next/dist/client/add-base-path.js [app-client] (ecmascript)");
const _warnonce = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
const _links = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/links.js [app-client] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-client] (ecmascript)");
const _types = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/segment-cache/types.js [app-client] (ecmascript)");
const _erroronce = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/error-once.js [app-client] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate) {
    if (typeof window !== 'undefined') {
        const { nodeName } = e.currentTarget;
        // anchors inside an svg have a lowercase nodeName
        const isAnchorNodeName = nodeName.toUpperCase() === 'A';
        if (isAnchorNodeName && isModifiedEvent(e) || e.currentTarget.hasAttribute('download')) {
            // ignore click for browser’s default behavior
            return;
        }
        if (!(0, _islocalurl.isLocalURL)(href)) {
            if (replace) {
                // browser default behavior does not replace the history state
                // so we need to do it manually
                e.preventDefault();
                location.replace(href);
            }
            // ignore click for browser’s default behavior
            return;
        }
        e.preventDefault();
        if (onNavigate) {
            let isDefaultPrevented = false;
            onNavigate({
                preventDefault: ()=>{
                    isDefaultPrevented = true;
                }
            });
            if (isDefaultPrevented) {
                return;
            }
        }
        const { dispatchNavigateAction } = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/app-router-instance.js [app-client] (ecmascript)");
        _react.default.startTransition(()=>{
            dispatchNavigateAction(as || href, replace ? 'replace' : 'push', scroll ?? true, linkInstanceRef.current);
        });
    }
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const fetchStrategy = prefetchProp !== false ? getFetchStrategyFromPrefetchProp(prefetchProp) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (typeof window !== 'undefined' ? "\nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (props.locale) {
            (0, _warnonce.warnOnce)('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof hrefProp === 'string') {
                href = hrefProp;
            } else if (typeof hrefProp === 'object' && typeof hrefProp.pathname === 'string') {
                href = hrefProp.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    const { href, as } = _react.default.useMemo({
        "LinkComponent.useMemo": ()=>{
            const resolvedHref = formatStringOrUrl(hrefProp);
            return {
                href: resolvedHref,
                as: asProp ? formatStringOrUrl(asProp) : resolvedHref
            };
        }
    }["LinkComponent.useMemo"], [
        hrefProp,
        asProp
    ]);
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${hrefProp}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${hrefProp}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${hrefProp}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (typeof window !== 'undefined' ? " \nOpen your browser's console to view the Component stack trace." : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback({
        "LinkComponent.useCallback[observeLinkVisibilityOnMount]": (element)=>{
            if (router !== null) {
                linkInstanceRef.current = (0, _links.mountLinkInstance)(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus);
            }
            return ({
                "LinkComponent.useCallback[observeLinkVisibilityOnMount]": ()=>{
                    if (linkInstanceRef.current) {
                        (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                        linkInstanceRef.current = null;
                    }
                    (0, _links.unmountPrefetchableInstance)(element);
                }
            })["LinkComponent.useCallback[observeLinkVisibilityOnMount]"];
        }
    }["LinkComponent.useCallback[observeLinkVisibilityOnMount]"], [
        prefetchEnabled,
        href,
        router,
        fetchStrategy,
        setOptimisticLinkStatus
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, href, as, linkInstanceRef, replace, scroll, onNavigate);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, _erroronce.errorOnce)('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchProp(prefetchProp) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchProp === null || prefetchProp === 'auto' ? _types.FetchStrategy.PPR : // (although invalid values should've been filtered out by prop validation in dev)
        _types.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=link.js.map
}),
]);

//# sourceMappingURL=_dbcf9b88._.js.map
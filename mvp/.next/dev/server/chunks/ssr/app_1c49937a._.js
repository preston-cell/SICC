module.exports = [
"[project]/app/components/IntakeProgress.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STEPS",
    ()=>STEPS,
    "default",
    ()=>IntakeProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
const STEPS = [
    {
        id: "personal",
        name: "Personal",
        fullName: "Personal Information",
        description: "Your basic information",
        path: "/intake/personal"
    },
    {
        id: "family",
        name: "Family",
        fullName: "Family Members",
        description: "Spouse, children, dependents",
        path: "/intake/family"
    },
    {
        id: "assets",
        name: "Assets",
        fullName: "Assets & Property",
        description: "Property, accounts, valuables",
        path: "/intake/assets"
    },
    {
        id: "existing",
        name: "Documents",
        fullName: "Existing Documents",
        description: "Current estate planning docs",
        path: "/intake/existing"
    },
    {
        id: "goals",
        name: "Goals",
        fullName: "Goals & Wishes",
        description: "Your estate planning wishes",
        path: "/intake/goals"
    }
];
function IntakeProgress({ currentStep, completedSteps, estatePlanId }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentIndex = STEPS.findIndex((s)=>s.id === currentStep);
    const handleStepClick = (step, index)=>{
        const isComplete = completedSteps.has(step.id);
        const isCurrent = step.id === currentStep;
        const isPast = index < currentIndex;
        // Only allow navigation to completed steps or previous steps
        if (isComplete || isPast || isCurrent) {
            router.push(`${step.path}?planId=${estatePlanId}`);
        }
    };
    const canNavigate = (step, index)=>{
        const isComplete = completedSteps.has(step.id);
        const isCurrent = step.id === currentStep;
        const isPast = index < currentIndex;
        return isComplete || isPast || isCurrent;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    "aria-label": "Progress",
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700",
                            style: {
                                left: '2.5rem',
                                right: '2.5rem'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/IntakeProgress.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-5 h-0.5 bg-blue-600 transition-all duration-500",
                            style: {
                                left: '2.5rem',
                                width: `calc(${currentIndex / (STEPS.length - 1) * 100}% - 2.5rem)`
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/IntakeProgress.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "relative flex items-start justify-between",
                            children: STEPS.map((step, index)=>{
                                const isComplete = completedSteps.has(step.id);
                                const isCurrent = step.id === currentStep;
                                const isPast = index < currentIndex;
                                const isClickable = canNavigate(step, index);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "flex flex-col items-center relative z-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleStepClick(step, index),
                                            disabled: !isClickable,
                                            className: `
                      relative flex h-10 w-10 items-center justify-center rounded-full
                      transition-all duration-200 bg-white dark:bg-gray-800
                      ${isComplete ? "bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900/30" : isCurrent ? "border-2 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30" : "border-2 border-gray-300 dark:border-gray-600"}
                      ${isClickable && !isCurrent ? "cursor-pointer hover:ring-4 hover:ring-gray-100 dark:hover:ring-gray-700" : ""}
                      ${!isClickable ? "cursor-not-allowed opacity-60" : ""}
                    `,
                                            "aria-current": isCurrent ? "step" : undefined,
                                            children: isComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-white",
                                                viewBox: "0 0 20 20",
                                                fill: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                    clipRule: "evenodd"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/IntakeProgress.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                                lineNumber: 131,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm font-semibold ${isCurrent ? "text-blue-600" : "text-gray-500 dark:text-gray-400"}`,
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                                lineNumber: 139,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/IntakeProgress.tsx",
                                            lineNumber: 112,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-sm font-medium block ${isCurrent ? "text-blue-600 dark:text-blue-400" : isComplete ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`,
                                                    children: step.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/IntakeProgress.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-[100px] hidden lg:block",
                                                    children: step.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/IntakeProgress.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/IntakeProgress.tsx",
                                            lineNumber: 152,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, step.id, true, {
                                    fileName: "[project]/app/components/IntakeProgress.tsx",
                                    lineNumber: 111,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/components/IntakeProgress.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/IntakeProgress.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/IntakeProgress.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "md:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide",
                                        children: [
                                            "Step ",
                                            currentIndex + 1,
                                            " of ",
                                            STEPS.length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/IntakeProgress.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500 dark:text-gray-400",
                                        children: [
                                            Math.round((currentIndex + 1) / STEPS.length * 100),
                                            "% complete"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/IntakeProgress.tsx",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900 dark:text-white",
                                children: STEPS[currentIndex].fullName
                            }, void 0, false, {
                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 dark:text-gray-400 mt-1",
                                children: STEPS[currentIndex].description
                            }, void 0, false, {
                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/IntakeProgress.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-blue-600 h-2 rounded-full transition-all duration-500",
                            style: {
                                width: `${(currentIndex + 1) / STEPS.length * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/IntakeProgress.tsx",
                            lineNumber: 197,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/IntakeProgress.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 overflow-x-auto pb-2 -mx-1 px-1",
                        children: STEPS.map((step, index)=>{
                            const isComplete = completedSteps.has(step.id);
                            const isCurrent = step.id === currentStep;
                            const isClickable = canNavigate(step, index);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleStepClick(step, index),
                                disabled: !isClickable,
                                className: `
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${isComplete ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : isCurrent ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}
                  ${!isClickable ? "opacity-50 cursor-not-allowed" : ""}
                `,
                                children: [
                                    isComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mr-1",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/IntakeProgress.tsx",
                                        lineNumber: 229,
                                        columnNumber: 19
                                    }, this),
                                    step.name
                                ]
                            }, step.id, true, {
                                fileName: "[project]/app/components/IntakeProgress.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/IntakeProgress.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/IntakeProgress.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/IntakeProgress.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/app/components/SaveIndicator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SaveIndicatorInline",
    ()=>SaveIndicatorInline,
    "default",
    ()=>SaveIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function SaveIndicator({ status, lastSaved, errorMessage }) {
    const [showSaved, setShowSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Show "Saved" message briefly after save completes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (status === "saved") {
            setShowSaved(true);
            const timer = setTimeout(()=>{
                setShowSaved(false);
            }, 3000);
            return ()=>clearTimeout(timer);
        }
    }, [
        status
    ]);
    const formatTime = (date)=>{
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    if (status === "idle" && !lastSaved && !showSaved) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
        transition-all duration-300
        ${status === "saving" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : status === "error" ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" : showSaved ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}
      `,
        children: status === "saving" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SaveIndicator.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SaveIndicator.tsx",
                            lineNumber: 65,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "Saving..."
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : status === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SaveIndicator.tsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: errorMessage || "Failed to save"
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 82,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : showSaved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SaveIndicator.tsx",
                        lineNumber: 87,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: "All changes saved"
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : lastSaved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SaveIndicator.tsx",
                        lineNumber: 98,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Last saved ",
                        formatTime(lastSaved)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 105,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : null
    }, void 0, false, {
        fileName: "[project]/app/components/SaveIndicator.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
function SaveIndicatorInline({ status, lastSaved }) {
    if (status === "saving") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-3 h-3 animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SaveIndicator.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SaveIndicator.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this),
                "Saving..."
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/SaveIndicator.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this);
    }
    if (status === "saved") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-3 h-3",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SaveIndicator.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this),
                "Saved"
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/SaveIndicator.tsx",
            lineNumber: 145,
            columnNumber: 7
        }, this);
    }
    if (status === "error") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-3 h-3",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SaveIndicator.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/SaveIndicator.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                "Error saving"
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/SaveIndicator.tsx",
            lineNumber: 160,
            columnNumber: 7
        }, this);
    }
    return null;
}
}),
"[project]/app/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 dark:disabled:bg-blue-800",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-600",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:border-gray-200 disabled:text-gray-400 dark:disabled:border-gray-700 dark:disabled:text-gray-600",
    ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 dark:disabled:bg-red-800"
};
const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5"
};
const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
};
const Spinner = ({ size })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `animate-spin ${iconSizes[size]}`,
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Button.tsx",
                lineNumber: 49,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Button.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Button.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, fullWidth = false, disabled, className = "", children, ...props }, ref)=>{
    const isDisabled = disabled || isLoading;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        disabled: isDisabled,
        className: `
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-colors duration-150 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-gray-900
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `,
        ...props,
        children: [
            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                size: size
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Button.tsx",
                lineNumber: 102,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : leftIcon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: iconSizes[size],
                children: leftIcon
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Button.tsx",
                lineNumber: 104,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : null,
            children,
            !isLoading && rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: iconSizes[size],
                children: rightIcon
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Button.tsx",
                lineNumber: 108,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Button.tsx",
        lineNumber: 84,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
const __TURBOPACK__default__export__ = Button;
}),
"[project]/app/components/IntakeNavigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>IntakeNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/IntakeProgress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SaveIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SaveIndicator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/Button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function IntakeNavigation({ currentStep, estatePlanId, onSaveAndExit, onSaveAndContinue, isSubmitting, canContinue, saveStatus = "idle", lastSaved, nextStepLabel, isLastStep = false }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentIndex = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STEPS"].findIndex((s)=>s.id === currentStep);
    const isFirstStep = currentIndex === 0;
    const previousStep = isFirstStep ? null : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STEPS"][currentIndex - 1];
    const handleBack = ()=>{
        if (previousStep) {
            router.push(`${previousStep.path}?planId=${estatePlanId}`);
        }
    };
    // Get the continue button label
    const getContinueLabel = ()=>{
        if (isSubmitting) return "Saving...";
        if (nextStepLabel) return nextStepLabel;
        if (isLastStep) return "Complete Intake";
        const nextStep = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STEPS"][currentIndex + 1];
        return nextStep ? `Continue to ${nextStep.name}` : "Complete";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SaveIndicator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    status: saveStatus,
                    lastSaved: lastSaved
                }, void 0, false, {
                    fileName: "[project]/app/components/IntakeNavigation.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/IntakeNavigation.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full sm:w-auto order-2 sm:order-1",
                        children: !isFirstStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            variant: "ghost",
                            onClick: handleBack,
                            disabled: isSubmitting,
                            leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 19l-7-7 7-7"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/IntakeNavigation.tsx",
                                    lineNumber: 74,
                                    columnNumber: 19
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/app/components/IntakeNavigation.tsx",
                                lineNumber: 73,
                                columnNumber: 17
                            }, void 0),
                            fullWidth: true,
                            className: "sm:w-auto",
                            children: [
                                "Back to ",
                                previousStep?.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/IntakeNavigation.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                            fileName: "[project]/app/components/IntakeNavigation.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/IntakeNavigation.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "outline",
                                onClick: onSaveAndExit,
                                disabled: isSubmitting,
                                fullWidth: true,
                                className: "sm:w-auto",
                                children: "Save & Exit"
                            }, void 0, false, {
                                fileName: "[project]/app/components/IntakeNavigation.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                variant: "primary",
                                onClick: onSaveAndContinue,
                                disabled: isSubmitting || !canContinue,
                                isLoading: isSubmitting,
                                rightIcon: !isSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M9 5l7 7-7 7"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/IntakeNavigation.tsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/IntakeNavigation.tsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, void 0),
                                fullWidth: true,
                                className: "sm:w-auto",
                                children: getContinueLabel()
                            }, void 0, false, {
                                fileName: "[project]/app/components/IntakeNavigation.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/IntakeNavigation.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/IntakeNavigation.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            !canContinue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-amber-600 dark:text-amber-400 text-center sm:text-right",
                children: "Please complete all required fields to continue"
            }, void 0, false, {
                fileName: "[project]/app/components/IntakeNavigation.tsx",
                lineNumber: 121,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/IntakeNavigation.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/FormFields.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox,
    "CurrencyInput",
    ()=>CurrencyInput,
    "FormField",
    ()=>FormField,
    "FormSection",
    ()=>FormSection,
    "InfoBox",
    ()=>InfoBox,
    "RadioGroup",
    ()=>RadioGroup,
    "Select",
    ()=>Select,
    "TextArea",
    ()=>TextArea,
    "TextInput",
    ()=>TextInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function FormField({ label, required, error, hint, helpText, showSuccess, children }) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const hasError = !!error;
    const showSuccessState = showSuccess && !hasError;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: id,
                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                        children: [
                            label,
                            required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-500 ml-1",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 36,
                                columnNumber: 24
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    showSuccessState && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center text-xs text-green-600 dark:text-green-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-3.5 h-3.5 mr-1",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/FormFields.tsx",
                                    lineNumber: 41,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this),
                            "Valid"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            helpText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }, void 0, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    helpText
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, this),
            children,
            hint && !error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 dark:text-gray-400",
                children: hint
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-500 flex items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-3.5 h-3.5",
                        fill: "currentColor",
                        viewBox: "0 0 20 20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            fillRule: "evenodd",
                            d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                            clipRule: "evenodd"
                        }, void 0, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
function TextInput({ value, onChange, placeholder, type = "text", disabled, required, error, success, autoComplete, inputMode, pattern, maxLength, name }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        name: name,
        value: value,
        onChange: (e)=>onChange(e.target.value),
        placeholder: placeholder,
        disabled: disabled,
        required: required,
        autoComplete: autoComplete,
        inputMode: inputMode,
        pattern: pattern,
        maxLength: maxLength,
        className: `
        w-full px-3 py-2.5 border rounded-lg
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-0
        disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : success ? "border-green-500 focus:ring-green-500 focus:border-green-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
      `
    }, void 0, false, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
function Select({ value, onChange, options, placeholder, disabled, error, success, name }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                name: name,
                value: value,
                onChange: (e)=>onChange(e.target.value),
                disabled: disabled,
                className: `
          w-full px-3 py-2.5 border rounded-lg appearance-none
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : success ? "border-green-500 focus:ring-green-500 focus:border-green-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
        `,
                children: [
                    placeholder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        disabled: true,
                        children: placeholder
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: opt.value,
                            children: opt.label
                        }, opt.value, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M19 9l-7 7-7-7"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/FormFields.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
function RadioGroup({ value, onChange, options, name, disabled, columns = 1 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `grid gap-3 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`,
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: `
            relative flex items-start p-4 border-2 rounded-xl cursor-pointer
            transition-all duration-200
            ${value === opt.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "radio",
                        name: name,
                        value: opt.value,
                        checked: value === opt.value,
                        onChange: (e)=>onChange(e.target.value),
                        disabled: disabled,
                        className: "mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 240,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "ml-3 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm font-medium ${value === opt.value ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`,
                                children: opt.label
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this),
                            opt.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-xs mt-0.5 ${value === opt.value ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`,
                                children: opt.description
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    value === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-3 right-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5 text-blue-600",
                            fill: "currentColor",
                            viewBox: "0 0 20 20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                fillRule: "evenodd",
                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                clipRule: "evenodd"
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 262,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 261,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 260,
                        columnNumber: 13
                    }, this)
                ]
            }, opt.value, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 226,
        columnNumber: 5
    }, this);
}
function Checkbox({ checked, onChange, label, description, disabled }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: `
        relative flex items-start p-4 border-2 rounded-xl cursor-pointer
        transition-all duration-200
        ${checked ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked,
                onChange: (e)=>onChange(e.target.checked),
                disabled: disabled,
                className: "mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ml-3 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-sm font-medium ${checked ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`,
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-xs mt-0.5 ${checked ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`,
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            checked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-3 right-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-5 h-5 text-blue-600",
                    fill: "currentColor",
                    viewBox: "0 0 20 20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        fillRule: "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                        clipRule: "evenodd"
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 317,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/FormFields.tsx",
                    lineNumber: 316,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
function TextArea({ value, onChange, placeholder, rows = 3, disabled, error, success, maxLength, showCount }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: value,
                onChange: (e)=>onChange(e.target.value),
                placeholder: placeholder,
                rows: rows,
                disabled: disabled,
                maxLength: maxLength,
                className: `
          w-full px-3 py-2.5 border rounded-lg resize-none
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : success ? "border-green-500 focus:ring-green-500 focus:border-green-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
        `
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 354,
                columnNumber: 7
            }, this),
            showCount && maxLength && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-2 right-3 text-xs text-gray-400",
                children: [
                    value.length,
                    "/",
                    maxLength
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 377,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 353,
        columnNumber: 5
    }, this);
}
function FormSection({ title, description, children, badge }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-gray-200 dark:border-gray-700 pb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/app/components/FormFields.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            badge
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-gray-500 dark:text-gray-400 mt-1",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/app/components/FormFields.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: children
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 401,
        columnNumber: 5
    }, this);
}
function CurrencyInput({ value, onChange, placeholder = "0.00", disabled, error }) {
    const handleChange = (inputValue)=>{
        // Remove non-numeric characters except decimal
        const cleaned = inputValue.replace(/[^0-9.]/g, "");
        // Ensure only one decimal point
        const parts = cleaned.split(".");
        if (parts.length > 2) return;
        if (parts[1]?.length > 2) return;
        onChange(cleaned);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400",
                children: "$"
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 444,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                inputMode: "decimal",
                value: value,
                onChange: (e)=>handleChange(e.target.value),
                placeholder: placeholder,
                disabled: disabled,
                className: `
          w-full pl-7 pr-3 py-2.5 border rounded-lg
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"}
        `
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 447,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 443,
        columnNumber: 5
    }, this);
}
function InfoBox({ type = "info", title, children }) {
    const styles = {
        info: {
            container: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
            icon: "text-blue-600 dark:text-blue-400",
            title: "text-blue-800 dark:text-blue-200"
        },
        warning: {
            container: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
            icon: "text-amber-600 dark:text-amber-400",
            title: "text-amber-800 dark:text-amber-200"
        },
        tip: {
            container: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
            icon: "text-green-600 dark:text-green-400",
            title: "text-green-800 dark:text-green-200"
        }
    };
    const icons = {
        info: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 500,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/FormFields.tsx",
            lineNumber: 499,
            columnNumber: 7
        }, this),
        warning: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 505,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/FormFields.tsx",
            lineNumber: 504,
            columnNumber: 7
        }, this),
        tip: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            }, void 0, false, {
                fileName: "[project]/app/components/FormFields.tsx",
                lineNumber: 510,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/FormFields.tsx",
            lineNumber: 509,
            columnNumber: 7
        }, this)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-lg border p-4 ${styles[type].container}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex-shrink-0 ${styles[type].icon}`,
                    children: icons[type]
                }, void 0, false, {
                    fileName: "[project]/app/components/FormFields.tsx",
                    lineNumber: 518,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-w-0",
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: `font-medium mb-1 ${styles[type].title}`,
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 521,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-gray-700 dark:text-gray-300",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/app/components/FormFields.tsx",
                            lineNumber: 523,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/FormFields.tsx",
                    lineNumber: 519,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/FormFields.tsx",
            lineNumber: 517,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/FormFields.tsx",
        lineNumber: 516,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/intake/useIntakeForm.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "US_STATES",
    ()=>US_STATES,
    "getCurrentYear",
    ()=>getCurrentYear,
    "getExampleYear",
    ()=>getExampleYear,
    "useIntakeForm",
    ()=>useIntakeForm,
    "useOtherSectionData",
    ()=>useOtherSectionData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/convex/dist/esm/react/client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/convex/_generated/api.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// Map URL step names to database section names
const STEP_TO_SECTION = {
    personal: "personal",
    family: "family",
    assets: "assets",
    existing: "existing_documents",
    goals: "goals"
};
// Map to next step with descriptive labels
const STEP_CONFIG = {
    personal: {
        next: "family",
        nextLabel: "Continue to Family"
    },
    family: {
        next: "assets",
        nextLabel: "Continue to Assets"
    },
    assets: {
        next: "existing",
        nextLabel: "Continue to Documents"
    },
    existing: {
        next: "goals",
        nextLabel: "Continue to Goals"
    },
    goals: {
        next: "complete",
        nextLabel: "Review & Complete"
    }
};
// Debounce delay in milliseconds
const AUTO_SAVE_DELAY = 2000;
function getCurrentYear() {
    return new Date().getFullYear();
}
function getExampleYear() {
    return String(new Date().getFullYear() - 1);
}
function useIntakeForm(step, defaultData) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const planId = searchParams.get("planId");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultData);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasChanges, setHasChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [lastSaved, setLastSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [extractedFields, setExtractedFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [dataInitialized, setDataInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Refs for auto-save
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const formDataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(formData);
    // Keep formDataRef in sync
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        formDataRef.current = formData;
    }, [
        formData
    ]);
    // Convert planId to proper type
    const estatePlanId = planId;
    // Fetch existing intake data
    const existingData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].queries.getIntakeSection, estatePlanId ? {
        estatePlanId,
        section: STEP_TO_SECTION[step]
    } : "skip");
    // Fetch extracted data for pre-fill
    const extractedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].extractedData.getExtractedDataBySection, estatePlanId ? {
        estatePlanId,
        section: STEP_TO_SECTION[step]
    } : "skip");
    // Fetch intake progress
    const progress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].queries.getIntakeProgress, estatePlanId ? {
        estatePlanId
    } : "skip");
    // Mutation to save intake data
    const updateIntakeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].estatePlanning.updateIntakeData);
    // Merge extracted data with existing/default data
    // Priority: existing manual data > extracted data > default
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Wait until both queries have resolved
        if (existingData === undefined || extractedData === undefined) {
            return;
        }
        // Only initialize once
        if (dataInitialized) {
            return;
        }
        let manualData = {};
        let extractedValues = {};
        // Parse existing manual data if available
        if (existingData?.data) {
            try {
                manualData = JSON.parse(existingData.data);
            } catch (e) {
                console.error("Failed to parse existing intake data:", e);
            }
        }
        // Parse extracted data if available
        if (extractedData?.parsedData) {
            extractedValues = extractedData.parsedData;
        }
        // Merge: default -> extracted -> manual
        const merged = {
            ...defaultData
        };
        const newExtractedFields = new Set();
        // Apply extracted values first
        for (const [key, value] of Object.entries(extractedValues)){
            if (value !== undefined && value !== null && value !== "") {
                merged[key] = value;
                newExtractedFields.add(key);
            }
        }
        // Apply manual values (override extracted)
        for (const [key, value] of Object.entries(manualData)){
            if (value !== undefined && value !== null && value !== "") {
                merged[key] = value;
                // If manual value differs from extracted, remove from extracted set
                if (extractedValues[key] !== value) {
                    newExtractedFields.delete(key);
                }
            }
        }
        setFormData(merged);
        formDataRef.current = merged;
        setExtractedFields(newExtractedFields);
        setDataInitialized(true);
    }, [
        existingData,
        extractedData,
        defaultData,
        dataInitialized
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    // Internal save function
    const doSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (data, markComplete = false)=>{
        if (!estatePlanId) {
            console.error("No estate plan ID");
            return false;
        }
        setSaveStatus("saving");
        setSaveError(null);
        try {
            await updateIntakeData({
                estatePlanId,
                section: STEP_TO_SECTION[step],
                data: JSON.stringify(data),
                isComplete: markComplete
            });
            setHasChanges(false);
            setSaveStatus("saved");
            setLastSaved(new Date());
            return true;
        } catch (error) {
            console.error("Failed to save intake data:", error);
            setSaveStatus("error");
            setSaveError(error instanceof Error ? error.message : "Failed to save");
            return false;
        }
    }, [
        estatePlanId,
        step,
        updateIntakeData
    ]);
    // Debounced auto-save
    const triggerAutoSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        // Set new timeout for auto-save
        saveTimeoutRef.current = setTimeout(async ()=>{
            await doSave(formDataRef.current, false);
        }, AUTO_SAVE_DELAY);
    }, [
        doSave
    ]);
    // Update form field with auto-save
    const updateField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field, value)=>{
        setFormData((prev)=>{
            const updated = {
                ...prev,
                [field]: value
            };
            return updated;
        });
        setHasChanges(true);
        setSaveStatus("idle");
        triggerAutoSave();
    }, [
        triggerAutoSave
    ]);
    // Manual save (without marking complete)
    const save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Cancel pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setIsSubmitting(true);
        try {
            await doSave(formData, false);
        } finally{
            setIsSubmitting(false);
        }
    }, [
        doSave,
        formData
    ]);
    // Save and continue to next step
    const saveAndContinue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Cancel pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setIsSubmitting(true);
        try {
            const success = await doSave(formData, true);
            if (success) {
                const config = STEP_CONFIG[step];
                if (config.next === "complete") {
                    // Go to gap analysis or summary
                    router.push(`/intake?planId=${planId}&complete=true`);
                } else {
                    router.push(`/intake/${config.next}?planId=${planId}`);
                }
            }
        } finally{
            setIsSubmitting(false);
        }
    }, [
        doSave,
        formData,
        step,
        router,
        planId
    ]);
    // Save and exit to intake landing
    const saveAndExit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        // Cancel pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setIsSubmitting(true);
        try {
            await doSave(formData, false);
            router.push(`/intake?planId=${planId}`);
        } finally{
            setIsSubmitting(false);
        }
    }, [
        doSave,
        formData,
        router,
        planId
    ]);
    // Get completed steps as a Set
    const completedSteps = new Set();
    if (progress?.sections) {
        for (const [section, status] of Object.entries(progress.sections)){
            if (status.isComplete) {
                // Reverse map section to step
                const stepEntry = Object.entries(STEP_TO_SECTION).find(([_, sec])=>sec === section);
                if (stepEntry) {
                    completedSteps.add(stepEntry[0]);
                }
            }
        }
    }
    // Get step configuration
    const stepConfig = STEP_CONFIG[step];
    // Check if a field was pre-filled from extraction
    const isFieldExtracted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((field)=>{
        return extractedFields.has(field);
    }, [
        extractedFields
    ]);
    // Get extraction confidence for this section
    const extractionConfidence = extractedData?.confidence;
    return {
        formData,
        setFormData,
        updateField,
        save,
        saveAndContinue,
        saveAndExit,
        isSubmitting,
        hasChanges,
        estatePlanId,
        completedSteps,
        progress,
        isLoading: existingData === undefined || extractedData === undefined || !dataInitialized,
        // Auto-save related
        saveStatus,
        lastSaved,
        saveError,
        // Step navigation
        nextStepLabel: stepConfig.nextLabel,
        isLastStep: stepConfig.next === "complete",
        // Extraction related
        extractedFields,
        isFieldExtracted,
        extractionConfidence,
        hasExtractedData: extractedFields.size > 0
    };
}
const US_STATES = [
    {
        value: "AL",
        label: "Alabama"
    },
    {
        value: "AK",
        label: "Alaska"
    },
    {
        value: "AZ",
        label: "Arizona"
    },
    {
        value: "AR",
        label: "Arkansas"
    },
    {
        value: "CA",
        label: "California"
    },
    {
        value: "CO",
        label: "Colorado"
    },
    {
        value: "CT",
        label: "Connecticut"
    },
    {
        value: "DE",
        label: "Delaware"
    },
    {
        value: "FL",
        label: "Florida"
    },
    {
        value: "GA",
        label: "Georgia"
    },
    {
        value: "HI",
        label: "Hawaii"
    },
    {
        value: "ID",
        label: "Idaho"
    },
    {
        value: "IL",
        label: "Illinois"
    },
    {
        value: "IN",
        label: "Indiana"
    },
    {
        value: "IA",
        label: "Iowa"
    },
    {
        value: "KS",
        label: "Kansas"
    },
    {
        value: "KY",
        label: "Kentucky"
    },
    {
        value: "LA",
        label: "Louisiana"
    },
    {
        value: "ME",
        label: "Maine"
    },
    {
        value: "MD",
        label: "Maryland"
    },
    {
        value: "MA",
        label: "Massachusetts"
    },
    {
        value: "MI",
        label: "Michigan"
    },
    {
        value: "MN",
        label: "Minnesota"
    },
    {
        value: "MS",
        label: "Mississippi"
    },
    {
        value: "MO",
        label: "Missouri"
    },
    {
        value: "MT",
        label: "Montana"
    },
    {
        value: "NE",
        label: "Nebraska"
    },
    {
        value: "NV",
        label: "Nevada"
    },
    {
        value: "NH",
        label: "New Hampshire"
    },
    {
        value: "NJ",
        label: "New Jersey"
    },
    {
        value: "NM",
        label: "New Mexico"
    },
    {
        value: "NY",
        label: "New York"
    },
    {
        value: "NC",
        label: "North Carolina"
    },
    {
        value: "ND",
        label: "North Dakota"
    },
    {
        value: "OH",
        label: "Ohio"
    },
    {
        value: "OK",
        label: "Oklahoma"
    },
    {
        value: "OR",
        label: "Oregon"
    },
    {
        value: "PA",
        label: "Pennsylvania"
    },
    {
        value: "RI",
        label: "Rhode Island"
    },
    {
        value: "SC",
        label: "South Carolina"
    },
    {
        value: "SD",
        label: "South Dakota"
    },
    {
        value: "TN",
        label: "Tennessee"
    },
    {
        value: "TX",
        label: "Texas"
    },
    {
        value: "UT",
        label: "Utah"
    },
    {
        value: "VT",
        label: "Vermont"
    },
    {
        value: "VA",
        label: "Virginia"
    },
    {
        value: "WA",
        label: "Washington"
    },
    {
        value: "WV",
        label: "West Virginia"
    },
    {
        value: "WI",
        label: "Wisconsin"
    },
    {
        value: "WY",
        label: "Wyoming"
    },
    {
        value: "DC",
        label: "District of Columbia"
    }
];
function useOtherSectionData(estatePlanId, section) {
    const sectionData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$convex$2f$dist$2f$esm$2f$react$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$convex$2f$_generated$2f$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].queries.getIntakeSection, estatePlanId ? {
        estatePlanId: estatePlanId,
        section
    } : "skip");
    if (sectionData === undefined) {
        return {
            data: null,
            isLoading: true
        };
    }
    if (!sectionData?.data) {
        return {
            data: null,
            isLoading: false
        };
    }
    try {
        return {
            data: JSON.parse(sectionData.data),
            isLoading: false
        };
    } catch  {
        return {
            data: null,
            isLoading: false
        };
    }
}
}),
"[project]/app/components/ui/Skeleton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkeletonCard",
    ()=>SkeletonCard,
    "SkeletonForm",
    ()=>SkeletonForm,
    "SkeletonList",
    ()=>SkeletonList,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg"
};
const Skeleton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ variant = "text", width, height, lines = 1, className = "", style, ...props }, ref)=>{
    const baseStyle = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style
    };
    if (lines > 1) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: ref,
            className: `space-y-2 ${className}`,
            ...props,
            children: Array.from({
                length: lines
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `
                animate-shimmer
                ${variantStyles[variant]}
                ${!height ? "h-4" : ""}
                ${!width && i === lines - 1 ? "w-3/4" : !width ? "w-full" : ""}
              `,
                    style: baseStyle
                }, i, false, {
                    fileName: "[project]/app/components/ui/Skeleton.tsx",
                    lineNumber: 43,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/app/components/ui/Skeleton.tsx",
            lineNumber: 41,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `
          animate-shimmer
          ${variantStyles[variant]}
          ${!height ? "h-4" : ""}
          ${!width ? "w-full" : ""}
          ${className}
        `,
        style: baseStyle,
        ...props
    }, void 0, false, {
        fileName: "[project]/app/components/ui/Skeleton.tsx",
        lineNumber: 59,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Skeleton.displayName = "Skeleton";
function SkeletonCard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        variant: "circular",
                        width: 48,
                        height: 48
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                width: "60%",
                                height: 20,
                                className: "mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ui/Skeleton.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                width: "40%",
                                height: 16
                            }, void 0, false, {
                                fileName: "[project]/app/components/ui/Skeleton.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                lines: 3
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Skeleton.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
function SkeletonList({ count = 5 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: Array.from({
            length: count
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        variant: "circular",
                        width: 40,
                        height: 40
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                width: "70%",
                                height: 16,
                                className: "mb-1"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ui/Skeleton.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                width: "50%",
                                height: 14
                            }, void 0, false, {
                                fileName: "[project]/app/components/ui/Skeleton.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/components/ui/Skeleton.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
function SkeletonForm() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        width: 80,
                        height: 16,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        height: 40,
                        variant: "rectangular"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        width: 100,
                        height: 16,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        height: 40,
                        variant: "rectangular"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        width: 120,
                        height: 16,
                        className: "mb-2"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        height: 80,
                        variant: "rectangular"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ui/Skeleton.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                width: 120,
                height: 44,
                variant: "rectangular"
            }, void 0, false, {
                fileName: "[project]/app/components/ui/Skeleton.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ui/Skeleton.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = Skeleton;
}),
"[project]/app/components/ExtractedBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtractedBadge",
    ()=>ExtractedBadge,
    "ExtractedDataBanner",
    ()=>ExtractedDataBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function ExtractedBadge() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-3 h-3",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                }, void 0, false, {
                    fileName: "[project]/app/components/ExtractedBadge.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/ExtractedBadge.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "From Document"
            }, void 0, false, {
                fileName: "[project]/app/components/ExtractedBadge.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ExtractedBadge.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
function ExtractedDataBanner() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 flex-shrink-0",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ExtractedBadge.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/ExtractedBadge.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: [
                        "Some fields have been pre-filled from your uploaded documents. Look for the",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ExtractedBadge, {}, void 0, false, {
                            fileName: "[project]/app/components/ExtractedBadge.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        " badge. Review and update as needed."
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExtractedBadge.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExtractedBadge.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ExtractedBadge.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/intake/personal/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PersonalPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/IntakeProgress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/IntakeNavigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/FormFields.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$intake$2f$useIntakeForm$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/intake/useIntakeForm.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/Skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExtractedBadge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const DEFAULT_DATA = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    maritalStatus: "",
    citizenship: "us_citizen"
};
const MARITAL_STATUS_OPTIONS = [
    {
        value: "single",
        label: "Single",
        description: "Never been married"
    },
    {
        value: "married",
        label: "Married",
        description: "Currently legally married"
    },
    {
        value: "divorced",
        label: "Divorced",
        description: "Previously married, now legally divorced"
    },
    {
        value: "widowed",
        label: "Widowed",
        description: "Spouse has passed away"
    },
    {
        value: "separated",
        label: "Legally Separated",
        description: "Married but legally separated"
    },
    {
        value: "domestic_partnership",
        label: "Domestic Partnership",
        description: "Registered domestic partnership"
    }
];
const SUFFIX_OPTIONS = [
    {
        value: "",
        label: "None"
    },
    {
        value: "Jr.",
        label: "Jr."
    },
    {
        value: "Sr.",
        label: "Sr."
    },
    {
        value: "II",
        label: "II"
    },
    {
        value: "III",
        label: "III"
    },
    {
        value: "IV",
        label: "IV"
    }
];
function PersonalFormContent() {
    const { formData, updateField, saveAndExit, saveAndContinue, isSubmitting, estatePlanId, completedSteps, isLoading, saveStatus, lastSaved, nextStepLabel, isFieldExtracted, hasExtractedData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$intake$2f$useIntakeForm$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIntakeForm"])("personal", DEFAULT_DATA);
    // Validate required fields
    const canContinue = formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.dateOfBirth !== "" && formData.state !== "" && formData.maritalStatus !== "";
    if (!estatePlanId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-md mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-16 h-16 mx-auto text-gray-400 mb-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 1.5,
                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        }, void 0, false, {
                            fileName: "[project]/app/intake/personal/page.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-gray-900 dark:text-white mb-2",
                        children: "No Estate Plan Found"
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 dark:text-gray-400 mb-4",
                        children: "Please start from the beginning to create your estate plan."
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/intake",
                        className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
                        children: "Start New Estate Plan"
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/intake/personal/page.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/intake/personal/page.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this);
    }
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/app/intake/personal/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SkeletonForm"], {}, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/intake/personal/page.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/intake/personal/page.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8 animate-fadeIn",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                currentStep: "personal",
                completedSteps: completedSteps,
                estatePlanId: estatePlanId
            }, void 0, false, {
                fileName: "[project]/app/intake/personal/page.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-gray-900 dark:text-white",
                        children: "Personal Information"
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-400 mt-2",
                        children: "Let's start with your basic information. This will be used to personalize your estate planning documents."
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    hasExtractedData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExtractedDataBanner"], {}, void 0, false, {
                            fileName: "[project]/app/intake/personal/page.tsx",
                            lineNumber: 140,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/intake/personal/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8 space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormSection"], {
                        title: "Legal Name",
                        description: "Enter your full legal name exactly as it appears on official documents like your driver's license or passport",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            "First Name ",
                                            isFieldExtracted("firstName") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExtractedBadge"], {}, void 0, false, {
                                                fileName: "[project]/app/intake/personal/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 109
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 22
                                    }, void 0),
                                    required: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                        value: formData.firstName,
                                        onChange: (v)=>updateField("firstName", v),
                                        placeholder: "John",
                                        autoComplete: "given-name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: "Middle Name",
                                    hint: "Optional",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                        value: formData.middleName,
                                        onChange: (v)=>updateField("middleName", v),
                                        placeholder: "William",
                                        autoComplete: "additional-name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            "Last Name ",
                                            isFieldExtracted("lastName") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExtractedBadge"], {}, void 0, false, {
                                                fileName: "[project]/app/intake/personal/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 107
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 22
                                    }, void 0),
                                    required: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                        value: formData.lastName,
                                        onChange: (v)=>updateField("lastName", v),
                                        placeholder: "Smith",
                                        autoComplete: "family-name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: "Suffix",
                                    hint: "Jr., Sr., III, etc.",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                        value: formData.suffix,
                                        onChange: (v)=>updateField("suffix", v),
                                        options: SUFFIX_OPTIONS,
                                        placeholder: "Select suffix (if any)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/intake/personal/page.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormSection"], {
                        title: "Date of Birth",
                        description: "Your age may affect certain estate planning strategies",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-xs",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                label: "Date of Birth",
                                required: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                    type: "date",
                                    value: formData.dateOfBirth,
                                    onChange: (v)=>updateField("dateOfBirth", v)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/intake/personal/page.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/intake/personal/page.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormSection"], {
                        title: "Contact Information",
                        description: "How can we reach you regarding your estate plan?",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: "Email Address",
                                    helpText: "We'll use this to send you important updates",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                        type: "email",
                                        value: formData.email,
                                        onChange: (v)=>updateField("email", v),
                                        placeholder: "john.smith@email.com",
                                        autoComplete: "email",
                                        inputMode: "email"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                    label: "Phone Number",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                        type: "tel",
                                        value: formData.phone,
                                        onChange: (v)=>updateField("phone", v),
                                        placeholder: "(555) 123-4567",
                                        autoComplete: "tel",
                                        inputMode: "tel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/intake/personal/page.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormSection"], {
                        title: "Current Address",
                        description: "Your state of residence determines which laws apply to your estate plan",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                label: "Street Address",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                    value: formData.streetAddress,
                                    onChange: (v)=>updateField("streetAddress", v),
                                    placeholder: "123 Main Street",
                                    autoComplete: "street-address"
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/intake/personal/page.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                        label: "City",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                            value: formData.city,
                                            onChange: (v)=>updateField("city", v),
                                            placeholder: "San Francisco",
                                            autoComplete: "address-level2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/intake/personal/page.tsx",
                                            lineNumber: 254,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                        label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                "State ",
                                                isFieldExtracted("state") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExtractedBadge"], {}, void 0, false, {
                                                    fileName: "[project]/app/intake/personal/page.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 100
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/intake/personal/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 22
                                        }, void 0),
                                        required: true,
                                        helpText: "This determines which state laws apply to your estate",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                            value: formData.state,
                                            onChange: (v)=>updateField("state", v),
                                            options: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$intake$2f$useIntakeForm$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["US_STATES"],
                                            placeholder: "Select state"
                                        }, void 0, false, {
                                            fileName: "[project]/app/intake/personal/page.tsx",
                                            lineNumber: 266,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                        label: "ZIP Code",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextInput"], {
                                            value: formData.zipCode,
                                            onChange: (v)=>updateField("zipCode", v),
                                            placeholder: "94102",
                                            autoComplete: "postal-code",
                                            inputMode: "numeric",
                                            maxLength: 10
                                        }, void 0, false, {
                                            fileName: "[project]/app/intake/personal/page.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/intake/personal/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/intake/personal/page.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormSection"], {
                        title: "Marital Status",
                        description: "Your marital status significantly impacts how your estate is distributed",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormField"], {
                                label: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        "Current Marital Status ",
                                        isFieldExtracted("maritalStatus") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExtractedBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExtractedBadge"], {}, void 0, false, {
                                            fileName: "[project]/app/intake/personal/page.tsx",
                                            lineNumber: 292,
                                            columnNumber: 123
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 292,
                                    columnNumber: 20
                                }, void 0),
                                required: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RadioGroup"], {
                                    name: "maritalStatus",
                                    value: formData.maritalStatus,
                                    onChange: (v)=>updateField("maritalStatus", v),
                                    options: MARITAL_STATUS_OPTIONS,
                                    columns: 2
                                }, void 0, false, {
                                    fileName: "[project]/app/intake/personal/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/intake/personal/page.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            formData.maritalStatus === "married" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$FormFields$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InfoBox"], {
                                type: "info",
                                title: "Married Couples",
                                children: "In the next section, we'll ask about your spouse. Many estate planning documents require spousal information, and some states have community property laws that affect asset distribution."
                            }, void 0, false, {
                                fileName: "[project]/app/intake/personal/page.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/intake/personal/page.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$IntakeNavigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                currentStep: "personal",
                estatePlanId: estatePlanId,
                onSaveAndExit: saveAndExit,
                onSaveAndContinue: saveAndContinue,
                isSubmitting: isSubmitting,
                canContinue: canContinue,
                saveStatus: saveStatus,
                lastSaved: lastSaved,
                nextStepLabel: nextStepLabel
            }, void 0, false, {
                fileName: "[project]/app/intake/personal/page.tsx",
                lineNumber: 313,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/intake/personal/page.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
function PersonalPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/app/intake/personal/page.tsx",
                    lineNumber: 333,
                    columnNumber: 11
                }, void 0),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SkeletonForm"], {}, void 0, false, {
                        fileName: "[project]/app/intake/personal/page.tsx",
                        lineNumber: 335,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/intake/personal/page.tsx",
                    lineNumber: 334,
                    columnNumber: 11
                }, void 0)
            ]
        }, void 0, true, {
            fileName: "[project]/app/intake/personal/page.tsx",
            lineNumber: 332,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PersonalFormContent, {}, void 0, false, {
            fileName: "[project]/app/intake/personal/page.tsx",
            lineNumber: 340,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/intake/personal/page.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_1c49937a._.js.map
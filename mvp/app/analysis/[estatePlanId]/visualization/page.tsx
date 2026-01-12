"use client";

import { useState, useMemo, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Tabs, TabPanel } from "../../../components/ui/Tabs";
import Button from "../../../components/ui/Button";
import {
  EstateVisualization,
  EstateStats,
  parseIntakeToEstateData,
} from "../../../components/EstateVisualization";
import AssetFlowDiagram from "../../../components/AssetFlowDiagram";
import BeneficiaryCards from "../../../components/BeneficiaryCards";

// Scenario simulation type
interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  modifications: {
    removeBeneficiary?: string;
    adjustPercentages?: Record<string, number>;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "spouse_first",
    name: "Spouse Passes First",
    description: "What happens if your spouse passes before you?",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    modifications: {
      removeBeneficiary: "Spouse",
    },
  },
  {
    id: "simultaneous",
    name: "Simultaneous Death",
    description: "What if both you and your spouse pass together?",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    modifications: {
      removeBeneficiary: "Spouse",
    },
  },
  {
    id: "equal_split",
    name: "Equal Split Among Children",
    description: "Distribution if everything goes to children equally",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    modifications: {
      removeBeneficiary: "Spouse",
    },
  },
];

export default function VisualizationPage() {
  const params = useParams();
  const estatePlanId = params.estatePlanId as Id<"estatePlans">;

  const [activeTab, setActiveTab] = useState("distribution");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Fetch data
  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId });
  const intakeData = useQuery(api.queries.getIntakeData, { estatePlanId });
  const beneficiaryDesignations = useQuery(api.queries.getBeneficiaryDesignations, { estatePlanId });

  // Parse intake data into estate visualization format
  const estateData = useMemo(() => {
    if (!intakeData) return null;
    return parseIntakeToEstateData(intakeData, beneficiaryDesignations || []);
  }, [intakeData, beneficiaryDesignations]);

  // Apply scenario modifications
  const scenarioData = useMemo(() => {
    if (!estateData || !selectedScenario) return estateData;

    const scenario = SCENARIOS.find((s) => s.id === selectedScenario);
    if (!scenario) return estateData;

    // Clone the data
    const modified = { ...estateData };

    // Remove beneficiary if specified
    if (scenario.modifications.removeBeneficiary) {
      modified.beneficiaries = estateData.beneficiaries.filter(
        (b) => b.relationship !== scenario.modifications.removeBeneficiary
      );

      // Redistribute to remaining beneficiaries
      if (modified.beneficiaries.length > 0) {
        const newPercentage = 100 / modified.beneficiaries.length;
        const newValue = estateData.totalValue / modified.beneficiaries.length;
        modified.beneficiaries = modified.beneficiaries.map((b) => ({
          ...b,
          percentage: newPercentage,
          value: newValue,
        }));
      }
    }

    return modified;
  }, [estateData, selectedScenario]);

  const displayData = scenarioData || estateData;

  // Loading state
  if (estatePlan === undefined || intakeData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (estatePlan === null) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Estate Plan Not Found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "distribution", label: "Distribution" },
    { id: "flow", label: "Asset Flow" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "scenarios", label: "What-If" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link href={`/analysis/${estatePlanId}`} className="hover:text-blue-600">
              Analysis
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Estate Visualization</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Estate Distribution
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {estatePlan.name || "My Estate Plan"} — Visual breakdown of your estate
              </p>
            </div>
            <Link href={`/analysis/${estatePlanId}`}>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats overview */}
        {displayData && (
          <div className="mb-8">
            <EstateStats data={displayData} />
          </div>
        )}

        {/* Scenario indicator */}
        {selectedScenario && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Viewing Scenario: {SCENARIOS.find((s) => s.id === selectedScenario)?.name}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {SCENARIOS.find((s) => s.id === selectedScenario)?.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedScenario(null)}
              className="text-amber-700 hover:text-amber-900 dark:text-amber-300"
            >
              Clear Scenario
            </Button>
          </div>
        )}

        {/* Tab navigation and content */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <TabPanel tabId="distribution">
            {displayData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Distribution by Beneficiary
                  </h3>
                  <EstateVisualization data={displayData} height={350} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Key Insights
                  </h3>
                  <div className="space-y-4">
                    {/* Insights cards */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">Beneficiaries</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {displayData.beneficiaries.length} beneficiar{displayData.beneficiaries.length === 1 ? "y" : "ies"} will receive your estate assets
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">Probate Avoidance</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {displayData.assets.filter((a) => a.bypassesProbate).length} of {displayData.assets.length} assets bypass probate through beneficiary designations
                      </p>
                    </div>

                    {displayData.warnings.length > 0 && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="font-medium text-amber-800 dark:text-amber-200">Attention Needed</span>
                        </div>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          {displayData.warnings.length} issue{displayData.warnings.length === 1 ? "" : "s"} detected that may need your attention
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </TabPanel>

          <TabPanel tabId="flow">
            {displayData ? (
              <AssetFlowDiagram
                assets={displayData.assets}
                beneficiaries={displayData.beneficiaries}
                totalValue={displayData.totalValue}
              />
            ) : (
              <EmptyState />
            )}
          </TabPanel>

          <TabPanel tabId="beneficiaries">
            {displayData ? (
              <BeneficiaryCards
                beneficiaries={displayData.beneficiaries}
                assets={displayData.assets}
                totalValue={displayData.totalValue}
              />
            ) : (
              <EmptyState />
            )}
          </TabPanel>

          <TabPanel tabId="scenarios">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What-If Scenarios
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Explore how your estate distribution changes under different circumstances.
                  Select a scenario to see the impact on your beneficiaries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id === selectedScenario ? null : scenario.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedScenario === scenario.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                      selectedScenario === scenario.id
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {scenario.icon}
                    </div>
                    <h4 className={`font-semibold ${
                      selectedScenario === scenario.id
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {scenario.name}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      selectedScenario === scenario.id
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {scenario.description}
                    </p>
                    {selectedScenario === scenario.id && (
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Active
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Scenario comparison */}
              {selectedScenario && displayData && estateData && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Distribution Comparison
                  </h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Current Plan</p>
                      <div className="space-y-2">
                        {estateData.beneficiaries.map((b) => (
                          <div key={b.name} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{b.name}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {b.percentage.toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">With Scenario</p>
                      <div className="space-y-2">
                        {displayData.beneficiaries.length > 0 ? (
                          displayData.beneficiaries.map((b) => (
                            <div key={b.name} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{b.name}</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {b.percentage.toFixed(0)}%
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            No remaining beneficiaries — contingent beneficiaries would receive assets
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> These scenarios are simplified illustrations. Actual distribution
                depends on your complete estate plan, state laws, and specific beneficiary designations.
                Consult with an estate planning attorney to ensure your wishes are properly documented
                for all scenarios.
              </div>
            </div>
          </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Data Available
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Complete your estate planning intake form to see your estate visualization.
        We need information about your assets, family, and goals.
      </p>
      <Link
        href="/intake"
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Intake
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
